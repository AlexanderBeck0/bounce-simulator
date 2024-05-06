import express from 'express';
import ViteExpress from 'vite-express';
const app = express();
ViteExpress.config({mode: 'development'});

// eslint-disable-next-line no-undef
ViteExpress.listen(app, 3000 || process.env.port, () => {
    // eslint-disable-next-line no-undef
    console.log(`Server listening on port ${process.env.port || 3000}`)
});