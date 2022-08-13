import {Request, Response} from "express";

const app = require('express')();
const {v4} = require('uuid');

app.get('/api', (req: Request, res: Response) => {
    const path = `/api/item/${v4()}`;
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.end(`Hello! Go to item: <a href="${path}">${path}</a>
        <br /> or visit xmlrpc middleware <br />
        <a href="/api/middleware/xmlrpc/metaweblog">/api/middleware/xmlrpc/metaweblog</a>
    `);
});

app.get('/api/item/:slug', (req: Request, res: Response) => {
    const {slug} = req.params;
    res.end(`Item: ${slug}`);
});

app.post('/api/middleware/xmlrpc/:type', (req: Request, res: Response) => {
    const {type} = req.params;
    res.end(`type: ${type}`);
});

// module.exports = app;
export default app;