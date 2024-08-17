const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    foods: Array,
    user: Object,
    tax: Number,
    amount: Number,
    seller: Object,
    isorderacceptedbydelivery: {
      type: Boolean,
      default: false,
    },
    acceptedby: Object,
    israted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "preparing...",
    },

    paymentstatus: {
      type: String,
      default: "cash on delivery",
    },
  },
  { timestamps: true }
);

const Orders = mongoose.model("Orders", orderSchema);

module.exports = Orders;
