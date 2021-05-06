import app from './app';
import http, { Server } from 'http';
import { MongoHelper } from './helpers/MongoHelper';

const port: number = 5000;
let server: Server;
const createServer = () => {
    server = http.createServer(app);
    server.listen(port);
    server.on('listening', () => console.log(`Listen on: ${port}`));
    server.on('error', (err) => {
        console.error(err);
        createServer();
    });
}

createServer();
MongoHelper.connect()
    .then(() => console.log('Connected to db!'))
    .catch((err) => console.error(err));