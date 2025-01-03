const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const cluster = require('cluster');
const os = require('os');
require('express-async-errors'); // Automatically handles async errors

// Load environment variables
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://admin:admin@cluster0.09ahukh.mongodb.net/quizlearn?retryWrites=true&w=majority&appName=Cluster0';
// Initialize Express app
const app = express();

// Middleware for security
app.use(helmet());

// Middleware for logging
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

// Middleware for request body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Middleware for compression
app.use(compression());

// Configure CORS for localhost and production
const allowedOrigins = [
  'http://localhost:3000', // React localhost
  process.env.PRODUCTION_DOMAIN || 'https://quizlearn-five.vercel.app/', // React production domain
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// Rate Limiter to handle high request volume
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1000, // Limit each IP to 1000 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

app.use(limiter);

// MongoDB Configuration
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

// Import Routes
const questionnaireRoute = require('./routers/questionnaireRoute'); // Routes will be organized in a separate folder/file
const categoriesRouter = require('./routers/categoriesRouter');
const quizTypeRouter = require('./routers/quizTypeRouter');

// Use Routes
app.use('/questionnaire', questionnaireRoute);
app.use('/categories', categoriesRouter);
app.use('/quiztype', quizTypeRouter);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
});

// // Handle 404
// app.use((req, res) => {
//   res.status(404).json({ error: 'API route not found' });
// });

// Graceful Shutdown
const gracefulShutdown = () => {
  console.log('Shutting down server...');
  process.exit();
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Cluster Configuration for Scalability
// if (require.main === module) {
//   if (cluster.isMaster) {
//     const numCPUs = os.cpus().length;
//     console.log(`Master process is running on PID ${process.pid}`);
//     console.log(`Starting ${numCPUs} worker processes...`);

//     for (let i = 0; i < numCPUs; i++) {
//       cluster.fork();
//     }

//     cluster.on('exit', (worker) => {
//       console.log(`Worker ${worker.process.pid} died. Starting a new one...`);
//       cluster.fork();
//     });
//   } else {
//     app.listen(PORT, () => {
//       console.log(`Worker process running on PID ${process.pid}, Server started on port ${PORT}`);
//     });
//   }
// }

app.listen(PORT, () => {
  console.log(`Worker process running on PID ${process.pid}`);
  console.log(`Server started http://localhost:${PORT}`)
});
