// services/preferences-service/src/server.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import preferencesRoutes from './routes/preferences.routes';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/preferences', preferencesRoutes);
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4200;
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/mediatracker';

mongoose.connect(MONGO).then(() => {
  console.log('Connected to Mongo (prefs)');
  app.listen(PORT, () => console.log(`Preferences service running on ${PORT}`));
}).catch(err => console.error(err));
