const Task = require('../models/tasks');
const Customer = require('../models/customers');

async function updateTasksWithCustomerIds() {
    try {
        // Query all tasks
        const tasks = await Task.find();

        // Iterate over each task
        for (const task of tasks) { 
            if(!task.customerId){
                try {
                    // Find the customer based on the phone number
                    let customer = await Customer.findOne({ phone_no: task.related_to });
    
                    // If customer not found, create a new one
                    // if (!customer) {
                    //     // Ensure phone_no is provided
                    //     if (!task.related_to) {
                    //         console.error(`Error processing task ${task._id}: Related phone number is required.`);
                    //         continue; // Skip this task and proceed to the next one
                    //     }
    
                    //     // Create new customer
                    //     customer = await Customer.create({ phone_no: task.related_to });
                    // }
    
                    // Update task with customerId
                    await Task.findByIdAndUpdate(task._id, { customerId: customer._id });
    
                    // Update customer's tasks array
                    // await Customer.findByIdAndUpdate(customer._id, { $addToSet: { tasks: task._id } });
                } catch (error) {
                    console.error(`Error processing task ${task._id}:`, error);
                }
            }
        }

        console.log('Tasks updated with customer IDs successfully.');
    } catch (error) {
        console.error('Error updating tasks with customer IDs:', error);
    }
}



module.exports = updateTasksWithCustomerIds;