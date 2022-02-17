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
const scrapeProduct = require("./scrapeProduct");
const test = async () => {
  const res = await scrapeProduct(
    "https://www.nike.com/pl/t/buty-treningowe-metcon-7-flyease-RKGv1m/DH3344-883"
  );
  console.log(res);
};
test();
