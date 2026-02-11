// services/preferences-service/src/models/preferences.model.ts
import { Schema, model } from 'mongoose';

const PreferencesSchema = new Schema({
  userId: { type: String, index: true },
  themeMode: { type: String, enum: ['light','dark'], default: 'light' },
  themeVariant: { type: String, enum: ['default','colorblind'], default: 'default' },
  fontSize: { type: String, enum: ['small','normal','large'], default: 'normal' },
  density: { type: String, enum: ['comfortable','compact'], default: 'comfortable' },
}, { timestamps: true });

const Preferences = model('Preferences', PreferencesSchema);
export default Preferences;