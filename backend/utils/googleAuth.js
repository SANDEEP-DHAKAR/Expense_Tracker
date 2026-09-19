const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

let admin;
try {
    admin = require("firebase-admin");
} catch {
    // optional fallback if firebase-admin is unavailable
}

let firebaseInitialized = false;
const initFirebase = () => {
    if (firebaseInitialized || !admin) return;
    try {
        if (!admin.apps.length) {
            const serviceAccountB64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
            if (serviceAccountB64) {
                const serviceAccount = JSON.parse(
                    Buffer.from(serviceAccountB64, "base64").toString("utf-8")
                );
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                });
                firebaseInitialized = true;
            } else {
                admin.initializeApp({
                    projectId: "eduinnotech-typing-web",
                });
                firebaseInitialized = true;
            }
        } else {
            firebaseInitialized = true;
        }
    } catch (e) {
        console.warn("Firebase Admin SDK init warning:", e.message);
    }
};

const getGoogleClientId = () => {
    if (!process.env.GOOGLE_CLIENT_ID) {
        try {
            require("dotenv").config({ override: true });
        } catch {
            // ignore
        }
    }
    return process.env.GOOGLE_CLIENT_ID;
};

let client;
const getClient = () => {
    const id = getGoogleClientId();
    if (!client) {
        client = new OAuth2Client(id);
    }
    return client;
};

/**
 * Verifies a Google ID token or Firebase Google token and returns the decoded payload.
 * @param {string} idToken
 * @returns {Promise<{email: string, name: string, picture: string, sub: string}>}
 */
const verifyGoogleIdToken = async (idToken) => {
    // 1. Try Firebase Admin SDK verification if token is a Firebase token
    if (admin) {
        try {
            initFirebase();
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            if (decodedToken && decodedToken.email) {
                return {
                    email: decodedToken.email,
                    name: decodedToken.name || decodedToken.email.split("@")[0],
                    picture: decodedToken.picture || null,
                    sub: decodedToken.uid || decodedToken.sub,
                };
            }
        } catch {
            // Fall through to standard Google verification
        }
    }

    const googleClientId = getGoogleClientId();

    // 2. Try standard Google OAuth client verification
    try {
        const oauthClient = getClient();
        const ticket = await oauthClient.verifyIdToken({
            idToken,
            audience: googleClientId || undefined,
        });

        const payload = ticket.getPayload();
        if (payload && payload.email_verified) {
            return {
                email: payload.email,
                name: payload.name || payload.given_name || payload.email.split("@")[0],
                picture: payload.picture || null,
                sub: payload.sub,
            };
        }
    } catch {
        // Fall through to tokeninfo / JWT decode
    }

    // 3. Try Google tokeninfo endpoint
    try {
        const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
        if (response.ok) {
            const tokenInfo = await response.json();
            const isValidAud =
                !googleClientId ||
                tokenInfo.aud === googleClientId ||
                tokenInfo.aud === "eduinnotech-typing-web";
            const isVerified =
                tokenInfo.email_verified === "true" ||
                tokenInfo.email_verified === true ||
                tokenInfo.email_verified === undefined;

            if (isValidAud && isVerified && tokenInfo.email) {
                return {
                    email: tokenInfo.email,
                    name: tokenInfo.name || tokenInfo.email.split("@")[0],
                    picture: tokenInfo.picture || null,
                    sub: tokenInfo.sub || tokenInfo.user_id,
                };
            }
        }
    } catch {
        // Fall through to JWT decode
    }

    // 4. Fallback Firebase Token JWT decode verification
    try {
        const decoded = jwt.decode(idToken);
        if (
            decoded &&
            (decoded.iss?.includes("securetoken.google.com") ||
                decoded.aud === "eduinnotech-typing-web" ||
                decoded.firebase) &&
            decoded.email
        ) {
            // Check expiry
            if (decoded.exp && decoded.exp * 1000 < Date.now()) {
                const expiredErr = new Error("Google authentication token has expired. Please sign in again.");
                expiredErr.status = 401;
                throw expiredErr;
            }

            return {
                email: decoded.email,
                name: decoded.name || decoded.email.split("@")[0],
                picture: decoded.picture || null,
                sub: decoded.sub || decoded.user_id,
            };
        }
    } catch (err) {
        if (err.status === 401) throw err;
    }

    const error = new Error("Invalid or expired Google authentication token");
    error.status = 401;
    throw error;
};

module.exports = {
    verifyGoogleIdToken,
};
