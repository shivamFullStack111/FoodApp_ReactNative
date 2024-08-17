const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    orders: Array,
    isseller: Boolean,
    isdeliverypartner: {
      type: Boolean,
      default: false,
    },
    currentlocation: {
      latitude: Number,
      longitude: Number,
      city: String,
      State: String,
    },
    deliverydata: {
      name: String,
      age: Number,
      state: String,
      city: String,
      documenturi: String,
    },
    phonenumber: Number,
    address: {
      latitude: Number,
      longitude: Number,
      houseno: String,
      nearby: String,
      area: String,
      addresstype: String,
    },
    shopaddress: {
      city: String,
      state: String,
      address: String,
      latitude: Number,
      longitude: Number,
    },
    shopratingsdata: {
      rating: {
        type: Number,
        default: 0,
      },
      numberofratings: {
        type: Number,
        default: 0,
      },
      reviews: Array,
    },
    shoptype: String,
    shopname: String,
    image: String,

    ratings: {
      type: Number,
      default: 0,
    },
    totalfoods: {
      type: Number,
      default: 0,
    },
    totalorders: {
      type: Number,
      default: 0,
    },
    totalsells: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const Users = mongoose.model("User", userSchema);

module.exports = Users;
