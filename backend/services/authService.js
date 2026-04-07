const { createUser, findUserByEmail } = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');

// Signup Service
const signupUser = async (name, email, password) => {
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
        throw new Error('User already exist karta hai is email se');
    }

    const hashedPassword = await hashPassword(password);

    const result = await createUser(name, email, hashedPassword);

    return { id: result.insertId, name, email };
};

// Login Service
const loginUser = async (email, password) => {
    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error('User not found');
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
        throw new Error('Invalid credentials hai bhai ye');
    }

    const token = generateToken(user);

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    };
};

module.exports = { signupUser, loginUser };