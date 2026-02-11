// services/media-service/src/controllers/media.controller.ts
import { Request, Response } from 'express';
import Media from '../models/media.model';
import Interaction from '../models/interaction.model';
import mongoose from 'mongoose';
import * as ExternalMeta from '../services/external-metadata.service';

export async function createMedia(req: Request, res: Response) {
  const item = await Media.create(req.body);
  res.status(201).json(item);
}

export async function listMedia(req: Request, res: Response) {
  const { q, category, tags } = req.query;
  const filter: any = {};
  if (category) filter.category = category;
  if (tags) filter.tags = { $in: (tags as string).split(',') };
  if (q) filter.title = new RegExp(q as string, 'i');
  const items = await Media.find(filter).limit(200);
  res.json(items);
}

export async function getMedia(req: Request, res: Response) {
  const item = await Media.findById(req.params.id);
  if (!item) return res.status(404).send('Not found');
  res.json(item);
}

export async function updateMedia(req: Request, res: Response) {
  const item = await Media.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
}

export async function deleteMedia(req: Request, res: Response) {
  await Media.findByIdAndDelete(req.params.id);
  res.status(204).send();
}

export async function patchRating(req: Request, res: Response) {
  const { rating, favorite, playCount } = req.body;
  const payload: any = { mediaId: req.params.id };
  if (rating !== undefined) payload.rating = rating;
  if (favorite !== undefined) payload.favorite = favorite;
  if (playCount !== undefined) payload.playCount = playCount;
  payload.lastInteractedAt = new Date();

  // Upsert interaction (single-user for now)
  const interaction = await Interaction.findOneAndUpdate({ mediaId: req.params.id }, payload, { upsert: true, new: true });
  res.json(interaction);
}

export async function getExternal(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send('Invalid id');
    const item = await Media.findById(id).lean();
    if (!item) return res.status(404).send('Not found');
    if (item.externalData && item.externalData.fetchedAt) return res.json(item.externalData);
    const aggregated = await ExternalMeta.aggregateExternalData(item.title, (item.metadata && (item.metadata.year || item.metadata.releaseYear)) || undefined);
    await Media.findByIdAndUpdate(id, { externalData: { provider: 'aggregated', fetchedAt: new Date(), data: aggregated } });
    res.json({ provider: 'aggregated', fetchedAt: new Date(), data: aggregated });
  } catch (err) { res.status(500).json({ error: err }); }
}

export async function refreshExternal(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send('Invalid id');
    const item = await Media.findById(id).lean();
    if (!item) return res.status(404).send('Not found');
    const aggregated = await ExternalMeta.aggregateExternalData(item.title, (item.metadata && (item.metadata.year || item.metadata.releaseYear)) || undefined);
    const updated = await Media.findByIdAndUpdate(id, { externalData: { provider: 'aggregated', fetchedAt: new Date(), data: aggregated } }, { new: true }).lean();
    res.json(updated.externalData);
  } catch (err) { res.status(500).json({ error: err }); }
}
