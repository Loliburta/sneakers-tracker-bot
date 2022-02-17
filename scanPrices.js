const mongoose = require("mongoose");
const Sneaker = require("./models/sneaker");
const scrapeProduct = require("./scrapeProduct");
const { Client, Intents } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
const dbURI = `mongodb+srv://${process.env.DB_LOGIN}:${process.env.DB_PASSWORD}@sneakers.f3nwf.mongodb.net/Sneakers?retryWrites=true&w=majority`;

module.exports = scanPrices = async () => {
  try {
    await mongoose.connect(dbURI);
    const sneakers = await Sneaker.find();
    sneakers.forEach((sneaker, idx) => {
      let updated = false;
      const filter = { _id: sneaker._id };
      setTimeout(async () => {
        console.log(`scanning sneakers nr ${idx}`);
        sneaker.shoes.forEach(async (shoe) => {
          if (
            shoe.size === sneaker.desiredSize &&
            shoe.isAvailable &&
            sneaker.desiredPrice >= sneaker.price
          ) {
            updated = true;
            await client.login(process.env.DISCORDJS_BOT_TOKEN);
            client.channels.cache
              .get(sneaker.channelId)
              .send(
                `<@${sneaker.userId}> sneakers ${sneaker.link} are available in size ${sneaker.desiredSize} and price is ${sneaker.price}`
              );
          }
        });
        if (!updated) {
          const updatedProduct = await scrapeProduct(sneaker.link);
          const update = {
            shoes: updatedProduct.shoes,
            price: updatedProduct.price,
          };
          await Sneaker.findOneAndUpdate(filter, update);
        } else {
          await Sneaker.deleteOne(filter);
        }
      }, 5000 * idx);
    });
  } catch (err) {
    console.log(err);
  }
};
