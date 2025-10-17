const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/task.routes');

const app = express();
app.use(cors());
// we use multer for formData, so don't use bodyParser for multipart
app.use(express.json()); // for JSON endpoints (not multipart)

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://milan:Ytt2x7yoO7u9oL3Z@cluster0.7zxiel4.mongodb.net/task-manager?retryWrites=true';

async function connectWithRetry() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Mongo connected');
  } catch (err) {
    // Helpful, compact error output for common failures (including TopologyUnknown)
    console.error('MongoDB connection error:', err && err.message ? err.message : err);
    console.error('Mongoose readyState:', mongoose.connection && mongoose.connection.readyState);
    console.error('If you see TopologyDescription { type: "Unknown" } it usually means MongoDB is not running or reachable at', MONGO_URI);
    // Retry after a delay. This helps if MongoDB is starting up concurrently.
    setTimeout(connectWithRetry, 5000);
  }
}

// Connection lifecycle events for runtime diagnostics
mongoose.connection.on('connected', () => console.log('Mongoose: connection established'));
mongoose.connection.on('error', (err) => console.error('Mongoose: connection error:', err));
mongoose.connection.on('disconnected', () => console.warn('Mongoose: disconnected from MongoDB'));

connectWithRetry();

app.use('/api/tasks', taskRoutes);

const port = process.env.PORT || 8082;
app.listen(port, ()=>console.log(`Server listening on ${port}`));
