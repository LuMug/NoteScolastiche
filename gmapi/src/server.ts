import http, { Server } from 'http';
import app from './app';
import { MongoHelper } from './helpers/MongoHelper';

const port: number = 5000;
const server: Server = http.createServer(app);

server.listen(port);
server.on('listening', () => console.log(`Listen on: ${port}`));
MongoHelper.connect()
    .then(() => console.log('Connected to db!'))
    .catch((err) => console.error(err));


