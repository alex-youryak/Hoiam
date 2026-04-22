import fs from 'fs';
import path from 'path';

const emojisPath = path.join(process.cwd(), 'data', 'emojis.json');
const emojis = JSON.parse(fs.readFileSync(emojisPath, 'utf8'));

export default {
  name: "ping",
  description: "Check bot latency",
  async execute(msg, { sock }) {
    const start = Date.now();
    
    await sock.sendMessage(msg.key.remoteJid, { react: { text: emojis.processing, key: msg.key } });

    const elapsed = Date.now() - start;

    await sock.sendMessage(msg.key.remoteJid, {
      text: `📡 *ECLIPSE MD STATUS*\n\n🚀 *Latency:* \`${elapsed} ms\`\n🔋 *System:* Online\n🌐 *Mode:* ${global.botMode || 'public'}\n\n _POWERED BY M0SHAHZAD_\n_Everything is running smoothly._`,
      react: { text: emojis.success, key: msg.key }
    }, { quoted: msg });
  },
};
