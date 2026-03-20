import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await client.connect();
    const db = client.db('anajak');
    const collection = db.collection('data');

    if (req.method === 'GET') {
      // Read current data
      let doc = await collection.findOne({ _id: 'siteData' });
      if (!doc) {
        // Insert default data if none exists
        const defaultData = {
          _id: 'siteData',
          players: [
            { id: 1, name: 'SOKHA "GODZILLA"', role: 'Captain / Striker', stats: '🏅 8 Titles • ⚽ 245 Goals', photo: null, defaultIcon: 'fa-user-ninja' },
            { id: 2, name: 'RITHY "PHANTOM"', role: 'Midfielder', stats: '🏅 6 Titles • 🎯 112 Assists', photo: null, defaultIcon: 'fa-user-astronaut' },
            { id: 3, name: 'VICHEKA "SHADOW"', role: 'Defender', stats: '🏅 5 Titles • 🛡️ 89 Clean Sheets', photo: null, defaultIcon: 'fa-user-secret' },
            { id: 4, name: 'DARA "WIZARD"', role: 'Goalkeeper', stats: '🏅 7 Titles • 🧤 156 Saves', photo: null, defaultIcon: 'fa-user-graduate' }
          ],
          matches: [
            { id: 1, date: 'Mar 25, 2026', opponent: 'Phoenix Esports', result: '3 - 1 WIN', status: 'win' },
            { id: 2, date: 'Mar 28, 2026', opponent: 'Dragon FC', result: '2 - 0 WIN', status: 'win' },
            { id: 3, date: 'Apr 2, 2026', opponent: 'Tiger Gaming', result: 'Upcoming', status: 'upcoming' },
            { id: 4, date: 'Apr 5, 2026', opponent: 'Khmer Warriors', result: 'Upcoming', status: 'upcoming' }
          ],
          achievements: [
            { id: 1, title: 'eFootball Cambodia Champions', year: '2025', icon: 'fa-trophy' },
            { id: 2, title: 'SEA Invitational Runner-up', year: '2025', icon: 'fa-medal' },
            { id: 3, title: 'Kingdom League Winners', year: '2024, 2025', icon: 'fa-crown' },
            { id: 4, title: 'Undefeated Streak Record', year: '21 Matches (2025)', icon: 'fa-chart-line' }
          ],
          teamInfo: { tournamentsWon: 15, totalMatches: 45 }
        };
        await collection.insertOne(defaultData);
        doc = defaultData;
      }
      // Remove _id from the returned object
      const { _id, ...data } = doc;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      // Admin writes – requires password
      const { password, data } = req.body;
      if (password !== process.env.ADMIN_PASSWORD) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
      await collection.updateOne(
        { _id: 'siteData' },
        { $set: data },
        { upsert: true }
      );
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
}
