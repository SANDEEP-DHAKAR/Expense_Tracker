require('dotenv').config(); // Load environment variables from .env file
const app = require('./app');  // Import the Express app
const PORT = process.env.PORT || 5000;  // Use the PORT from environment variables or default to 5000

// Start the server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

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
