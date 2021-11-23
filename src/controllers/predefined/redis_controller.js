/* eslint-disable no-undef */
/* eslint-disable promise/prefer-await-to-callbacks */
/* eslint-disable no-console */
import {promisify} from "util";
import redis from "redis";
import redisLock from "redis-lock";

import {
    redisHost,
    redisPort,
    redisPassword,
    redisPrefix,
} from "../../config/environment.js";

let redisClient = redis.createClient({
    host: redisHost,
    port: redisPort,
    //  password: redisPassword,
});

const lock = promisify(redisLock(redisClient));
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

export async function setKey(key, value) {
    await setAsync(`${redisPrefix}${key}`, value);
}

export async function getKey(key) {
    let value = await getAsync(`${redisPrefix}${key}`);
    return value;
}

export async function acquireLock(name, ms = 3000) {
    try {
        const unlock = await lock(`${redisPrefix}${name}`, ms);
        return unlock;
    } catch (error) {
        return false;
    }
}
