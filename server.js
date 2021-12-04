"use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const https_1 = require("https");
const url_1 = require("url");
const STEAM_WEB_API_KEY = String(process.env.STEAM_WEB_API_KEY);
const CACHE_MAX_AGE = parseInt(process.env.CACHE_MAX_AGE, 10) || 0;
const DBG = Boolean(process.env.DBG) || false;
const onError = (err, res) => {
    res.writeHead(404, {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=' + String(CACHE_MAX_AGE)
    });
    if (DBG)
        console.error('Error: %s', err.message);
    res.end(JSON.stringify({ error: err.message }, null, DBG ? 2 : null));
};
(0, http_1.createServer)((req, res) => {
    const q = (0, url_1.parse)(req.url, true).query;
    if (DBG)
        console.log('%o', q);
    if (q.appid && q.addr) {
        const filter_appid = parseInt(String(q.appid), 10);
        const filter_addr = encodeURIComponent(String(q.addr));
        (0, https_1.get)('https://api.steampowered.com/IGameServersService/GetServerList/v1/?filter=\\appid\\' + filter_appid + '\\addr\\' + filter_addr + '&key=' + STEAM_WEB_API_KEY, apiRes => {
            let data = '';
            apiRes.on('data', chunk => {
                data += chunk;
            });
            apiRes.on('end', () => {
                try {
                    if (data === '{"response":{}}') {
                        throw new Error('Steam API response empty');
                    }
                    else if (apiRes.statusCode >= 200 && apiRes.statusCode < 400) {
                        res.writeHead(200, {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'max-age=' + String(CACHE_MAX_AGE)
                        });
                        res.end(JSON.stringify(JSON.parse(data), null, DBG ? 2 : null));
                    }
                    else {
                        throw new Error('Steam API responded with status code ' + String(apiRes.statusCode));
                    }
                }
                catch (err) {
                    onError(err, res);
                }
            });
        }).on('error', (err) => {
            onError(err, res);
        });
    }
    else {
        res.writeHead(301, { 'Location': 'https://github.com/a-sync/steamapi.cloudno.de' });
        res.end();
    }
}).listen(80, '0.0.0.0');
