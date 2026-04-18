const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/db');
const { errorHandler } = require('./src/middleware/errorHandler.middleware');

// Load environment variables
dotenv.config();

// Connect to Database
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(morgan('dev'));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// Import Routes
const authRoutes = require('./src/routes/auth.routes');
const cvRoutes = require('./src/routes/cv.routes');
const jobsRoutes = require('./src/routes/jobs.routes');
const tailorRoutes = require('./src/routes/tailor.routes');
const coverLetterRoutes = require('./src/routes/coverLetter.routes');

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/tailor', tailorRoutes);
app.use('/api/cover-letter', coverLetterRoutes);

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app; // For testing
