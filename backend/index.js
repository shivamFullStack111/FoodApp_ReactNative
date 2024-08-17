const express = require("express");
const socketIo = require("socket.io");
const http = require("http");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routes/userRouter");
const orderRouter = require("./routes/orderRoute");
const foodRouter = require("./routes/FoodRouter");
const path = require("path");
const Razorpay = require("razorpay");

// Connect to MongoDB
mongoose
  .connect("mongodb://0.0.0.0:27017/food_app_new_data")
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(foodRouter);
app.use(orderRouter);
app.use(express.static(path.join(__dirname, "public")));

// Razorpay instance
const instance = new Razorpay({
  key_id: "rzp_test_A6yh3UOLzFi45o",
  key_secret: "CZHPKNdg8lAf2VZ7gsMi1lMN", // Consider using environment variables
});

// Razorpay payment intent route
userRouter.post("/create-intence", async (req, res) => {
  try {
    const intence = await instance.orders.create({
      amount: 50000,
      currency: "INR",
      receipt: "receipt#1",
      partial_payment: false,
      notes: {
        key1: "value3",
        key2: "value2",
      },
    });

    return res.send({
      success: true,
      message: "intence created",
      intence: intence,
    });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
});

// Socket.io setup
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

let activeUsers = [];
const socketToUser = new Map();
const userToSocket = new Map();

const addUser = (user) => {
  const existingUser = activeUsers.find((u) => u.user._id === user.user._id);
  if (!existingUser) {
    activeUsers = [...activeUsers, user];
  }

  if (!socketToUser.get(user.socketid)) {
    socketToUser.set(user.socketid, user.user);
    userToSocket.set(user.user.email, user.socketid);
  }
};

const removeUser = (socketid) => {
  activeUsers = activeUsers.filter((u) => u.socketid !== socketid);

  const user = socketToUser.get(socketid);
  if (user) {
    socketToUser.delete(socketid);
    userToSocket.delete(user.email);
  }
};

io.on("connection", (socket) => {
  console.log("user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
    removeUser(socket.id);
    io.emit("activeUsers", activeUsers);
  });

  socket.on("addMe", ({ user }) => {
    addUser({ user, socketid: socket.id });
    io.emit("activeUsers", activeUsers);
  });

  socket.on("newOrder", (data) => {
    console.log(data);
    const receiverSocketId = userToSocket.get(data?.user?.email);
    const sellerId = activeUsers?.find((u) => u?.user?.socketid);
    console.log("sellerid:-  ", data?.sellerData?.socketid);
    if (data?.sellerData?.socketid) {
      socket
        .to(data?.sellerData?.socketid)
        .emit("notificationOfNewOrder", data);
    }

    // sending to all delivery partner

    io.emit("neworderforpartner", data);
  });

  socket.on("newLocation", (data) => {
    // io.emit("newLocationForUser", data);

    const buyer = activeUsers?.find(
      (usr) => usr?.user?.email == data?.order?.user?.email
    );

    console.log(
      "active:-------",
      data?.order?.user?.email,
      activeUsers[0]?.user?.email
    );

    socket.to(buyer?.socketid).emit("partnerNewLocation", data);
  });

  socket.on("updateStatus", ({ order, status }) => {
    const buyer = activeUsers?.find(
      (usr) => usr?.user?.email == order?.user?.email
    );

    if (buyer)
      socket.to(buyer.socketid).emit("updatedStatusToBuyer", { status, order });
  });
});

server.listen(9000, () => {
  console.log("Server running on port 9000");
});
