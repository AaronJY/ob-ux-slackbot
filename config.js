module.exports = {
    apiToken: process.env.apiToken || null,
    alert: process.env.alert || 'An alert must be set in config.js!',
    sendAlertToExistingOnStart: process.env.sendAlertToExistingOnStart || false
};