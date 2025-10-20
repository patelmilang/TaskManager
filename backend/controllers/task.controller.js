
const TaskService = require("../services/task.service");

const TaskServiceInstance = new TaskService();

const getTasks = async (req, res) => {
  try {
    const tasks = await TaskServiceInstance.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createTask = async (req, res) => {
  try {
    console.log("Creating task with body:", req.body); // Debug log
    const { title, description, deadline } = req.body;
console.log("Request body:", req.body); // Debug log
    // If multer handled a file upload, req.file will be present
    const file = req.file;

    const taskPayload = {
      title,
      description,
      // ensure deadline is stored as a Date if provided
      deadline: deadline ? new Date(deadline) : undefined,
    };

    if (file) {
      taskPayload.fileName = file.originalname;
      taskPayload.filePath = file.path;
      taskPayload.fileMime = file.mimetype;
      taskPayload.fileSize = file.size;
    }

    const newTask = await TaskServiceInstance.create(taskPayload);
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await TaskServiceInstance.update(id, req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await TaskServiceInstance.delete(id);
    res.status(204).send(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};