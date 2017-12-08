const ChannelSuffix = '-ur';
const config = require('./config').config;
var WebClient = require('@slack/client').WebClient;
var RtmClient = require('@slack/client').RtmClient;

const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

const ApiToken = process.env.token || config.apiToken;

var web = new WebClient(ApiToken);
var rtm = new RtmClient(ApiToken);

var botUserId;

console.log('Starting...');

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) =>  {
    botUserId = rtmStartData.self.id;
    console.log(botUserId);
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}`);

    if (config.sendAlertToExistingOnStart) {
        rtmStartData.channels.forEach((channel) => {
            alertChannelIfApplicable(channel.id, channel.name);
        });
    }
});

rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
    console.log('RTM connection opened!');
});

rtm.on(RTM_EVENTS.CHANNEL_RENAME, (data) => {
    alertChannelIfApplicable(data.channel.id, data.channel.name);
});

rtm.on(RTM_EVENTS.CHANNEL_CREATED, (data) => {
    alertChannelIfApplicable(data.channel.id, data.channel.name);
});

function alertChannelIfApplicable(channelId, channelName) {
    if (channelName.endsWith(ChannelSuffix)) {
        joinChannel(channelId);
        sendAlert(channelId);
    }
}

function joinChannel(channelId = null) {
    if (!channelId) {
        throw 'channelId must be given';
    }

    web.channels.invite(channelId, botUserId, (err, res) => {
        if (err) {
            console.log(`Error: ${err}`);
        }
    });
}

function sendAlert(channelId) {
    if (!channelId) {
        throw 'channelId must be given';
    }

    web.chat.postMessage(channelId, ChannelMessage, (err, res) => {
        if (err) {
            console.log(`Error: ${err}`);
        }
    });
}

rtm.start();