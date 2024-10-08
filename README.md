
# Delete User Feature

This feature allows authenticated users to delete any user from the system by entering their username. The feature includes both backend and frontend components.

## 1. Backend Implementation

### 1.1. Function to Delete User
The function `delete_user_by_username` is implemented in `authController.js`:

```javascript
const delete_user_by_username = async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        const result = await UserModel.destroy({
            where: { username: username }
        });

        if (result === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while deleting the user" });
    }
};
```

### 1.2. Route Configuration
In `authHandling.js`, configure the route to handle user deletion:

```javascript
router.post(
    "/delete/user",
    authentication,
    authorisation({ isAdmin: false }),
    (req, res) => delete_user_by_username(req, res)
);
```

## 2. Frontend Implementation

### 2.1. User Deletion Form
A simple HTML form allows users to enter the username of the user they want to delete:

```html
<form id="delete-user-form">
    <label for="other-username">Enter Username to Delete:</label>
    <input type="text" id="other-username" name="other-username" required>
    <button type="submit">Delete User</button>
</form>
```

### 2.2. Form Submission Handler
JavaScript code handles the form submission and sends a request to the backend:

```javascript
document.getElementById("delete-user-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("other-username").value;

    try {
        const response = await fetch(`http://localhost:4001/auth/delete/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username })
        });

        const data = await response.json();
        alert(data.message);
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
    }
});
```

## 3. Usage
- Add the code to a new file named `deleteUserFeature.js`.
- Ensure necessary imports and dependencies are in place.
- Inject the HTML form in your web page where you want to allow user deletion.



### Challenge Part 2: Authentication vs. Authorization

#### Is It a Good Idea to Allow Deleting Users After Authentication?

The requirement to allow user deletion functionality after authentication is **not a good idea** without proper authorization checks. Authentication merely verifies the identity of the user, ensuring that the person accessing the system is who they claim to be. However, it does not determine what actions the user is allowed to perform within the system.

### Authentication vs. Authorization

- **Authentication**: This process confirms the user's identity, usually through a login process involving credentials like a username and password. It's the first step in security but doesn't manage what the user can do after logging in.

- **Authorization**: This process checks whether the authenticated user has the necessary permissions to perform specific actions, like deleting another user. Even if a user is authenticated, they should only be able to delete other users if they have the appropriate permissions (e.g., admin rights).

### Why They Are Different

- **Authentication** is about verifying identity.
- **Authorization** is about verifying permissions.

Allowing a user to delete other users based solely on authentication could lead to serious security risks, such as unauthorized users deleting critical accounts.

Here’s a simple diagram to visualize the difference between these two concepts:

![diagram.png](diagram.png)
