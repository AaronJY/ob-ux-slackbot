module.exports = {
    apiToken: process.env.apiToken || null,
    alert: process.env.alert || 'An alert must be set in config.js!',
    sendAlertToExistingOnStart: process.env.sendAlertToExistingOnStart || false,
    botUsername: process.env.botUsername || 'Default Bot Name',
    botIconUrl: process.env.botIconUrl || 'https://i.imgur.com/ARcbYgz.png',
    channelSuffix: process.env.channelSuffix || '-ur'
};