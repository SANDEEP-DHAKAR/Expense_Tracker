require('dotenv').config(); // Load environment variables from .env file
const app = require('./app');  // Import the Express app
const PORT = process.env.PORT || 5000;  // Use the PORT from environment variables or default to 5000

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});