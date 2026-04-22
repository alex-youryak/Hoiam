import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { tmpdir } from 'os';
import fs from 'fs';
import { horla } from '../lib/horla.js';

// Load emojis
const emojisPath = path.join(process.cwd(), 'data', 'emojis.json');
let emojis;
try {
  emojis = JSON.parse(fs.readFileSync(emojisPath, 'utf8'));
} catch (error) {
  console.error('[xvideo] Failed to load emojis:', error.message);
  emojis = { processing: '⏳', warning: '⚠️', success: '✔️', error: '❌', adult: '🔞' };
}

export default horla({
  nomCom: "xvideo",
  categorie: 'NSFW',
  reaction: emojis.adult || '🔞'
}, async (msg, { sock, args }) => {
  try {
    const from = msg.key.remoteJid;
    const userName = msg.pushName || "User";

    // React with processing emoji
    await sock.sendMessage(from, {
      react: { text: emojis.processing || '⏳', key: msg.key }
    });

    if (!args || args.length === 0) {
      await sock.sendMessage(from, {
        text: `◈━━━━━━━━━━━━━━━━◈\n│❒ WAKE UP, ${userName}! Give me a valid xvideos.com URL or search term! 😤\n│❒ Example: ?xvideo https://www.xvideos.com/video12345\n│❒ Or: ?xvideo search term\n◈━━━━━━━━━━━━━━━━◈`,
        react: { text: emojis.warning || '⚠️', key: msg.key }
      }, { quoted: msg });
      return;
    }

    const input = args.join(' ').trim();
    const isUrl = /^https:\/\/(www\.)?xvideos\.com\/video(\.|)\w+/i.test(input);

    if (isUrl) {
      // Download video from URL (xget logic)
      await sock.sendMessage(from, {
        text: `◈━━━━━━━━━━━━━━━━◈\n│❒ Yo ${userName}, fetching video page, hang tight! 🔍\n◈━━━━━━━━━━━━━━━━◈`
      }, { quoted: msg });

      if (!input.includes('xvideos.com') || !input.includes('video')) {
        await sock.sendMessage(from, {
          text: `◈━━━━━━━━━━━━━━━━◈\n│❒ Invalid XVideos link format, ${userName}! 😡\n◈━━━━━━━━━━━━━━━━◈`,
          react: { text: emojis.error || '❌', key: msg.key }
        }, { quoted: msg });
        return;
      }

      console.log('[xvideo] Fetching video page:', input);
      const res = await fetch(input, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115.0.0.0 Safari/537.36'
        }
      });

      if (!res.ok) {
        console.log('[xvideo] Page fetch failed with status:', res.status, res.statusText);
        await sock.sendMessage(from, {
          text: `◈━━━━━━━━━━━━━━━━◈\n│❒ Failed to fetch video page, ${userName}! 😡\n◈━━━━━━━━━━━━━━━━◈`,
          react: { text: emojis.error || '❌', key: msg.key }
        }, { quoted: msg });
        return;
      }

      const html = await res.text();
      console.log('[xvideo] Video page fetched, size:', html.length, 'bytes');

      const $ = cheerio.load(html);

      let videoUrl = $('video > source').attr('src') || $('#html5video_base source').attr('src');

      if (!videoUrl) {
        const scripts = $('script').get();
        for (const script of scripts) {
          const scriptContent = $(script).html();
          if (!scriptContent) continue;

          let match = scriptContent.match(/setVideoUrlHigh\s*\(\s*['"](.+?)['"]\s*\)/);
          if (match && match[1]) {
            videoUrl = match[1];
            break;
          }

          match = scriptContent.match(/setVideoUrlLow\s*\(\s*['"](.+?)['"]\s*\)/);
          if (match && match[1]) {
            videoUrl = match[1];
            break;
          }
        }
      }

      if (!videoUrl) {
        await sock.sendMessage(from, {
          text: `◈━━━━━━━━━━━━━━━━◈\n│❒ Failed to extract video URL, ${userName}! 😡\n◈━━━━━━━━━━━━━━━━◈`,
          react: { text: emojis.error || '❌', key: msg.key }
        }, { quoted: msg });
        return;
      }

      if (videoUrl.startsWith('//')) {
        videoUrl = 'https:' + videoUrl;
      }

      console.log('[xvideo] Extracted video URL:', videoUrl);

      const title = $('h2.page-title').text().trim() || 'xvideos_download';
      console.log('[xvideo] Video title:', title);

      await sock.sendMessage(from, {
        text: `◈━━━━━━━━━━━━━━━◈\n😍 Downloading video: ${title.slice(0, 50)}...\n\n> Please wait, ${userName}... \n◈━━━━━━━━━━━━━━━◈`
      }, { quoted: msg });

      console.log('[xvideo] Downloading video from:', videoUrl);
      const fileRes = await fetch(videoUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115.0.0.0 Safari/537.36'
        }
      });

      if (!fileRes.ok) {
        console.log('[xvideo] Download failed with status:', fileRes.status, fileRes.statusText);
        await sock.sendMessage(from, {
          text: `◈━━━━━━━━━━━━━━━━◈\n│❒ Failed to download video, ${userName}! 😡\n◈━━━━━━━━━━━━━━━━◈`,
          react: { text: emojis.error || '❌', key: msg.key }
        }, { quoted: msg });
        return;
      }

      const buffer = await fileRes.buffer();
      console.log('[xvideo] Video buffer received, size:', (buffer.length / 1024 / 1024).toFixed(2), 'MB');

      const cleanTitle = title.replace(/[^\w\s]/gi, '').slice(0, 30);
      const filename = path.join(tmpdir(), `${cleanTitle}.mp4`); // Match xget's static filename
      console.log('[xvideo] Saving video to:', filename);

      await writeFile(filename, buffer);
      console.log('[xvideo] Video saved successfully');

      console.log('[xvideo] Sending video to user');
      await sock.sendMessage(from, {
        video: { url: filename },
        caption: `◈━━━━━━━━━━━━━━━━◈\n│❒ NAILED IT, ${userName}! 🔥\n│❒ Title: ${title}\n│❒ Downloaded from: ${input}\n│❒ Powered M0SHAHZAD Bot\n◈━━━━━━━━━━━━━━━━◈`
      }, { quoted: msg });

      console.log('[xvideo] Video sent successfully');

      // Clean up temp file
      await unlink(filename).catch((e) => console.log('[xvideo] Could not delete temp file:', e.message));
      console.log('[xvideo] Temporary file deleted');

    } else {
      // Search functionality
      await sock.sendMessage(from, {
        text: `◈━━━━━━━━━━━━━━━━◈\n│❒ Searching for: ${input} 🔍\n◈━━━━━━━━━━━━━━━━◈`
      }, { quoted: msg });

      const searchUrl = `https://www.xvideos.com/?k=${encodeURIComponent(input)}`;
      console.log('[xvideo] Fetching search results from:', searchUrl);
      const res = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115.0.0.0 Safari/537.36'
        }
      });

      if (!res.ok) {
        console.log('[xvideo] Search fetch failed with status:', res.status);
        await sock.sendMessage(from, {
          text: `◈━━━━━━━━━━━━━━━━◈\n│❒ Failed to fetch search results, ${userName}! 😡\n◈━━━━━━━━━━━━━━━━◈`,
          react: { text: emojis.error || '❌', key: msg.key }
        }, { quoted: msg });
        return;
      }

      const html = await res.text();
      const $ = cheerio.load(html);

      const results = [];
      const thumbBlocks = $('.mozaique .thumb-block').slice(0, 10);

      for (let i = 0; i < thumbBlocks.length; i++) {
        const el = thumbBlocks[i];
        const title = $(el).find('p.title a').text().trim();
        const href = $(el).find('p.title a').attr('href');
        if (!title || !href) continue;

        const mainLink = `https://www.xvideos.com${href}`;
        const duration = $(el).find('.duration').text().trim();

        results.push({
          title: title.slice(0, 50) + (title.length > 50 ? '...' : ''),
          url: mainLink,
          duration: duration || 'N/A'
        });
      }

      if (results.length === 0) {
        await sock.sendMessage(from, {
          text: `◈━━━━━━━━━━━━━━━━◈\n│❒ NO RESULTS FOUND, ${userName}! Try different keywords! 😕\n◈━━━━━━━━━━━━━━━━◈`,
          react: { text: emojis.warning || '⚠️', key: msg.key }
        }, { quoted: msg });
        return;
      }

      let resultText = `◈━━━━━━━━━━━━━━━━◈\n│❒ SEARCH RESULTS for: ${input}\n│❒ Requested by: ${userName}\n◈━━━━━━━━━━━━━━━━◈\n\n`;

      results.forEach((result, index) => {
        resultText += `${index + 1}. *${result.title}*\n`;
        resultText += `   ⏱️ Duration: ${result.duration}\n`;
        resultText += `   🔗 ${result.url}\n\n`;
      });

      resultText += `◈━━━━━━━━━━━━━━━━◈\n│❒ Use ?xvideo [URL] to download any video\n│❒ Powered by M0SHAHZAD\n◈━━━━━━━━━━━━━━━━◈`;

      await sock.sendMessage(from, {
        text: resultText,
        react: { text: emojis.success || '✔️', key: msg.key }
      }, { quoted: msg });
    }

  } catch (error) {
    console.error('[xvideo] Error:', error.message);
    const userName = msg.pushName || "User";
    await sock.sendMessage(msg.key.remoteJid, {
      text: `◈━━━━━━━━━━━━━━━━◈\n│❒ DOWNLOAD FAILED, ${userName}! Failed to download or send the video. 😡\n│❒ Try:\n│❒ • Different video link\n│❒ • Check if video exists\n│❒ • Use direct video URL\n◈━━━━━━━━━━━━━━━━◈`,
      react: { text: emojis.error || '❌', key: msg.key }
    }, { quoted: msg });
  }
});