// services/media-service/src/models/interaction.model.ts
import { Schema, model } from 'mongoose';

const InteractionSchema = new Schema({
  userId: { type: String },
  mediaId: { type: Schema.Types.ObjectId, ref: 'Media', required: true },
  rating: { type: Number, min: 1, max: 10 },
  favorite: { type: Boolean, default: false },
  playCount: { type: Number, default: 0 },
  lastInteractedAt: Date,
}, { timestamps: true });

const Interaction = model('Interaction', InteractionSchema);
export default Interaction;
