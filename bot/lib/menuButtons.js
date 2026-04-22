export const menuButtonsConfig = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: '120363406488667366@newsletter',
    newsletterName: 'M SHAHZAD',
    serverMessageId: -1
  },
  externalAdReply: {
    title: '🌙 𝔼𝔠𝔩𝔦𝔭𝔰𝔢 𝔐𝔡',
    body: '🚀 500+ Commands & Aliases | 🤖 AI Powered | 🎨 Image Generator',
    thumbnailUrl: 'https://files.catbox.moe/9r2nwi.jpg',
    sourceUrl: 'https://github.com/horlapookie/Eclipse-MD',
    mediaType: 1,
    renderLargerThumbnail: true,
    showAdAttribution: false
  }
};

export const repoButtons = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: '120363406488667366@newsletter',
    newsletterName: 'M SHAHZAD',
    serverMessageId: -1
  },
  externalAdReply: {
    title: '🔗 𝔼𝕔𝕝𝕚𝕡𝕤𝕖 𝕄𝔻 REPOSITORY',
    body: 'View Source Code & Documentation',
    thumbnailUrl: 'https://files.catbox.moe/9r2nwi.jpg',
    sourceUrl: 'https://github.com/horlapookie/Eclipse-MD',
    mediaType: 1,
    renderLargerThumbnail: false,
    showAdAttribution: false
  }
};
export const menuButtons = {
  // Main menu buttons
  mainButtons: [
    {
      buttonId: "menu_basic",
      buttonText: { displayText: "🛠️ Basic Tools" },
      type: 1
    },
    {
      buttonId: "menu_group",
      buttonText: { displayText: "👥 Group Management" },
      type: 1
    },
    {
      buttonId: "menu_ai",
      buttonText: { displayText: "🤖 AI Commands" },
      type: 1
    }
  ],

  // Repository and creator buttons
  repoButtons: [
    {
      buttonId: "repo_main",
      buttonText: { displayText: "📱 GitHub Repository" },
      type: 1
    },
    {
      buttonId: "creator_contact",
      buttonText: { displayText: "👨‍💻 Creator Contact" },
      type: 1
    },
    {
      buttonId: "contact_support",
      buttonText: { displayText: "🆘 Support Help" },
      type: 1
    }
  ],

  // Quick action buttons
  quickActions: [
    {
      buttonId: "status_bot",
      buttonText: { displayText: "📊 Bot Status" },
      type: 1
    },
  ]
};

// Button responses
export const buttonResponses = {
  repo_main: {
    text: "📱 *𝔼𝕔𝕝𝕚𝕡𝕤𝕖 𝕄𝔻 - Main Repository*\n\n🔗 GitHub: https://github.com/horlapookie/Eclipse-MD\n⭐ Star the repo if you like it!\n🍴 Fork it to create your own version",
    url: "https://github.com/horlapookie/Eclipse-MD"
  },

  repo_web: {
    text: "🌐 *Web Dashboard*\n\n🔗 Dashboard: hmmmmmm\n📊 Monitor your bot's performance\n⚙️ Configure settings remotely",
    url: "hmmmmmm"
  },

  creator_contact: {
    text: "👨‍💻 *Creator Contact*\n\n📱 WhatsApp: +923023220549\n🐙 GitHub: @proppla1f7\n💬 Telegram: @m0shahzad",
    contact: {
      phone: "+923023220549",
      name: "Powered By - M0SHAHZAD"
    }
  },

  status_bot: {
    text: "📊 *Bot Status*\n\n✅ Online and Active\n🔄 Auto-updates enabled\n🛡️ Security features active\n📱 WhatsApp API connected"
  },

  help_support: {
    text: "🆘 *Support & Help*\n\n📚 Use ?menu to see all commands\n💬 Join our support group\n🔧 Report issues on GitHub\n📖 Read documentation"
  },

};
  
