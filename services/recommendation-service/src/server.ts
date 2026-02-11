// services/recommendation-service/src/server.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import recRouter from './controllers/recommendation.controller';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/recommendations', recRouter);
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4100;
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/mediatracker';

mongoose.connect(MONGO).then(() => {
  console.log('Connected to Mongo (rec)');
  app.listen(PORT, () => console.log(`Recommendation service running on ${PORT}`));
}).catch(err => console.error(err));
