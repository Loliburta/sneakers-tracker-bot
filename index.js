const { Client, Intents } = require("discord.js");
const scrapeProduct = require("./scrapeProduct");
const mongoose = require("mongoose");
const Sneaker = require("./models/sneaker");
const scanPrices = require("./scanPrices");
require("dotenv").config();
const dbURI = `mongodb+srv://${process.env.DB_LOGIN}:${process.env.DB_PASSWORD}@sneakers.f3nwf.mongodb.net/Sneakers?retryWrites=true&w=majority`;
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const prefix = "!";
const connect = async () => {
  try {
    console.log("connecting to db");
    await mongoose.connect(dbURI);
    console.log("connected to db");
    console.log("logging to discord");
    await client.login(process.env.DISCORDJS_BOT_TOKEN);
    client.user.setActivity("Ready for new shoes", { type: "PLAYING" });
    setInterval(scanPrices, 20000);
  } catch (error) {
    console.log(error);
  }
};

client.on("ready", () => {
  console.log(`${client.user.username} has logged in`);
});

client.on("messageCreate", async (message) => {
  // Ignore echoed messages.
  if (message.author.bot) {
    return;
  }
  if (message.content.startsWith(prefix)) {
    const [commandName, ...args] = message.content
      .trim()
      .substring(prefix.length)
      .split(/\s+/);
    console.log(commandName, args);
    console.log(
      typeof Number(args[1].slice(1, -1).replace(",", ".")) === "number"
    );
    const desiredSize = Number(args[1].slice(1, -1).replace(",", "."));
    const desiredPrice = Number(args[2].slice(1, -1).replace(",", "."));
    if (
      commandName === "watch" &&
      /www.nike.com/g.test(args[0]) &&
      typeof desiredSize === "number" &&
      typeof desiredPrice === "number"
    ) {
      const channel = client.channels.cache.find(
        (channel) => channel.id === message.channelId
      );
      try {
        const content = await scrapeProduct(args[0]);
        const sneaker = new Sneaker({
          link: args[0],
          userId: message.author.id,
          channelId: channel.id,
          shoes: content.shoes,
          price: content.price,
          desiredSize: desiredSize,
          desiredPrice: desiredPrice,
        });
        await sneaker.save();
      } catch (err) {
        console.log(err);
      }
    }
  }
});

connect();
