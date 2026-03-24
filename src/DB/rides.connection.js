import { createClient } from "redis";
import { REDIS_URL } from "../config/env.config.js";

export const redisClient = createClient({
    url: REDIS_URL
})

export async function connectRedis() {
    try {
        await redisClient.connect();
        console.log("Connected to Redis");
    } catch (error) {
        console.error("Error connecting to Redis:", error);
    }
}
await connectRedis();

export function deconnectRedis() {
     redisClient.destroy();
}