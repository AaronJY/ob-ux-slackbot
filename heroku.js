const http = require('http');
const appName = 'ob-ux-slackbot';

module.exports = (function(module) {
    const port = process.env.PORT;

    module.keepAlive = function() {
        console.log('Keeping Heroku app alive')

        setInterval(function() {
            http.get(`https://${appName}.herokuapp.com/`);
        }, 300000);
    };

    module.bindToHerokuPort = function() {
        console.log(`Attempting to listen on port ${port}...`);

        if (!port) {
            console.log('No port has been given. Aborting heroku port binding');
            return;
        }
        
        http.createServer((req, res) => {
            res.writeHead(200, 'OK');
            res.write(`<strong>${appName}</strong> is online`);
            res.end();
        }).listen(port);

        console.log('Successfully listening');
    }

    return module;

})(module.exports || {});