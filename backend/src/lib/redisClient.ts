import { createClient } from "redis";

export const client = createClient({
  username: "default",
  password: "KUyGxjQfQR9edAugS7yze5pSZeaMjdnj",
  socket: {
    host: "redis-15220.c52.us-east-1-4.ec2.redns.redis-cloud.com",
    port: 15220,
  },
});
export const addUserEntry = async (uuid: string, name: string, socketId: string) => {
  await client.hSet(uuid, {
    name, socketId
  });
}

export const delUserEntry = async (uuid: string) => {
  await client.del(uuid);
}

export async function initRedisClient() {
  await client.connect();
  client.on("error", (err) => console.log("Redis Client Error", err));
  await client.hSet("1", {
    model: "Deimos ",
    brand: "Ergonom",
    type: "Enduro bikes",
    price: 4972,
  });
  await client.hSet("2", {
    model: "armagdon  ",
    brand: "nike",
    type: "motors",
    price: 321,
  });

  await client.hSet("3", {
    model: "ford",
    brand: "addidas",
    type: "motors",
    price: 222,
  });

  const res1 = await client.rPush("bikes:repairs", "bike:1");
  const res2 = await client.rPush("bikes:repairs", "bike:2");
  console.log(await client.lRange("bikes:repairs", 0, -1));
}
