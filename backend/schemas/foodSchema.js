const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: String,
    estimateprice: String,
    price: String,
    description: String,
    images: Array,
    reviews: [
      {
        rating: Number,
        review: String,
      },
    ],
    numberofratings: {
      type: Number,
      default: 0,
    },
    totalratings: Number,
    category: String,
    seller: String,
    tags: Array,
    sellerDetails: Object,
  },
  { timestamps: true }
);

const Foods = mongoose.model("foods", foodSchema);
module.exports = Foods;
