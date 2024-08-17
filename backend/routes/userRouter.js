const Users = require("../schemas/userScheam");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isauthentication } = require("../middlewares/isauthentication");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

const JWT_SECRET = process.env.JWT_SECRET;

const CLOUDINARY_API = "228143919823428";

const CLOUDINARY_SECRET = "Ek0TH0dZMQ8FtQp8iG8D4NYUD9o";

const upload = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 500000000 },
});

cloudinary.config({
  cloud_name: "dyvoxcqpt",
  api_key: CLOUDINARY_API,
  api_secret: CLOUDINARY_SECRET,
});

const router = require("express").Router();
router.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;

    const isExist = await Users.findOne({ email: email.toLowerCase() });

    if (isExist)
      return res.send({ success: false, message: "user already registered" });

    const hash = await bcrypt.hash(password, 10);

    const newUser = new Users({
      name,
      email,
      password: hash,
    });
    await newUser.save();

    const usr = await Users.findOne({ email: email.toLowerCase() });

    const token = await jwt.sign({ user: usr }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.send({
      success: true,
      message: "user registered successfully",
      token,
      user: usr,
    });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const isExist = await Users.findOne({ email: email.toLowerCase() });

    if (!isExist)
      return res.send({
        success: false,
        message: "email or password in invalid",
      });

    const isMatch = await bcrypt.compare(password, isExist.password);

    if (isMatch) {
      const token = await jwt.sign({ user: isExist }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.send({
        success: true,
        message: "user login successfully",
        token,
        user: isExist,
      });
    }
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
});

router.get("/isauthenticated", isauthentication, async (req, res) => {
  try {
    const isUserFind = await Users.findOne({
      email: req?.user?.email?.toLowerCase(),
    }).select("-password");

    if (!isUserFind)
      return res.send({ success: false, message: "login token is expired" });

    return res.send({
      success: true,
      message: "token is valid",
      user: isUserFind,
    });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
});

router.post(
  "/create-shop",
  isauthentication,
  upload.single("file"),
  async (req, res) => {
    console.log("call");
    try {
      const {
        shoptype,
        phonenumber,
        shopaddress,
        shopname,
        city,
        state,
        latitude,
        longitude,
      } = req.body;
      let isuser = await Users.findOne({ email: req.user.email.toLowerCase() });

      console.log(req.file);

      if (!req.file)
        return res.send({ success: false, message: "image is required" });

      if (!isuser)
        return res.send({ success: false, message: "token is expired" });

      if (!isuser.isseller) {
        const result = await cloudinary.uploader.upload(req.file.path);

        console.log(result.secure_url);

        isuser.shopname = shopname;
        isuser.shoptype = shoptype;
        isuser.phonenumber = phonenumber;
        isuser.isseller = true;
        isuser.image = result.secure_url;
        isuser.url = result.secure_url;
        isuser.shopaddress = {
          city: city,
          address: shopaddress,
          state: state,
          latitude,
          longitude,
        };

        await isuser.save();

        return res.send({
          success: true,
          message: "shop created successfully",
          user: isuser,
        });
      }

      return res.send({ success: false, message: "shop already exists" });
    } catch (error) {
      return res.send({ success: false, message: error.message });
    }
  }
);

router.get("/get-all-shop", async (req, res) => {
  try {
    const shops = await Users.find({ isseller: true }).select(
      "-name -password -orders -totalsells"
    );

    return res.send({ success: true, message: "all shop get", shops });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
});

//get seller
router.get("/get-seller/:email", async (req, res) => {
  try {
    console.log("first");
    const { email } = req.params;

    if (!email)
      return res.send({
        success: false,
        message: "email is required to fetch seller",
      });

    const seller = await Users.findOne({ email });

    if (!seller)
      return res.send({ success: false, message: "seller not found" });

    return res.send({ success: true, message: "seller was found", seller });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
});

router.post("/update-user-address", isauthentication, async (req, res) => {
  try {
    const isUser = await Users.findOne({
      email: req?.user?.email.toLowerCase(),
    });
    const { latitude, longitude, houseno, nearby, area, type } = req.body;
    if (!isUser) return res.send({ success: false, message: "user not found" });

    isUser.address = req.body;

    await isUser.save({
      addresstype: type,
      latitude,
      longitude,
      houseno,
      nearby,
      area,
    });

    return res.send({
      success: true,
      message: "user address updated successfully",
      user: isUser,
    });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
});

router.post("/get-seller-address", isauthentication, async (req, res) => {
  try {
    const seller = await Users.findOne({ email: req.body.email.toLowerCase() });
    return res.send({
      success: true,
      message: "address found",
      address: seller?.shopaddress,
    });
  } catch (error) {
    console.log(error.message);
    return res.send({ success: false, message: error.message });
  }
});

router.post(
  "/become-delivery-partner",
  isauthentication,
  upload.single("file"),
  async (req, res) => {
    try {
      const { name, age, state, city } = req.body;
      console.log(req.file);

      if (!name || !age || !state || !city)
        return res.send({ success: false, message: "All fields are required" });

      if (!req.file)
        return res.send({
          success: false,
          message: "Document is required to become a partner",
        });

      const user = await Users.findOne({
        email: req?.user?.email.toLowerCase(),
      });

      if (!user)
        return res.send({
          success: false,
          message: "Please login to continue",
        });

      if (user?.isseller)
        return res.send({
          success: false,
          message: "You are a seller, you cannot become a partner",
        });

      // if (user?.isdeliverypartner)
      //   return res.send({
      //     success: false,
      //     message: "You are already a partner",
      //   });

      const uploadImage = async (path) => {
        const res = await cloudinary.uploader.upload(path);
        return res?.secure_url;
      };

      const url = await uploadImage(req.file?.path);
      console.log(url);

      const deliverydata = {
        name,
        age,
        state,
        city,
        documenturi: url,
      };

      // Save the delivery data and update user status
      user.deliverydata = deliverydata;
      user.isdeliverypartner = true;

      await user.save();

      return res.send({
        success: true,
        message: "You have successfully become a delivery partner",
        user,
      });
    } catch (error) {
      console.log(error.message);
      return res.send({ success: false, message: error.message });
    }
  }
);

module.exports = router;

module.exports = router;
