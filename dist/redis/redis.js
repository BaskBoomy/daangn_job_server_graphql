import { createClient } from 'redis';
import { config } from '../config.js';
let client;
export async function connectRedis() {
    client = createClient({
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password
    });
    client.on('error', (err) => console.log('Redis Client Error', err));
}
;
export async function setKey(key, value) {
    await client.set(key, value);
}
export async function getValue(key) {
    await client.get(key);
}
export async function deleteKey(key) {
    await client.del(key);
}
