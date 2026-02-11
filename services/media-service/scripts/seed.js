// services/media-service/scripts/seed.js
const mongoose = require('mongoose');
const Media = require('../dist/models/media.model').default;

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/mediatracker';
(async function(){
  await mongoose.connect(MONGO);
  console.log('Connected to mongo for seeding');
  await Media.deleteMany({});
  const docs = [
    { title: 'Elder Scrolls V: Skyrim', category: 'game', tags: ['RPG','Open-World','Fantasy'], metadata: { platform: 'PC', digitalOrPhysical: 'digital', completionStatus: 'incomplete', region: 'NA' } },
    { title: 'Blade Runner 2049', category: 'movie', tags: ['Sci-Fi','Neo-Noir'], metadata: { mediaType: 'Blu-ray', resolution: '4K', audioLanguage: 'English' } },
    { title: 'Dark Side of the Moon', category: 'audio', tags: ['Progressive','Classic Rock'], metadata: { mediaType: 'Vinyl', condition: 'VG', pressingInfo: 'Original' } }
  ];
  await Media.insertMany(docs);
  console.log('Seeded media items');
  process.exit(0);
})();