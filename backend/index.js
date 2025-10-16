const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/task.routes');

const app = express();
app.use(cors());
// we use multer for formData, so don't use bodyParser for multipart
app.use(express.json()); // for JSON endpoints (not multipart)

// Prefer 127.0.0.1 to avoid localhost resolving to IPv6 (::1) on some systems
// which can cause ECONNREFUSED when MongoDB is only listening on IPv4.
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskdb';
// Mongoose v6+ and MongoDB Node.js Driver 4+ set the recommended parser/topology
// options by default. Passing `useNewUrlParser` or `useUnifiedTopology` is
// deprecated and has no effect, so call connect without those options.
// Connect without deprecated options (Mongoose v6+ uses sensible defaults).
// Add more helpful diagnostics and a small retry loop so transient issues
// (or starting MongoDB after the app) are handled gracefully.
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
