import express from 'express';
import cors from 'cors';
import { config } from './config';
import { connectDatabase } from './database/connection';
import routes from './routes';
import { healthCheck, errorHandler, notFoundHandler } from './middleware';

const app = express();

// Middleware
app.use(cors({
  origin: '*',
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

// Connect to database on cold start (Vercel serverless)
let dbConnected = false;

const ensureDbConnected = async () => {
  if (!dbConnected) {
    try {
      await connectDatabase();
      dbConnected = true;
      console.log('Connected to CognoDB');
    } catch (error) {
      console.error('Database connection failed:', error);
    }
  }
};

// Connect on module load (cold start)
ensureDbConnected();

// For local development
if (process.env.NODE_ENV !== 'production') {
  const port = config.server.port;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
