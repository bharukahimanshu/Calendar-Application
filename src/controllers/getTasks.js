const User = require('../models/user');
const Task = require('../models/tasks');

async function getTasks(req, res) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let defaultQuery;

    // Check if user is admin
    if (user.role === 'Admin') {
      // Admin can view all tasks
      defaultQuery = {};
    } else if (user.role === 'Agent') {
      // Agent can only view their own tasks
      defaultQuery = { creator: userId };
    } else {
      // Unauthorized user role
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Get the local time of the user
    const userUTCTime = new Date();
    // console.log(userUTCTime);
 
    // const userUTCDateTime = new Date(Date.UTC(userUTCTime.getUTCFullYear(), userUTCTime.getUTCMonth(), userUTCTime.getUTCDate()));
    const dateString = userUTCTime.toISOString();
 
    const userUTCDate = dateString.split('T')[0];;
    
    console.log(userUTCDate); // Output: "YYYY-MM-DD"
    // Default query to find tasks for today's date in UTC timezone
    defaultQuery.dueDate = {
        // Filter tasks with dueDate equal to today's date in UTC (ignoring time)
        $gte: userUTCDate, // Today's date
        $lt: new Date(new Date(userUTCDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Next day's date
   
    };

    

    // Check if a date range is provided in the request body
    if (req.body.startDate && req.body.endDate) {
      // Convert the start and end dates to UTC timezone (ignoring time)
      const startLocalDate = new Date(req.body.startDate); // Assuming user inputs local dates
      const endLocalDate = new Date(req.body.endDate); // Assuming user inputs local dates
  
      // Convert local dates to UTC dates by adding/subtracting the time zone offset
      const startUTCDate = new Date(startLocalDate.getTime() - (startLocalDate.getTimezoneOffset() * 60000));
      const endUTCDate = new Date(endLocalDate.getTime() - (endLocalDate.getTimezoneOffset() * 60000));
  
      // Update the query to find tasks within the specified date range
      defaultQuery.dueDate = {
          $gte: startUTCDate.toISOString().split('T')[0],
          $lte: new Date(endUTCDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Increment endDate by one day to include tasks on endDate
      };
  }
  console.log(defaultQuery);
  
    // Query the database
    const tasks = await Task.find(defaultQuery);

    // Convert retrieved datetime values from UTC to the local time of the user
    const tasksInLocalTime = tasks.map(task => ({
      title: task.title,
      description: task.description,
      dueDate: new Date(task.dueDate.getTime() - userUTCTime.getTimezoneOffset() * 60000), // Adjust dueDate to user's local time
      status: task.status,
      creatorPhone: user.phone_no // Assuming phone_no is a field in the User model
    }));

    res.json(tasksInLocalTime);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = getTasks;
