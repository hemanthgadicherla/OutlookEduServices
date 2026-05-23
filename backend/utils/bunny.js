const crypto = require('crypto');

// Read env vars inside each function so they're always fresh after dotenv.config()
const cfg = () => ({
  libraryId:   process.env.BUNNY_LIBRARY_ID,
  apiKey:      process.env.BUNNY_API_KEY,
  securityKey: process.env.BUNNY_SECURITY_KEY,
});

// ── Create a new video object in the Bunny Stream library ────────
async function createBunnyVideo(title, description = '') {
  const { libraryId, apiKey } = cfg();
  if (!libraryId || !apiKey) throw new Error('Bunny Stream credentials not configured');

  const body = { title };
  if (description) body.description = description;

  const res = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos`, {
    method:  'POST',
    headers: { AccessKey: apiKey, 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Bunny create video failed (${res.status}): ${text}`);
  }
  return res.json();
}

// ── Generate TUS upload credentials for direct browser → Bunny upload ─
function getBunnyTusCredentials(videoId) {
  const { libraryId, apiKey } = cfg();
  if (!libraryId || !apiKey) throw new Error('Bunny Stream credentials not configured');

  const expires   = Math.floor(Date.now() / 1000) + 3600;
  const signature = crypto.createHash('sha256').update(libraryId + apiKey + expires + videoId).digest('hex');

  return { videoId, libraryId, signature, expires };
}

// ── Generate a time-limited signed embed URL for a Bunny video ───
function getBunnySignedEmbedUrl(videoId, expirySeconds = 28800) {
  const { libraryId, securityKey } = cfg();
  if (!libraryId || !securityKey) throw new Error('Bunny security key not configured');

  const expires = Math.floor(Date.now() / 1000) + expirySeconds;
  const token   = crypto.createHash('sha256').update(securityKey + videoId + expires).digest('hex');

  return {
    url: `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?token=${token}&expires=${expires}&autoplay=false`,
    expires,
  };
}

// ── Delete a video from Bunny Stream ────────────────────────────
async function deleteBunnyVideo(videoId) {
  const { libraryId, apiKey } = cfg();
  if (!libraryId || !apiKey) throw new Error('Bunny credentials not configured');

  const res = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`, {
    method:  'DELETE',
    headers: { AccessKey: apiKey },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Bunny delete failed (${res.status}): ${text}`);
  }
}

module.exports = { createBunnyVideo, getBunnyTusCredentials, getBunnySignedEmbedUrl, deleteBunnyVideo };
