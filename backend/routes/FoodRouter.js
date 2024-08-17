const multer = require("multer");
const { isauthentication } = require("../middlewares/isauthentication");
const Users = require("../schemas/userScheam");
const cloudinary = require("cloudinary");
const Foods = require("../schemas/foodSchema");

const router = require("express").Router();

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

router.post(
  "/create-item",
  isauthentication,
  upload.array("file"),
  async (req, res) => {
    const { name, estimateprice, price, description, category, tags } =
      req.body;

    const sellerDetails = JSON.parse(req?.body?.sellerDetails);
    try {
      const isUser = await Users.findOne({ email: req.user.email });

      if (!isUser)
        return res.send({ success: false, message: "token is expired" });

      if (!isUser.isseller)
        return res.send({ success: false, message: "you are not seller" });

      const tagss = tags.split(" ");

      let images = [];

      await Promise.all(
        req.files.map(async (file) => {
          try {
            console.log(file, " file");
            const result = await cloudinary.uploader.upload(file.path);
            console.log(result);
            images.push(result.secure_url);
          } catch (error) {
            console.log(error.message);
          }
        })
      );

      const newFood = new Foods({
        seller: req.user.email,
        name,
        estimateprice,
        price,
        description,
        category,
        images,
        tags: tagss,
        sellerDetails: sellerDetails,
      });

      await newFood.save();

      isUser.totalfoods = isUser.totalfoods + 1;
      await isUser.save();

      return res.send({ success: true, message: "success", newFood });
    } catch (error) {
      return res.send({ success: false, message: error.message });
    }
  }
);

router.post("/get-all-food-seller", async (req, res) => {
  try {
    if (!req.body.email)
      return res.send({
        success: false,
        message: "email is required to get all foods",
      });

    const foods = await Foods.find({ seller: req.body.email });

    return res.send({ success: true, message: "all foods get", foods: foods });
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/get-all-foods", async (req, res) => {
  try {
    const foods = await Foods.find();

    return res.send({ success: true, message: "all food get", foods });
  } catch (error) {
    return res.send({ success: false, messagge: error.message });
  }
});

module.exports = router;
