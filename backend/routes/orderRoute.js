const { isauthentication } = require("../middlewares/isauthentication");
const Orders = require("../schemas/orderSchema");
const Users = require("../schemas/userScheam");

const router = require("express").Router();

router.post("/create-order", isauthentication, async (req, res) => {
  try {
    const isUser = await Users.findOne({ email: req.user.email });

    if (!isUser)
      return res.send({ success: false, messsage: "user not found" });

    const newOrder = new Orders({ ...req.body, otp: genOtp() });

    await newOrder.save();

    const seller = await Users.findOne({ email: req.body.seller });
    const user = await Users.findOne({ email: req.body.user.email });

    seller.totalsells += req.body.foods.length;
    user.totalorders += 1;

    await seller.save();
    await user.save();

    // console.log(seller);
    // console.log(user);

    return res.send({
      success: true,
      message: "order created successfully",
      order: newOrder,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
      order: newOrder,
    });
  }
});

router.get("/get-user-orders", isauthentication, async (req, res) => {
  try {
    const orders = await Orders.find({ "user.email": req.user.email });

    console.log("orders :-    ", req.user._id);

    return res.send({ success: true, message: "all orders of user", orders });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
});

router.post("/send-review", isauthentication, async (req, res) => {
  try {
    const { ratings, review, orderid } = req.body;
    const order = await Orders.findOne({ _id: orderid });

    if (order?.user?.email !== req.user?.email)
      return res.send({
        success: false,
        message: `order buyer and your email does't match`,
      });

    if (order.israted)
      return res.send({ success: false, message: "already rated" });

    const shop = await Users.findOne({ email: order?.seller });

    shop.shopratingsdata.numberofratings += 1;
    shop.shopratingsdata.reviews = [
      ...shop.shopratingsdata.reviews,
      {
        user: req.user,
        message: review,
      },
    ];
    shop.shopratingsdata.rating += ratings;
    shop.shopratingsdata.rating =
      shop.shopratingsdata.rating / shop.shopratingsdata.numberofratings;

    order.israted = true;

    await order.save();
    await shop.save();

    return res.send({ success: true, message: "review nd rating success" });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
});

router.get(
  "/getAll_Near_OrderOf_DeliveryPartner",
  isauthentication,
  async (req, res) => {
    try {
      const orders = await Orders.find({ isorderacceptedbydelivery: false });
      const filterOrders = orders.filter(
        (odr) => odr?.user?.state == req?.user?.state
      );

      return res.send({
        success: true,
        message: "orders get successfully",
        orders: filterOrders,
      });
    } catch (error) {
      console.log(error.message);
      return res.send({ success: false, message: error.message });
    }
  }
);

router.get("/get-seller-orders", isauthentication, async (req, res) => {
  try {
    const orders = await Orders.find({ seller: req.user.email });

    console.log(orders);

    return res.send({ success: true, message: "all orders of seller", orders });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
});

router.get("/get-partner-live-order", isauthentication, async (req, res) => {
  try {
    // find order which status not equals to 'delivered'
    const order = await Orders.findOne({
      isorderacceptedbydelivery: true,
      "acceptedby.email": req.user?.email,
      status: { $ne: "delivered" },
    });

    if (!order)
      return res.send({ success: false, message: "order not found " });
    else return res.send({ success: true, message: "order found ", order });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
});

router.post("/update-status-of-order", isauthentication, async (req, res) => {
  try {
    const { orderid, otp } = req.body;
    const order = await Orders.findById({ _id: orderid });
    if (!order) return res.send({ success: false, message: "order not found" });
    if (order.otp != otp)
      return res.send({ success: false, message: "invalid otp" });

    if (order.status == "delivered")
      return res.send({ success: false, message: "order already delivered" });
    console.log(order?.acceptedby?.email);
    if (order?.acceptedby?.email !== req?.user?.email)
      return res.send({
        success: false,
        message: "you are not assigned to this order",
      });

    order.status = "delivered";

    await order.save();
    return res.send({ success: true, message: "order status updated" });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
});

router.post("/confirm-order-partner", isauthentication, async (req, res) => {
  try {
    const { orderid, latitude, longitude } = req.body;

    const order = await Orders.findOne({ _id: orderid });

    order.isorderacceptedbydelivery = true;

    order.acceptedby = {
      ...req.user,
      latitude,
      longitude,
    };

    await order.save();
    return res.send({
      success: true,
      message: "order confirm ",
      order: order,
    });
  } catch (error) {
    console.log(error.message);
    return res.send({ success: false, message: error.message });
  }
});

router.post("/update-order-status", isauthentication, async (req, res) => {
  try {
    const { orderid, status } = req.body;

    const order = await Orders.findOne({ _id: orderid });

    order.status = status;
    await order.save();

    return res.send({
      success: true,
      message: "order updated successfully",
      order: order,
    });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
});

module.exports = router;

const genOtp = () => {
  let otp = "";
  for (let i = 0; i <= 3; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};
