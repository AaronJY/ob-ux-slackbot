module.exports = {
    apiToken: process.env.apiToken || null,
    alert: process.env.alert || 'This is a test!',
    sendAlertToExistingOnStart: process.env.sendAlertToExistingOnStart || false
};