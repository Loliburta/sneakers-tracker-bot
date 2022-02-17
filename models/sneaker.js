const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const sneakerSchema = new Schema(
  {
    link: { type: String, required: true },
    userId: { type: String, required: true },
    channelId: { type: String, required: true },
    shoes: {
      type: [
        {
          size: { type: Number, required: true },
          isAvailable: { type: Boolean, required: true },
        },
      ],
      required: true,
    },
    price: { type: Number, required: true },
    desiredSize: Number,
    desiredPrice: Number,
  },
  { timestamps: true }
);
module.exports = Sneaker = mongoose.model("Sneaker", sneakerSchema);
