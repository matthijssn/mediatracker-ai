// services/api-gateway/src/server.ts
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());

const MEDIA = process.env.MEDIA_SERVICE_URL || 'http://media-service:4000';
const REC = process.env.RECOMMENDATION_SERVICE_URL || 'http://recommendation-service:4100';
const PREFS = process.env.PREFERENCES_SERVICE_URL || 'http://preferences-service:4200';

app.use('/media', createProxyMiddleware({ target: MEDIA, changeOrigin: true, pathRewrite: {'^/media': ''} }));
app.use('/recommendations', createProxyMiddleware({ target: REC, changeOrigin: true, pathRewrite: {'^/recommendations': ''} }));
app.use('/preferences', createProxyMiddleware({ target: PREFS, changeOrigin: true, pathRewrite: {'^/preferences': ''} }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API Gateway running on ${PORT}`));
