// Import required modules
const express = require('express');
const router = express.Router();
const updateTasksWithCustomerIds = require('../controllers/updateTasks');

// Define the route to update tasks with customer IDs
router.get('/update-tasks', async (req, res) => {
    try {
        // Call the function to update tasks with customer IDs
        await updateTasksWithCustomerIds();

        // Send success response
        res.status(200).send('Tasks updated with customer IDs successfully.');
    } catch (error) {
        console.error('Error updating tasks with customer IDs:', error);
        // Send error response
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
