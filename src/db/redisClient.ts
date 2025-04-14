import { createClient, type RedisClientType } from 'redis';

let client: RedisClientType | null;

const initializeRedisClient = async () => {
  if (!client) {
    client = createClient({
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
      }
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