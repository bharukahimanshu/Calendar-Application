const Task = require('../models//tasks');

async function logStatusChange(taskId, previousStatus, newStatus) {
  try {
    const task = await Task.findById(taskId);

    const statusChange = {
      previousStatus,
      newStatus,
      timestamp: new Date(),
    };

    await Task.findByIdAndUpdate(taskId, {
      $push: { statusChangeHistory: statusChange },
    });

    await task.save();
    console.log('Status change logged successfully');

  } catch (error) {
    console.error('Error logging status change:', error);
  }
}

async function editTask(req, res) {
  try {
    const taskId = req.params.taskId;
    const { title, description, dueDate, status, related_to} = req.body;
    const userId = req.user._id;
    console.log(taskId);

    // Find the task by ID
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.creator.toString()!== userId.toString()) {
      return res.status(403).json({ error: 'You are not authorized to edit this task' });
    }

    // Update task properties with the provided fields
    const previousStatus = task.status;

    if (title) task.title = title;
    if (description) task.description = description;
    if (dueDate) task.dueDate = dueDate;
    if (related_to) task.related_to = related_to;
    if (status) {
      task.status = status;
      // Log status change
      await logStatusChange(taskId, previousStatus, status);
    }
      // Save the updated task
    await task.save();
    

    res.json({ message: 'Task updated successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = editTask;
