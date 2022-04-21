import Ruby from "./structures/Client";
import "dotenv/config";

const client = new Ruby({
  token: process.env.TOKEN,
  mongodbUri: process.env.MONGO_DB,
  invite: process.env.INVITE,
  supportUrl: `https://rubybots.co/community`,
  sandBoxServers: ["961705808679272448"],
});

export default client;
