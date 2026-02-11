// services/media-service/src/models/media.model.ts
import { Schema, model } from 'mongoose';

const baseOptions = {
  discriminatorKey: 'category',
  timestamps: true,
};

const MediaSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true, enum: ['game','movie','audio'] },
  tags: { type: [String], default: [] },
  acquisitionDate: Date,
  price: Number,
  notes: String,
  metadata: Schema.Types.Mixed,
  // External provider identifiers, e.g., imdb id, tmdb id, discogs, vgdb
  externalIds: {
    imdb: { type: String },
    tmdb: { type: String },
    other: Schema.Types.Mixed
  },
  // Cached external data and last fetch time
  externalData: {
    provider: { type: String },
    fetchedAt: Date,
    data: Schema.Types.Mixed
  }
}, baseOptions);

const Media = model('Media', MediaSchema);
export default Media;
