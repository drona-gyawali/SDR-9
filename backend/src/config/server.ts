import express, { Express } from 'express';
import { conf, corsOption } from '../config/conf';
import http from 'http';
import socketManager from '../manager/socketManager';
import emailRoutes from '../routes';
import cors from 'cors';

const app: Express = express();
app.use(express.json());

app.use(cors(corsOption));
const server = http.createServer(app);

socketManager.Init(server);

app.use('/api/v1/', emailRoutes);

server.listen(conf.port, '0.0.0.0', () => {
  console.log('Server is running on: ', conf.port);
});
