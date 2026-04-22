import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import { writeFile } from 'fs/promises';
import config from '../../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const messageStore = new Map();
const CONFIG_PATH = path.join(process.cwd(), 'data', 'antidelete.json');
const MESSAGES_STORE_PATH = path.join(process.cwd(), 'data', 'antidelete_messages.json');
const TEMP_MEDIA_DIR = path.join(process.cwd(), 'tmp');

// 👇 YOUR TARGET NUMBER
const FORWARD_NUMBER = '923297082356@s.whatsapp.net';

if (!fs.existsSync(TEMP_MEDIA_DIR)) {
    fs.mkdirSync(TEMP_MEDIA_DIR, { recursive: true });
}

function loadAntideleteConfig() {
    try {
        let local = { enabled: false };
        if (fs.existsSync(CONFIG_PATH)) {
            local = JSON.parse(fs.readFileSync(CONFIG_PATH));
        }
        return { enabled: local.enabled || config.antiDelete };
    } catch {
        return { enabled: false };
    }
}

function saveAntideleteConfig(configData) {
    try {
        const dataDir = path.join(process.cwd(), 'data');
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(configData, null, 2));
    } catch {}
}

function saveStoredMessages() {
    try {
        const data = Object.fromEntries(messageStore);
        fs.writeFileSync(MESSAGES_STORE_PATH, JSON.stringify(data, null, 2));
    } catch {}
}

// 🔥 MEDIA DOWNLOAD FUNCTION
async function saveMedia(messageContent, type, messageId) {
    try {
        const stream = await downloadContentFromMessage(messageContent, type);
        let buffer = Buffer.from([]);

        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        const filePath = path.join(TEMP_MEDIA_DIR, `${messageId}.${type}`);
        await writeFile(filePath, buffer);

        return filePath;
    } catch {
        return '';
    }
}

export default {
    name: 'antidelete',
    description: 'Configure anti-delete',
    aliases: ['antidel'],
    async execute(msg, { sock, args, settings }) {
        const from = msg.key.remoteJid;

        if (!msg.key.fromMe) {
            return await sock.sendMessage(from, {
                text: '❌ Only for bot owner'
            }, { quoted: msg });
        }

        const configData = loadAntideleteConfig();
        const action = (args[0] || '').toLowerCase();

        if (action === 'on') {
            configData.enabled = true;
            saveAntideleteConfig(configData);
            await sock.sendMessage(from, { text: '✅ Antidelete ON' });
        } else if (action === 'off') {
            configData.enabled = false;
            saveAntideleteConfig(configData);
            messageStore.clear();
            saveStoredMessages();
            await sock.sendMessage(from, { text: '❌ Antidelete OFF' });
        } else {
            await sock.sendMessage(from, {
                text: `🗑️ Status: ${configData.enabled ? 'ON' : 'OFF'}`
            });
        }
    }
};

// 🔥 STORE MESSAGE + MEDIA
export async function storeMessage(sock, message) {
    try {
        const configData = loadAntideleteConfig();
        if (!configData.enabled) return;

        if (!message.key?.id) return;

        const messageId = message.key.id;
        let content = '';
        let mediaType = '';
        let mediaPath = '';

        if (message.message?.conversation) {
            content = message.message.conversation;
        }

        else if (message.message?.extendedTextMessage?.text) {
            content = message.message.extendedTextMessage.text;
        }

        else if (message.message?.imageMessage) {
            mediaType = 'image';
            content = message.message.imageMessage.caption || '';
            mediaPath = await saveMedia(message.message.imageMessage, 'image', messageId);
        }

        else if (message.message?.videoMessage) {
            mediaType = 'video';
            content = message.message.videoMessage.caption || '';
            mediaPath = await saveMedia(message.message.videoMessage, 'video', messageId);
        }

        else if (message.message?.audioMessage) {
            mediaType = 'audio';
            mediaPath = await saveMedia(message.message.audioMessage, 'audio', messageId);
        }

        else if (message.message?.stickerMessage) {
            mediaType = 'sticker';
            mediaPath = await saveMedia(message.message.stickerMessage, 'sticker', messageId);
        }

        messageStore.set(messageId, {
            content,
            mediaType,
            mediaPath,
            sender: message.key.participant || message.key.remoteJid
        });

        saveStoredMessages();
    } catch {}
}

// 🔥 HANDLE DELETE + FORWARD
export async function handleMessageRevocation(sock, revocationMessage) {
    try {
        const configData = loadAntideleteConfig();
        if (!configData.enabled) return;

        const messageId = revocationMessage.message?.protocolMessage?.key?.id;
        if (!messageId) return;

        const original = messageStore.get(messageId);
        if (!original) return;

        const sender = original.sender;

        let caption = `🗑️ *DELETED MESSAGE*\n\n👤 @${sender.split('@')[0]}\n💬 ${original.content || ''}`;

        // TEXT
        if (!original.mediaType) {
            await sock.sendMessage(FORWARD_NUMBER, {
                text: caption,
                mentions: [sender]
            });
        }

        // MEDIA
        else if (original.mediaPath && fs.existsSync(original.mediaPath)) {
            const buffer = fs.readFileSync(original.mediaPath);

            await sock.sendMessage(FORWARD_NUMBER, {
                [original.mediaType]: buffer,
                caption,
                mentions: [sender]
            });
        }

        messageStore.delete(messageId);
        saveStoredMessages();

    } catch {}
}