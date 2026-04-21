// Split large AI responses for Discord's 2000-char limit
function splitCode(text, max = 3800) {
  if (text.length <= max) return [text];
  const chunks = [];
  let rem = text;
  while (rem.length > 0) {
    if (rem.length <= max) { chunks.push(rem); break; }
    let at = rem.lastIndexOf('\n', max);
    if (at < max / 2) at = max;
    chunks.push(rem.slice(0, at));
    rem = rem.slice(at).trimStart();
  }
  return chunks;
}

module.exports = { splitCode };
