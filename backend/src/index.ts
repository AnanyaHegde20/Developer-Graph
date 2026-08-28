import express from 'express';
import cors from 'cors';
import { config } from './config';
<<<<<<< HEAD
<<<<<<< HEAD
import { connectDatabase } from './database/connection';
=======
import { connectDatabase, closeDatabase } from './database/connection';
>>>>>>> 99931b0 (DevGraph: CognoDB-backed developer skill graph application)
=======
import { connectDatabase } from './database/connection';
>>>>>>> 90cb9c8 (Add Vercel deployment config for frontend and backend)
import routes from './routes';
import { healthCheck, errorHandler, notFoundHandler } from './middleware';

const app = express();

// Middleware
app.use(cors({
  origin: config.server.nodeEnv === 'production'
    ? config.server.frontendUrl
    : ['http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', healthCheck);

// API routes
app.use('/api', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 90cb9c8 (Add Vercel deployment config for frontend and backend)
// Connect to database on cold start (Vercel serverless)
let dbConnected = false;

const ensureDbConnected = async () => {
  if (!dbConnected) {
    try {
      await connectDatabase();
      dbConnected = true;
    } catch (error) {
      console.error('Database connection failed:', error);
    }
<<<<<<< HEAD
  }
};

// For Vercel serverless
if (config.server.nodeEnv === 'production') {
  // Connect on module load (cold start)
  ensureDbConnected();
}

// For local development
if (config.server.nodeEnv !== 'production') {
  const startServer = async (): Promise<void> => {
    try {
      await connectDatabase();
      
      app.listen(config.server.port, () => {
        console.log(`Server running on port ${config.server.port}`);
        console.log(`Environment: ${config.server.nodeEnv}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };

  startServer();
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
=======
// Start server
const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    
    app.listen(config.server.port, () => {
      console.log(`Server running on port ${config.server.port}`);
      console.log(`Environment: ${config.server.nodeEnv}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
=======
>>>>>>> 90cb9c8 (Add Vercel deployment config for frontend and backend)
  }
};

// For Vercel serverless
if (config.server.nodeEnv === 'production') {
  // Connect on module load (cold start)
  ensureDbConnected();
}

// For local development
if (config.server.nodeEnv !== 'production') {
  const startServer = async (): Promise<void> => {
    try {
      await connectDatabase();
      
      app.listen(config.server.port, () => {
        console.log(`Server running on port ${config.server.port}`);
        console.log(`Environment: ${config.server.nodeEnv}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };

  startServer();
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
<<<<<<< HEAD
  await closeDatabase();
>>>>>>> 99931b0 (DevGraph: CognoDB-backed developer skill graph application)
=======
>>>>>>> 90cb9c8 (Add Vercel deployment config for frontend and backend)
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');
<<<<<<< HEAD
<<<<<<< HEAD
  process.exit(0);
});

=======
  await closeDatabase();
  process.exit(0);
});

startServer();

>>>>>>> 99931b0 (DevGraph: CognoDB-backed developer skill graph application)
=======
  process.exit(0);
});

>>>>>>> 90cb9c8 (Add Vercel deployment config for frontend and backend)
export default app;
