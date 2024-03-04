const tasks = require('../models/tasks'); // Assuming you have a tasks model
const users = require('../models/user');
const customers = require('../models/customers');
const env = require('dotenv');
env.config();

async function createTask(req, res) {
  try {
    const creatorEmail = req.user.email;
    const creator = await users.findOne({ email: creatorEmail });

    if (!creator) {
      return res.status(404).send('Creator user not found');
    }

    let customer = await customers.findOne({ phone_no: req.body.related_to });

    if (!customer) {
      const newCustomer = {
        phone_no: req.body.related_to
      };
      await customers.create(newCustomer);
      customer = await customers.findOne({ phone_no: req.body.related_to });
    }

    const newTask = {
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      customerId: customer._id,
      related_to: req.body.related_to, // User phone no
      status: req.body.status || 'Open', // Default is Open
      creator: creator._id
    };

    const task = await tasks.create(newTask);
    customer.tasks.push(task._id); // Corrected the assignment
    
    await customer.save(); // Save the updated customer
    
    res.send('Task created successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = createTask;
  