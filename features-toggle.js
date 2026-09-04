/**
 * Auto Features Toggle Commands
 * Allows users to enable/disable auto features via commands
 */

const fs = require('fs');
const path = require('path');

// Store user settings
const settingsFile = path.join(process.cwd(), 'user_features_settings.json');

// Load settings from file
const loadSettings = () => {
    try {
        if (fs.existsSync(settingsFile)) {
            return JSON.parse(fs.readFileSync(settingsFile, 'utf-8'));
        }
    } catch (error) {
        console.log('Error loading settings:', error.message);
    }
    return {};
};

// Save settings to file
const saveSettings = (settings) => {
    try {
        fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
    } catch (error) {
        console.log('Error saving settings:', error.message);
    }
};

// Get user's feature settings
const getUserSettings = (userId) => {
    const settings = loadSettings();
    return settings[userId] || {
        autoRead: false,
        autoTyping: false,
        autoRecording: false,
        autoViewStatus: false,
        autoReact: false,
        autoReplyStatus: false,
        alwaysOffline: false,
        alwaysOnline: false,
        antiCall: false,
        antiDelete: false,
        antiBot: false,
        antiLink: false,
        readCmdOnly: false,
        autoBio: false,
        autoLikeStatus: false
    };
};

// Set specific feature for user
const setFeature = (userId, featureName, status) => {
    const settings = loadSettings();
    if (!settings[userId]) {
        settings[userId] = getUserSettings(userId);
    }
    settings[userId][featureName] = status;
    saveSettings(settings);
};

// Toggle feature for user
const toggleFeature = (userId, featureName) => {
    const settings = getUserSettings(userId);
    const currentStatus = settings[featureName];
    setFeature(userId, featureName, !currentStatus);
    return !currentStatus;
};

