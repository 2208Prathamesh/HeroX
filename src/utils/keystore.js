const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../../data/keys.json');
const ALG = 'aes-256-gcm';
const KEY = crypto.scryptSync(process.env.ENCRYPTION_SECRET || 'herox-fallback-secret', 'herox-salt', 32);

function encrypt(text) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALG, KEY, iv);
  const enc = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return `${iv.toString('hex')}:${cipher.getAuthTag().toString('hex')}:${enc.toString('hex')}`;
}

function decrypt(data) {
  const [ivH, tagH, encH] = data.split(':');
  const dec = crypto.createDecipheriv(ALG, KEY, Buffer.from(ivH, 'hex'));
  dec.setAuthTag(Buffer.from(tagH, 'hex'));
  return dec.update(Buffer.from(encH, 'hex')) + dec.final('utf8');
}

function load() {
  try { return fs.existsSync(DATA_PATH) ? JSON.parse(fs.readFileSync(DATA_PATH, 'utf8')) : {}; }
  catch { return {}; }
}

function save(data) {
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

function setKey(userId, provider, apiKey) {
  const s = load(); s[userId] = { ...(s[userId] || {}), provider, key: encrypt(apiKey) }; save(s);
}
function getKey(userId) {
  const e = load()[userId]; if (!e?.key) return null;
  return { provider: e.provider, apiKey: decrypt(e.key) };
}
function removeKey(userId) { const s = load(); delete s[userId]; save(s); }
function hasKey(userId) { return !!load()[userId]?.key; }

function setImageKey(userId, provider, apiKey) {
  const s = load(); s[userId] = { ...(s[userId] || {}), imgProvider: provider, imgKey: encrypt(apiKey) }; save(s);
}
function getImageKey(userId) {
  const e = load()[userId]; if (!e?.imgKey) return null;
  return { provider: e.imgProvider, apiKey: decrypt(e.imgKey) };
}

module.exports = { setKey, getKey, removeKey, hasKey, setImageKey, getImageKey };
