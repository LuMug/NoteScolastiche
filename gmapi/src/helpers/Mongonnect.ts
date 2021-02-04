import dotenv from 'dotenv';
import path from 'path';
import mongodb, { MongoClient, MongoClientOptions } from 'mongodb';

dotenv.config({
    path: path.join(__dirname, '..', '.env')
});

export default async (): Promise<MongoClient> => {
    return new Promise<MongoClient>(async (resolve, reject) => {
        if (!process.env.DB_CONN) {
            reject('Invalid url (empty)!');
            return;
        }
        let opts: MongoClientOptions = {
            useUnifiedTopology: true,
            useNewUrlParser: true
        };
        try {
            resolve(await mongodb.connect(process.env.DB_CONN, opts));
            return;
        } catch (err) {
            reject(err);
            return;
        }
    });
}
