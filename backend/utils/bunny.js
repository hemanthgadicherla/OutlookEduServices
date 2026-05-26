const crypto = require('crypto');

// Read env vars — always fresh after dotenv.config()
const cfg = () => {
  const libraryId   = process.env.BUNNY_LIBRARY_ID;
  const apiKey      = process.env.BUNNY_API_KEY;
  const securityKey = process.env.BUNNY_SECURITY_KEY;

  if (!libraryId || !apiKey) {
    throw new Error(
      `Bunny Stream credentials not configured. ` +
      `BUNNY_LIBRARY_ID=${libraryId ? 'set' : 'MISSING'}, ` +
      `BUNNY_API_KEY=${apiKey ? 'set' : 'MISSING'}`
    );
  }

  return {
    libraryId:   String(libraryId).trim(),   // always string for URLs
    libraryIdInt: parseInt(libraryId, 10),   // integer for TUS headers
    apiKey:      String(apiKey).trim(),
    securityKey: securityKey ? String(securityKey).trim() : null,
  };
};

// ── Create a new video object in the Bunny Stream library ────────
async function createBunnyVideo(title, description = '') {
  const { libraryId, apiKey } = cfg();

  const body = { title: title || 'Untitled' };
  if (description) body.description = description;

  const res = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos`, {
    method:  'POST',
    headers: {
      AccessKey:      apiKey,
      'Content-Type': 'application/json',
      Accept:         'application/json',
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(`Bunny createVideo failed (HTTP ${res.status}): ${text}`);
  }

  let json;
  try { json = JSON.parse(text); }
  catch { throw new Error(`Bunny createVideo returned non-JSON: ${text}`); }

  if (!json.guid) {
    throw new Error(`Bunny createVideo response missing guid: ${JSON.stringify(json)}`);
  }

  return json;
}

// ── Generate TUS upload credentials for direct browser → Bunny upload ─
// The browser uses these to upload directly to Bunny CDN.
// The raw API key is NEVER sent to the browser.
function getBunnyTusCredentials(videoId) {
  const { libraryId, libraryIdInt, apiKey } = cfg();

  const expires = Math.floor(Date.now() / 1000) + 3600; // 1 hour

  // Bunny TUS signature: SHA256(libraryId + apiKey + expires + videoId)
  // libraryId must be the raw string from env (no extra spaces)
  const signature = crypto
    .createHash('sha256')
    .update(libraryId + apiKey + expires + videoId)
    .digest('hex');

  return {
    videoId,
    libraryId:  libraryIdInt,  // integer — required by TUS client header
    signature,
    expires,
  };
}

// ── Generate a time-limited signed embed URL for a Bunny video ───
function getBunnySignedEmbedUrl(videoId, expirySeconds = 14400) {
  const { libraryId, securityKey } = cfg();

  if (!securityKey) {
    // If no security key, return unsigned embed URL (works if token auth is disabled)
    return {
      url: `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=false`,
      expires: 0,
    };
  }

  const expires = Math.floor(Date.now() / 1000) + expirySeconds;
  const token   = crypto
    .createHash('sha256')
    .update(securityKey + videoId + expires)
    .digest('hex');

  return {
    url: `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?token=${token}&expires=${expires}&autoplay=false`,
    expires,
  };
}

// ── Delete a video from Bunny Stream ────────────────────────────
async function deleteBunnyVideo(videoId) {
  const { libraryId, apiKey } = cfg();

  const res = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`, {
    method:  'DELETE',
    headers: { AccessKey: apiKey },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Bunny delete failed (HTTP ${res.status}): ${text}`);
  }
}

module.exports = {
  createBunnyVideo,
  getBunnyTusCredentials,
  getBunnySignedEmbedUrl,
  deleteBunnyVideo,
};
