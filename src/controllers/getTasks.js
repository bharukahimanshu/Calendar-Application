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
    // Get the current UTC time and convert it to IST
    const userISTTime = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
    console.log(userISTTime);
    userISTTime.setUTCHours(0, 0, 0, 0);
    console.log(userISTTime);

    const endDate = new Date(userISTTime.getTime() + 86400000);
    console.log(endDate);

    const startUTCTime = new Date(userISTTime.getTime() + userISTTime.getTimezoneOffset() * 60000);
    // Convert endDate to UTC
    const endUTCTime = new Date(endDate.getTime() + endDate.getTimezoneOffset() * 60000);

    console.log(startUTCTime);
    console.log(endUTCTime);
    
    defaultQuery.dueDate = {
      $gte: startUTCTime.toISOString(),
      $lt: endUTCTime.toISOString()  
    };

    // Check if a date range is provided in the request body
    if (req.query.startDate && req.query.endDate) {
      // Convert the start and end dates to UTC timezone (ignoring time)
      console.log("Range search")
      const startLocalDate = new Date(req.query.startDate); // Assuming user inputs local dates
      const endLocalDate = new Date(req.query.endDate); // Assuming user inputs local dates
      // console.log(startLocalDate);
      // console.log(endLocalDate);
  
      // Convert local dates to UTC dates by adding/subtracting the time zone offset
      const startUTCDate = new Date(startLocalDate.getTime() + (startLocalDate.getTimezoneOffset() * 60000));
      const endUTCDate = new Date(endLocalDate.getTime() + (endLocalDate.getTimezoneOffset() * 60000));
  
      // Update the query to find tasks within the specified date range
      defaultQuery.dueDate = {
          $gte: startUTCDate.toISOString(),
          $lt: new Date(endUTCDate.getTime() + 24 * 60 * 60 * 1000).toISOString() // Increment endDate by one day to include tasks on endDate
      };
  }

  if (req.query.phone_no) {
    console.log("Phone number filter applied"); 
    defaultQuery.related_to = req.query.phone_no;
  }

  // console.log(defaultQuery);

    // Query the database
    const tasks = await Task.find(defaultQuery);

    // Convert retrieved datetime values from UTC to the local time of the user
    const tasksInLocalTime = await Promise.all(tasks.map(async task => {
      const creatorId = task.creator;
      const creator = await User.findById(creatorId); // Wait for the promise to resolve
      return {
        _id:task._id,
        title: task.title,
        description: task.description,
        dueDate: new Date(task.dueDate.getTime() - userUTCTime.getTimezoneOffset() * 60000),
        status: task.status,
        creatorPhone: creator.phone_no,
        creatorName: creator.name,
        creatorMail: creator.email,
        related_to: task.related_to,
        statusChangeHistory: task.statusChangeHistory.map(change => ({
            previousStatus: change.previousStatus,
            newStatus: change.newStatus,
            timestamp: new Date(change.timestamp.getTime() - userUTCTime.getTimezoneOffset() * 60000)
        }))
      };
  }));
  

    res.json(tasksInLocalTime);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = getTasks;
