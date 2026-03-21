export default async function handler(req, res) {
  // CORS headers for development (your domain will be allowed automatically in production)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const binId = process.env.JSONBIN_BIN_ID;
  const apiKey = process.env.JSONBIN_API_KEY;

  try {
    if (req.method === 'GET') {
      // Read from JSONBin
      const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
        headers: { 'X-Master-Key': apiKey }
      });
      if (!response.ok) throw new Error(`JSONBin error: ${response.status}`);
      const data = await response.json();
      return res.status(200).json(data.record);
    }

    if (req.method === 'POST') {
      // Write – requires admin password in request body
      const { password, data } = req.body;
      if (password !== process.env.ADMIN_PASSWORD) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      // Update the bin
      const updateResponse = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': apiKey
        },
        body: JSON.stringify(data)
      });
      if (!updateResponse.ok) throw new Error(`Update failed: ${updateResponse.status}`);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
