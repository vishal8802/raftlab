import dotenv from 'dotenv';
dotenv.config();

import express, { NextFunction, Request, Response } from 'express';
import connectDB from './database/connection';
import { AuthRoute, UserRoute } from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/auth', AuthRoute);
app.use('/user', UserRoute);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong' });
});

// Start the server
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server started on port ${PORT}`);
});
