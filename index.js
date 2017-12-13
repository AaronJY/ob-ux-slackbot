const config = require('./config');
const WebClient = require('@slack/client').WebClient;
const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

const http = require('http');
const heroku = require('./heroku');

var web = new WebClient(config.apiToken),
    rtm = new RtmClient(config.apiToken),
    botUserId;

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) =>  {
    botUserId = rtmStartData.self.id;
    console.log(`Logged in as ${rtmStartData.self.name} (${botUserId}) of team ${rtmStartData.team.name}`);

    if (config.sendAlertToExistingOnStart) {
        rtmStartData.channels.forEach((channel) => {
            alertChannelIfApplicable(channel.id, channel.name);
        });
    }
});

rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
    console.log('RTM connection opened');
});

rtm.on(RTM_EVENTS.CHANNEL_RENAME, (data) => {
    alertChannelIfApplicable(data.channel.id, data.channel.name);
});

rtm.on(RTM_EVENTS.CHANNEL_CREATED, (data) => {
    alertChannelIfApplicable(data.channel.id, data.channel.name);
});

function alertChannelIfApplicable(channelId, channelName) {
    if (channelName.endsWith(config.channelSuffix)) {
        sendAlert(channelId);
    }
}

function sendAlert(channelId) {
    if (!channelId) {
        throw 'channelId must be given';
    }

    let opts = { 
        as_user: false,
        username: config.botUsername,
        icon_url: config.botIconUrl
     };

    web.chat.postMessage(channelId, config.alert, opts, (err, res) => {
        if (err) {
            console.log(`Error: ${err}`);
        }
    });
}

console.log('Starting...');

heroku.keepAlive();
heroku.bindToHerokuPort();
rtm.start();

