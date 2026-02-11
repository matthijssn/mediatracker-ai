// services/preferences-service/src/routes/preferences.routes.ts
import { Router } from 'express';
import Preferences from '../models/preferences.model';
const router = Router();

router.get('/', async (req, res) => {
  const userId = req.query.userId as string | undefined;
  const prefs = await Preferences.findOne(userId ? { userId } : {}).lean();
  res.json(prefs || { themeMode: 'light', themeVariant: 'default', fontSize: 'normal', density: 'comfortable' });
});

router.put('/', async (req, res) => {
  const { userId, ...data } = req.body as any;
  const filter = userId ? { userId } : {};
  const prefs = await Preferences.findOneAndUpdate(filter, data, { upsert: true, new: true });
  res.json(prefs);
});

export default router;