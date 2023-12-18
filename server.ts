import { createServer } from 'http';
import { parse } from 'url';
import * as got from 'got';

const STEAM_WEB_API_KEY = String(process.env.STEAM_WEB_API_KEY);
const CACHE_MAX_AGE = parseInt(process.env.CACHE_MAX_AGE, 10) || 0;
const DBG = Boolean(process.env.DBG) || false;

createServer((req, res) => {
    const q = parse(req.url, true).query;
    if (DBG) console.log((new Date()).toJSON() + ' %O', q);
    if (q.appid && q.addr) {
        const filter_appid = parseInt(String(q.appid), 10);
        const filter_addr = encodeURIComponent(String(q.addr));
        const res_headers = {
            'Content-Type': 'application/json',
            'Cache-Control': 'max-age=' + String(CACHE_MAX_AGE)
        };
        got('https://api.steampowered.com/IGameServersService/GetServerList/v1/?filter=\\appid\\' + filter_appid + '\\addr\\' + filter_addr + '&key=' + STEAM_WEB_API_KEY, {
            responseType: 'json',
            headers: {'user-agent': 'steam-json-web-api/1.0'}
        }).then(data => {
            res.writeHead(200, res_headers);
            res.end(JSON.stringify(JSON.parse(data.body), null, DBG ? 2 : null));
        }).catch(err => {
            if (DBG) console.error('Error: %s', err.message);
            res.writeHead(404, res_headers);
            res.end(JSON.stringify({ error: err.message }, null, DBG ? 2 : null));
        });
    } else {
        res.writeHead(301, { 'Location': 'https://github.com/a-sync/steam-json-web-api#accepted-request-query-fields' });
        res.end();
    }
}).listen(80, '0.0.0.0');
