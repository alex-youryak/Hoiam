
import settings from './settings.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file if it exists
dotenv.config({ path: path.join(__dirname, '.env') });

// Load app.json configuration
let appJsonConfig = {};
try {
  const appJsonPath = path.join(__dirname, 'app.json');
  if (fs.existsSync(appJsonPath)) {
    const appJsonData = JSON.parse(fs.readFileSync(appJsonPath, 'utf-8'));

    // Extract default values from app.json env configuration
    if (appJsonData.env) {
      Object.keys(appJsonData.env).forEach(key => {
        const envConfig = appJsonData.env[key];
        if (envConfig.value !== undefined) {
          appJsonConfig[key] = envConfig.value;
        }
      });
    }
  }
} catch (error) {}

// Helper function to get env variable with fallback priority:
const getEnvValue = (key, defaultValue) => {
  return process.env[key] || appJsonConfig[key] || defaultValue;
};

const parseBool = (val) => {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'string') {
        const normalized = val.toLowerCase().trim();
        return normalized === 'true' || normalized === 'on' || normalized === 'yes';
    }
    return false;
};

export default {
  // Bot configuration
  prefix: getEnvValue('BOT_PREFIX', '.'),
  ownerNumber: getEnvValue('BOT_NUMBER', '923073457436'),
  botName: getEnvValue('BOT_NAME', 'Eclipse'),
  ownerName: getEnvValue('BOT_OWNER_NAME', 'M0SHAHZAD'),
  sessionId: 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQUtwai9hNzJXQVF0KzNVUXVuQWt3UVA1NEtnd2E1dHEvM0FDSmY5WlIyYz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiV2syQmQ3UUtFek9QeDFScUxJbUhsdzZKZGJ6bi9RZHppTnRVWUduajFFZz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJFRG9GSVYvdEhhdjFMQkJvSDk4Q01XNXIzM29TeTByTHd1eGhkdHhPbTF3PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJFYWMrRUNuZG1jK1M1bWRXM1prb2xWTG5LMjVIQ0YzemxTcTY0SFdDNVNJPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImdBZjdwZ1M0Z0pYeHJJcXpYSTBTVHNDay9aQWw3UTRKRnQ4MFhhaEJTazQ9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Iml4cTdTeUQwTFR3NUVtZklWbzhDdVd1Z293TjZ0Wi9uUm9sNUQ1eFpWM2c9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiWUlSOW55aFNNbFE5NzlURUExWEUzcUtJZy9BSTF2cDdJOVVTWU8xTDRFOD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiOS8wUkRxVnZEdXBjT296bTU2MVdwNmowYnhVN0FUZlhwY0NmNjBqdWt4az0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlQzSjNUOEhlaThxRFpMa3UvWHVQVWFuYVozek5oZitKSlJ1ejlud2pLbFNXd1pWdXlzd1pUd25KS1dNWmpuU1VveENuOGVKOG9VWnFrcE5sV1FvUWl3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjAxLCJhZHZTZWNyZXRLZXkiOiJLNVB4STRNRUk2YWswaHJORGIwUWpFM1E1V056aW0xMm53N2NDanR2dmwwPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjkyMzE4NTUzMTc0NkBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6ZmFsc2UsImlkIjoiQUNCOUY5MUREQzcwRTJEOTZFOTZEMUZEQUVCMEQ2QjciLCJwYXJ0aWNpcGFudCI6IiIsImFkZHJlc3NpbmdNb2RlIjoicG4ifSwibWVzc2FnZVRpbWVzdGFtcCI6MTc2OTI0NTU0Mn1dLCJuZXh0UHJlS2V5SWQiOjgxMywiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjgxMywiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwicmVnaXN0ZXJlZCI6dHJ1ZSwicGFpcmluZ0NvZGUiOiIxUlNXRDROSyIsIm1lIjp7ImlkIjoiOTIzMTg1NTMxNzQ2OjU3QHMud2hhdHNhcHAubmV0IiwibGlkIjoiMjE4OTY2NjI2NjgwODcwOjU3QGxpZCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDS3JBbjdFQ0VOcVcwc3NHR0FJZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiSkx3RllqajNjOEp0d1JJakZ6cTZtNEd2SFNHajJQeS96Yi9rMUF1V3RGST0iLCJhY2NvdW50U2lnbmF0dXJlIjoiVXVmaWhRNGkzbWpxZHpxd3prNXlrQ1REYWFTRXc5TlIrNGorOEJDVVhURDdOdUVQOVRmRGdKNkhmT1BMckxBZmE1VTVnY0NNd28rVDV4a1VyeFMwQ3c9PSIsImRldmljZVNpZ25hdHVyZSI6ImtOYUdFQUdWVml0K0JNQW04bDFYQ3BETXlOVGtaR2dweWVRWitPSG05RTV3Z3UzUEJucmhrdjV3TDg4bkE2YlJwVVEvVnJ3bjlMSXF0cHRuaHFqNGhRPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjE4OTY2NjI2NjgwODcwOjU3QGxpZCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJTUzhCV0k0OTNQQ2JjRVNJeGM2dXB1QnJ4MGhvOWo4djgyLzVOUUxsclJTIn19XSwicGxhdGZvcm0iOiJhbmRyb2lkIiwicm91dGluZ0luZm8iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJDQWdJRWdnRiJ9LCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3NjkyNDU1MzYsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBSU8rIiwibGFzdFByb3BIYXNoIjoiUFdrNUIifQ==',
  BOOM_MESSAGE_LIMIT: 50,

  // AI configurations
  openaiApiKey: getEnvValue('OPENAI_API_KEY', settings.openaiApiKey),
  giphyApiKey: getEnvValue('GIPHY_API_KEY', settings.giphyApiKey),
  geminiApiKey: getEnvValue('GEMINI_API_KEY', settings.geminiApiKey),
  imgurClientId: getEnvValue('IMGUR_CLIENT_ID', settings.imgurClientId),
  copilotApiKey: getEnvValue('COPILOT_API_KEY', settings.copilotApiKey),
  FOOTBALL_API_KEY: getEnvValue('FOOTBALL_API_KEY', settings.FOOTBALL_API_KEY),

  // Session data
  sessionData: getEnvValue('BOT_SESSION_DATA', ''),

  // Automation Settings (Env support)
  autoViewMessage: parseBool(getEnvValue('AUTO_VIEW_MESSAGE', false)),
  autoViewStatus: parseBool(getEnvValue('AUTO_VIEW_STATUS', false)),
  autoReactStatus: parseBool(getEnvValue('AUTO_REACT_STATUS', false)),
  autoReact: parseBool(getEnvValue('AUTO_REACT', false)),
  autoStatusEmoji: getEnvValue('AUTO_STATUS_EMOJI', '❤️'),
  autoTyping: parseBool(getEnvValue('AUTO_TYPING', false)),
  autoRecording: parseBool(getEnvValue('AUTO_RECORDING', false)),

  // Anti-Settings (Env support)
  antiCall: parseBool(getEnvValue('ANTICALL', false)),
  antiVideoCall: parseBool(getEnvValue('ANTIVIDEOCALL', false)),
  antiDelete: parseBool(getEnvValue('ANTIDELETE', false)),
  antiLink: parseBool(getEnvValue('ANTILINK', false)),
  antiBug: parseBool(getEnvValue('ANTIBUG', false)),
  antiSpam: parseBool(getEnvValue('ANTISPAM', false)),
  antiTag: parseBool(getEnvValue('ANTITAG', false)),
  antiCallMode: getEnvValue('ANTICALL_MODE', 'cut'), // 'cut' or 'block'
};
