const express = require('express');
const Task = require('../../models/Task');
const Project = require('../../models/Project');
const protect = require('../../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/projects/:projectId/tasks', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: 'Not authorized'
      });
    }

    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      project: project._id
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/projects/:projectId/tasks', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: 'Not authorized'
      });
    }

    const tasks = await Task.find({
      project: req.params.projectId
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/tasks/:taskId', async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found'
      });
    }

    const project = await Project.findById(task.project);

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: 'Not authorized'
      });
    }

    task.title = req.body.title || task.title;
    task.description =
      req.body.description || task.description;
    task.status = req.body.status || task.status;

    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/tasks/:taskId', async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found'
      });
    }

    const project = await Project.findById(task.project);

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: 'Not authorized'
      });
    }

    await task.deleteOne();

    res.json({
      message: 'Task deleted'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;