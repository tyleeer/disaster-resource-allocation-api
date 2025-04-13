import { createClient, type RedisClientType } from 'redis';

let client: RedisClientType | null;

const initializeRedisClient = async () => {
  if (!client) {
    client = createClient({
      url: process.env.REDIS_URL as string,
    });

    client.on("error", (err) => {
      console.error("Redis error:", err);
    });

    await client.connect();
    console.log("Redis Client Connected");
  }

  return client;
}

export default initializeRedisClient;