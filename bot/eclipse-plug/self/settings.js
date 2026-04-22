
export default {
  name: 'settings',
  description: 'Show all automation settings status',
  async execute(msg, { sock, settings }) {
    const from = msg.key.remoteJid;
    
    const autoViewMessage = global.autoViewMessage || false;
    const autoViewStatus = global.autoViewStatus || false;
    const autoReactStatus = global.autoReactStatus || false;
    const autoReact = global.autoReact || false;
    const autoStatusEmoji = global.autoStatusEmoji || '❤️';
    const autoTyping = global.autoTyping || false;
    const autoRecording = global.autoRecording || false;
    
    const antiLinkWarnGroups = Object.keys(global.antiLinkWarn || {}).length;
    const antiLinkKickGroups = Object.keys(global.antiLinkKick || {}).length;
    const antiBadWordGroups = Object.keys(global.antiBadWord || {}).length;

    const settingsText = `🤖 *Bot Automation Settings*

━━━━━━━━━━━━━━━━━━━

📱 *Message Automation:*
• Auto View Message: ${autoViewMessage ? '✅ ON' : '❌ OFF'}
• Auto React Messages: ${autoReact ? '✅ ON' : '❌ OFF'}
• Auto Typing: ${autoTyping ? '✅ ON' : '❌ OFF'}
• Auto Recording: ${autoRecording ? '✅ ON' : '❌ OFF'}

📸 *Status Automation:*
• Auto View Status: ${autoViewStatus ? '✅ ON' : '❌ OFF'}
• Auto React Status: ${autoReactStatus ? '✅ ON' : '❌ OFF'}
• Status Emoji: ${autoStatusEmoji}

🛡️ *Anti-Commands:*
• Anti-Link Warning: ${antiLinkWarnGroups} groups
• Anti-Link Kicking: ${antiLinkKickGroups} groups
• Anti-Delete Messages: ${global.antiDeleteMessages ? '✅ ON' : '❌ OFF'}
• Anti-Voice Call: ${global.antiVoiceCall ? '✅ ON' : '❌ OFF'}
• Anti-Video Call: ${global.antiVideoCall ? '✅ ON' : '❌ OFF'}
• Anti-Badword: ${antiBadWordGroups} groups
• Anti-Spam: ${persistentSettings.antiSpam ? '✅ ON' : '❌ OFF'}
• Anti-Tag: Active in groups

━━━━━━━━━━━━━━━━━━━

💡 *Usage Examples:*
• \`${settings.prefix}autoviewmessage on/off\`
• \`${settings.prefix}autoreactstatus on/off\`
• \`${settings.prefix}antilinkwarn on/off\` (in groups)
• \`${settings.prefix}antivoicecall on/off\`
• \`${settings.prefix}files\` - List command files
• \`${settings.prefix}datafile\` - List data files

*© eclipse Bot - Self Mode Settings*`;

    await sock.sendMessage(from, {
      text: settingsText
    }, { quoted: msg });
  }
};
