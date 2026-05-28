const express = require('express');
const Project = require('../../models/Project');
const protect = require('../../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', async (req, res) => {
  try {
    const project = await Project.create({
      name: req.body.name,
      description: req.body.description,
      user: req.user._id
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({
      user: req.user._id
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

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

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

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

    project.name = req.body.name || project.name;
    project.description =
      req.body.description || project.description;

    const updatedProject = await project.save();

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

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

    await project.deleteOne();

    res.json({
      message: 'Project deleted'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;