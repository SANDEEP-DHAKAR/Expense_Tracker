require('dotenv').config(); // Load environment variables from .env file
const app = require('./app');  // Import the Express app
const PORT = process.env.PORT || 5000;  // Use the PORT from environment variables or default to 5000

// Start the primary server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on 0.0.0.0:${PORT}`);
});

// Dual listener on port 3000 for Coolify/Traefik reverse proxy compatibility
if (Number(PORT) !== 3000) {
    try {
        const proxyServer = app.listen(3000, '0.0.0.0', () => {
            console.log('Proxy compatibility listener active on 0.0.0.0:3000');
        });
        proxyServer.on('error', (err) => {
            // Ignore if port 3000 is unavailable
        });
    } catch (e) {
        // Ignore
    }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    server.close(() => process.exit(1));
});
