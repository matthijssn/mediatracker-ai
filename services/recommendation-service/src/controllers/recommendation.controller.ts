// services/recommendation-service/src/controllers/recommendation.controller.ts
import { Router } from 'express';
import mongoose from 'mongoose';
const router = Router();

// Configurable weights for scoring
const WEIGHTS = { tag: 2, category: 1.2, platform: 1.1, favoriteBoost: 2 };

function scoreCandidate(originTags: Set<string>, originCat: string | undefined, originPlatform: string | undefined, candidate: any, favScore = 0) {
  const candidateTags = candidate.tags || [];
  const tagOverlap = candidateTags.filter((t:string) => originTags.has(t)).length;
  let score = (tagOverlap * WEIGHTS.tag) / (candidateTags.length || 1);
  if (originCat && candidate.category === originCat) score *= WEIGHTS.category;
  if (originPlatform && candidate.metadata && candidate.metadata.platform === originPlatform) score *= WEIGHTS.platform;
  score += favScore * WEIGHTS.favoriteBoost;
  return score;
}

router.get('/', async (req, res) => {
  const db = mongoose.connection.db;
  // get top-rated or favorited interactions
  const interactions = await db.collection('interactions').find().sort({ rating: -1, favorite: -1 }).limit(25).toArray();
  const mediaIds = interactions.map(i => new mongoose.Types.ObjectId(i.mediaId));

  const topMedia = await db.collection('media').find({ _id: { $in: mediaIds } }).toArray();
  const tags = new Set<string>();
  let avgCategory: string | undefined = undefined;
  let avgPlatform: string | undefined = undefined;
  if (topMedia.length) {
    topMedia.forEach((m: any) => (m.tags || []).forEach((t: string) => tags.add(t)));
    avgCategory = topMedia[0].category;
    avgPlatform = topMedia[0].metadata?.platform;
  }

  const candidates = await db.collection('media').find().limit(1000).toArray();

  const favMap = new Map<string, number>();
  interactions.forEach((it: any) => { if (it.favorite) favMap.set(String(it.mediaId), (favMap.get(String(it.mediaId)) || 0) + 1); });

  const scored = candidates.map((c: any) => ({ mediaId: c._id, score: scoreCandidate(tags, avgCategory, avgPlatform, c, favMap.get(String(c._id)) || 0) }));
  const results = scored.sort((a:any,b:any)=> b.score - a.score).filter(r => r.score > 0).slice(0, 50);
  res.json(results);
});

router.get('/media/:id', async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.params.id);
  const db = mongoose.connection.db;
  const origin = await db.collection('media').findOne({ _id: id });
  if (!origin) return res.status(404).send('media not found');

  const originTags = new Set((origin.tags || []));
  const originCat = origin.category;
  const originPlatform = origin.metadata?.platform;

  const candidates = await db.collection('media').find({ _id: { $ne: id } }).limit(1000).toArray();
  const results = candidates.map((m: any) => ({ mediaId: m._id, score: scoreCandidate(originTags, originCat, originPlatform, m, 0) }))
    .sort((a:any,b:any)=> b.score - a.score).filter(r => r.score > 0).slice(0, 30);

  res.json(results);
});

router.get('/category/:category', async (req, res) => {
  const { category } = req.params;
  const db = mongoose.connection.db;
  const categoryMedia = await db.collection('media').find({ category }).limit(1000).toArray();

  // Recommend items from same category weighted by tag overlap with top-rated items in this category
  const interactions = await db.collection('interactions').find({}).sort({ rating: -1 }).limit(50).toArray();
  const topIds = interactions.map(i => new mongoose.Types.ObjectId(i.mediaId));
  const topMedia = await db.collection('media').find({ _id: { $in: topIds }, category }).toArray();
  const tags = new Set<string>();
  topMedia.forEach((m:any) => (m.tags || []).forEach((t:string)=> tags.add(t)));

  const results = categoryMedia.map((m:any)=> ({ mediaId: m._id, score: (m.tags || []).filter((t:string)=>tags.has(t)).length })).sort((a:any,b:any)=> b.score - a.score).slice(0,30);
  res.json(results);
});

export default router;
