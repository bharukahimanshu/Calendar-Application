const User = require('../models/user');
const Task = require('../models/tasks');

async function getTasks(req, res) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get the local time of the user
    const userLocalTime = new Date();

    // Convert user local time to UTC time
    const userUTCTime = new Date(userLocalTime.getTime() + userLocalTime.getTimezoneOffset() * 60000);

    // Default query to find tasks for today's date in UTC timezone
    const query = {
      creator: userId,
      dueDate: { $gte: userUTCTime.setHours(0, 0, 0, 0) } // Filter tasks with dueDate starting from today in UTC
    };

    // Check if a date range is provided in the query parameters
    if (req.query.startDate && req.query.endDate) {
      // Convert the start and end dates to UTC timezone
      const startDate = new Date(req.query.startDate);
      const endDate = new Date(req.query.endDate);
      // Update the query to find tasks within the specified date range in UTC timezone
      query.dueDate.$gte = startDate;
      query.dueDate.$lte = endDate;
    }

    // Query the database using UTC time
    const tasks = await Task.find(query);

    // Convert retrieved datetime values from UTC to the local time of the user
    const tasksInLocalTime = tasks.map(task => ({
      ...task.toObject(),
      dueDate: new Date(task.dueDate.getTime() - userLocalTime.getTimezoneOffset() * 60000)
    }));

    res.json(tasksInLocalTime);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = getTasks;
