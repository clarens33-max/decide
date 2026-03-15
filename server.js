const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

// Serve the HTML from the docs folder
app.use(express.static(path.join(__dirname, 'docs')));

// Proxy endpoint — browser calls this, server adds the API key
app.post('/api/chat', async (req, res) => {
  console.log('[/api/chat] Request received');

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('[/api/chat] ERROR: ANTHROPIC_API_KEY is not set');
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY environment variable is not set.' });
  }
  console.log('[/api/chat] API key found, length:', apiKey.length);

  try {
    console.log('[/api/chat] Calling Anthropic API...');
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    console.log('[/api/chat] Anthropic responded with status:', response.status);
    const data = await response.json();
    console.log('[/api/chat] Response body:', JSON.stringify(data).slice(0, 300));
    res.status(response.status).json(data);
  } catch (err) {
    console.error('[/api/chat] Fetch error:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to reach Anthropic API.', detail: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
