// deleteUserFeature.js

// Import necessary modules
const express = require('express');
const router = express.Router();
const UserModel = require('../models/User'); // Assuming UserModel is the model for users
const { authentication, authorisation } = require('../middlewares/authMiddleware'); // Assuming these are your middleware functions

// Function to delete a user by username in authController.js
const delete_user_by_username = async (req, res) => {
    try {
        const { username } = req.body;

        // Check if the username is provided
        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        // Delete the user from the database
        const result = await UserModel.destroy({
            where: {
                username: username
            }
        });

        // Check if the user was found and deleted
        if (result === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Respond with success message
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).json({ message: "An error occurred while deleting the user" });
    }
};

// Route to handle the deletion of users in authHandling.js
router.post(
    "/delete/user",
    authentication,
    authorisation({ isAdmin: false }), // You can modify this depending on your authorization logic
    (req, res) => delete_user_by_username(req, res)
);

// Frontend JavaScript to handle the deletion form submission
document.getElementById("delete-user-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("other-username").value;

    try {
        const response = await fetch(`http://localhost:4001/auth/delete/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message); // Notify user of successful deletion
        } else {
            alert(data.message); // Notify user of any errors (e.g., user not found)
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
    }
});

// HTML form to be included in your page for deleting users
const deleteUserFormHTML = `
    <form id="delete-user-form">
        <label for="other-username">Enter Username to Delete:</label>
        <input type="text" id="other-username" name="other-username" required>
        <button type="submit">Delete User</button>
    </form>
`;

// Inject the form into the DOM (example: append to body)
document.body.insertAdjacentHTML('beforeend', deleteUserFormHTML);

// Export the router if needed
module.exports = router;
