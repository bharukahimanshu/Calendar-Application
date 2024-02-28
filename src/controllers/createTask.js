const tasks = require('../models/tasks'); // Assuming you have a tasks model
const users = require('../models/user');
const env = require('dotenv');
env.config();

async function createTask(req, res) {
  try {
    const creatorEmail = req.user.email;
    const creator = await users.findOne({ email: creatorEmail });

    if (!creator) {
      return res.status(404).send('Creator user not found');
    }

    const newTask = {
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      status: req.body.status || 'Open', // Default is Open
      creator: creator._id,
    };

    const createdTask = await tasks.create(newTask);

    res.send('Task created successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = createTask;