// Handle auto feature commands
const handleAutoFeatureCommands = (m, socket) => {
    const userId = m.sender;
    const body = m.body.toLowerCase().trim();
    const args = body.split(' ');
    const command = args[0];
    const action = args[1]?.toLowerCase();
    
    // Auto Read Messages
    if (command === '.autoread' || command === '/autoread') {
        if (action === 'on') {
            setFeature(userId, 'autoRead', true);
            m.reply('✅ *Auto Read Enabled*\n\nMessages will be automatically marked as read');
            return true;
        } else if (action === 'off') {
            setFeature(userId, 'autoRead', false);
            m.reply('❌ *Auto Read Disabled*\n\nMessages will no longer be auto read');
            return true;
        } else {
            const status = getUserSettings(userId).autoRead;
            m.reply(`📊 *Auto Read Status*\n\nCurrent: ${status ? '✅ ON' : '❌ OFF'}\n\n📝 Usage:\n.autoread on\n.autoread off`);
            return true;
        }
    }
    
    // Auto Typing
    if (command === '.autotype' || command === '/autotype') {
        if (action === 'on') {
            setFeature(userId, 'autoTyping', true);
            m.reply('✅ *Auto Typing Enabled*\n\nTyping indicator will show when bot processes messages');
            return true;
        } else if (action === 'off') {
            setFeature(userId, 'autoTyping', false);
            m.reply('❌ *Auto Typing Disabled*\n\nTyping indicator will not show');
            return true;
        } else {
            const status = getUserSettings(userId).autoTyping;
            m.reply(`📊 *Auto Typing Status*\n\nCurrent: ${status ? '✅ ON' : '❌ OFF'}\n\n📝 Usage:\n.autotype on\n.autotype off`);
            return true;
        }
    }
    
    // Auto Recording
    if (command === '.autorec' || command === '/autorec') {
        if (action === 'on') {
            setFeature(userId, 'autoRecording', true);
            m.reply('✅ *Auto Recording Enabled*\n\nRecording indicator will show when bot is busy');
            return true;
        } else if (action === 'off') {
            setFeature(userId, 'autoRecording', false);
            m.reply('❌ *Auto Recording Disabled*\n\nRecording indicator will not show');
            return true;
        } else {
            const status = getUserSettings(userId).autoRecording;
            m.reply(`📊 *Auto Recording Status*\n\nCurrent: ${status ? '✅ ON' : '❌ OFF'}\n\n📝 Usage:\n.autorec on\n.autorec off`);
            return true;
        }
    }
    
    // Auto View Status
    if (command === '.autoview' || command === '/autoview') {
        if (action === 'on') {
            setFeature(userId, 'autoViewStatus', true);
            m.reply('✅ *Auto View Status Enabled*\n\nStatus updates will be automatically viewed');
            return true;
        } else if (action === 'off') {
            setFeature(userId, 'autoViewStatus', false);
            m.reply('❌ *Auto View Status Disabled*\n\nStatus updates will not be auto viewed');
            return true;
        } else {
            const status = getUserSettings(userId).autoViewStatus;
            m.reply(`📊 *Auto View Status*\n\nCurrent: ${status ? '✅ ON' : '❌ OFF'}\n\n📝 Usage:\n.autoview on\n.autoview off`);
            return true;
        }
    }
    
    // Auto React
    if (command === '.autoreact' || command === '/autoreact') {
        if (action === 'on') {
            setFeature(userId, 'autoReact', true);
            m.reply('✅ *Auto React Enabled*\n\nMessages will be automatically reacted to');
            return true;
        } else if (action === 'off') {
            setFeature(userId, 'autoReact', false);
            m.reply('❌ *Auto React Disabled*\n\nMessages will not be auto reacted');
            return true;
        } else {
            const status = getUserSettings(userId).autoReact;
            m.reply(`📊 *Auto React Status*\n\nCurrent: ${status ? '✅ ON' : '❌ OFF'}\n\n📝 Usage:\n.autoreact on\n.autoreact off`);
            return true;
        }
    }
    
    // Always Offline
    if (command === '.offline' || command === '/offline') {
        if (action === 'on') {
            setFeature(userId, 'alwaysOffline', true);
            m.reply('✅ *Always Offline Enabled*\n\nYour online status will be hidden');
            return true;
        } else if (action === 'off') {
            setFeature(userId, 'alwaysOffline', false);
            m.reply('❌ *Always Offline Disabled*\n\nYour status will be visible');
            return true;
        } else {
            const status = getUserSettings(userId).alwaysOffline;
            m.reply(`📊 *Always Offline Status*\n\nCurrent: ${status ? '✅ ON' : '❌ OFF'}\n\n📝 Usage:\n.offline on\n.offline off`);
            return true;
        }
    }
    
    // Always Online
    if (command === '.online' || command === '/online') {
        if (action === 'on') {
            setFeature(userId, 'alwaysOnline', true);
            m.reply('✅ *Always Online Enabled*\n\nYou will always appear online');
            return true;
        } else if (action === 'off') {
            setFeature(userId, 'alwaysOnline', false);
            m.reply('❌ *Always Online Disabled*\n\nOnline status will be normal');
            return true;
        } else {
            const status = getUserSettings(userId).alwaysOnline;
            m.reply(`📊 *Always Online Status*\n\nCurrent: ${status ? '✅ ON' : '❌ OFF'}\n\n📝 Usage:\n.online on\n.online off`);
            return true;
        }
    }
    
    // Anti Call
    if (command === '.anticall' || command === '/anticall') {
        if (action === 'on') {
            setFeature(userId, 'antiCall', true);
            m.reply('✅ *Anti Call Enabled*\n\nIncoming calls will be rejected');
            return true;
        } else if (action === 'off') {
            setFeature(userId, 'antiCall', false);
            m.reply('❌ *Anti Call Disabled*\n\nCalls will come through normally');
            return true;
        } else {
            const status = getUserSettings(userId).antiCall;
            m.reply(`📊 *Anti Call Status*\n\nCurrent: ${status ? '✅ ON' : '❌ OFF'}\n\n📝 Usage:\n.anticall on\n.anticall off`);
            return true;
        }
    }
    
    // Auto Reply Status
    if (command === '.autoreply' || command === '/autoreply') {
        if (action === 'on') {
            setFeature(userId, 'autoReplyStatus', true);
            m.reply('✅ *Auto Reply Status Enabled*\n\nStatus updates will be automatically replied to');
            return true;
        } else if (action === 'off') {
            setFeature(userId, 'autoReplyStatus', false);
            m.reply('❌ *Auto Reply Status Disabled*\n\nStatus updates will not be auto replied');
            return true;
        } else {
            const status = getUserSettings(userId).autoReplyStatus;
            m.reply(`📊 *Auto Reply Status*\n\nCurrent: ${status ? '✅ ON' : '❌ OFF'}\n\n📝 Usage:\n.autoreply on\n.autoreply off`);
            return true;
        }
    }
    
    // Show all features status
    if (command === '.features' || command === '/features' || command === '.status' || command === '/status') {
        const settings = getUserSettings(userId);
        let statusMsg = `📊 *Your Features Status*\n\n`;
        statusMsg += `🔔 *Automation*\n`;
        statusMsg += `  Auto Read: ${settings.autoRead ? '✅' : '❌'}\n`;
        statusMsg += `  Auto Type: ${settings.autoTyping ? '✅' : '❌'}\n`;
        statusMsg += `  Auto Rec: ${settings.autoRecording ? '✅' : '❌'}\n`;
        statusMsg += `  Auto View: ${settings.autoViewStatus ? '✅' : '❌'}\n`;
        statusMsg += `  Auto React: ${settings.autoReact ? '✅' : '❌'}\n`;
        statusMsg += `  Auto Reply: ${settings.autoReplyStatus ? '✅' : '❌'}\n\n`;
        statusMsg += `🔒 *Privacy*\n`;
        statusMsg += `  Always Offline: ${settings.alwaysOffline ? '✅' : '❌'}\n`;
        statusMsg += `  Always Online: ${settings.alwaysOnline ? '✅' : '❌'}\n`;
        statusMsg += `  Anti Call: ${settings.antiCall ? '✅' : '❌'}\n`;
        statusMsg += `  Anti View: ${settings.antiDelete ? '✅' : '❌'}\n\n`;
        statusMsg += `━━━━━━━━━━━━━━━━━━\n`;
        statusMsg += `Use .help to see all commands`;
        m.reply(statusMsg);
        return true;
    }
    
    // Show help
    if (command === '.help' || command === '/help') {
        let helpMsg = `📋 *Available Commands*\n\n`;
        helpMsg += `*Automation Features:*\n`;
        helpMsg += `  .autoread on/off - Auto read messages\n`;
        helpMsg += `  .autotype on/off - Auto typing indicator\n`;
        helpMsg += `  .autorec on/off - Auto recording\n`;
        helpMsg += `  .autoview on/off - Auto view status\n`;
        helpMsg += `  .autoreact on/off - Auto react\n`;
        helpMsg += `  .autoreply on/off - Auto reply status\n\n`;
        helpMsg += `*Privacy Features:*\n`;
        helpMsg += `  .offline on/off - Always offline\n`;
        helpMsg += `  .online on/off - Always online\n`;
        helpMsg += `  .anticall on/off - Block calls\n`;
        helpMsg += `  .antiview on/off - Capture deleted messages\n\n`;
        helpMsg += `*Other:*\n`;
        helpMsg += `  .features - Show all status\n`;
        helpMsg += `  .help - Show this menu\n`;
        m.reply(helpMsg);
        return true;
    }
    
    return false;
};

// Export functions
module.exports = {
    handleAutoFeatureCommands,
    getUserSettings,
    setFeature,
    toggleFeature,
    loadSettings,
    saveSettings
};
