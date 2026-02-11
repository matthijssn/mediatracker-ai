// services/media-service/src/server.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import mediaRouter from './routes/media.routes';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/media', mediaRouter);
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/mediatracker';

mongoose.connect(MONGO).then(() => {
  console.log('Connected to Mongo');
  // ensure text index for search
  mongoose.connection.db.collection('media').createIndex({ title: 'text', tags: 'text' }).catch(()=>{});
  app.listen(PORT, () => console.log(`Media service running on ${PORT}`));
}).catch(err => {
  console.error('Mongo connection error', err);
});
