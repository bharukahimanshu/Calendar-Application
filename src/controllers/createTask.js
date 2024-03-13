const Task = require('../models/tasks');
const Users = require('../models/user');

async function createTask(req, res){
  try {
    // Extracting task details from request body
    const { title, description, dueDate, related_to, status } = req.body;
    const userId = req.user._id;
    
    // Creating a new task
    const dueDateUTC = new Date(dueDate).toISOString();
    console.log(dueDate);
    console.log(dueDateUTC);
    const task = new Task({
      title,
      description,
      dueDate: dueDateUTC,
      related_to,
      status
    });
    task.creator = userId;

    // Saving the task to the database
    await task.save();
    const user = await Users.findById(userId);
    user.tasks.push(task._id);

    await user.save();

    // Sending a success response
    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    // Handling errors
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = createTask;
