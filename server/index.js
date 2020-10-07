const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./UserSchema");
const History = require("./HistorySchema");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
mongoose
  .connect("mongodb://localhost/board-game", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Connect to mongo db successfully"))
  .catch((err) => console.log(err));
// Set header
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});
// Đăng Nhập;
app.post("/sign-in", async (req, res) => {
  try {
    const user = req.body;
    console.log(user);
    const isExists = await User.findOne({ username: user.username });
    if (isExists) {
      if (isExists.password === user.password) {
        return res.status(200).send(isExists);
      }
      return res.status(403).send("Password incorrect");
    }
    return res.status(403).send("User is not exists");
  } catch (error) {
    return res.send(error);
  }
});
// Đăng ký
app.post("/sign-up", async (req, res) => {
  try {
    const isExists = await User.findOne({ username: req.body.username });
    if (isExists) {
      return res.status(403).send("This username is already exists");
    }
    const user = new User(req.body);
    const history = new History({ owner: user._id });
    user.history = history._id;
    await user.save();
    await history.save();
    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
});
// Lấy toàn bộ thông tin user trong hệ thống
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({ role: "user" });
    return res.status(200).send(users);
  } catch (error) {
    return res.send(error);
  }
});
// Xóa user hoặc tìm trận đấu
app.post("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;
    const user = await User.findById(userId);
    if (status) {
      user.status = status;
      if (status === "finding") {
        user.status = "finding";
        await user.save();
        const opponent = await User.findOne({
          role: "user",
          status: "finding",
          _id: { $ne: userId },
        });
        if (opponent) {
          opponent.status = "playing";
          user.status = "playing";
          await opponent.save();
          await user.save();

          return res.status(201).send(opponent);
        }
        return res.status(202).send();
      }
      await user.save();
      return res.status(200).send(user.status);
    }
    await User.findByIdAndDelete(userId);
    await History.findByIdAndDelete(user.history);

    return res.status(200).send("Remove successfully");
  } catch (error) {
    return res.send(error);
  }
});
// Lưu lịch sử;
app.post("/result-match/:user1Id/:user2Id/:winner", async (req, res) => {
  try {
    const { user1Id, user2Id, winner } = req.params;
    const historyUse1 = await History.findOne({ owner: user1Id });
    const historyUse2 = await History.findOne({ owner: user2Id });
    const { duration } = req.body;
    if (winner === user1Id) {
      historyUse1.history.push({ duration, result: "win" });
      historyUse2.history.push({ duration, result: "lose" });
    } else {
      historyUse1.history.push({ duration, result: "lose" });
      historyUse2.history.push({ duration, result: "win" });
    }
    await historyUse1.save();
    await historyUse2.save();
    return res.status(200).send({ historyUse1, historyUse2 });
  } catch (error) {
    return res.send(error);
  }
});
// Lấy lịch sử của user
app.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await History.findOne({ owner: userId });
    const listHistory = history.history;
    return res.status(200).send(listHistory);
  } catch (error) {
    return res.send(error);
  }
});

// Chạy server và tạo account admin mặc định
app.listen(5000, async () => {
  try {
    let admin_01, admin_02;
    admin_01 = await User.findOne({ username: "admin_01" });
    admin_02 = await User.findOne({ username: "admin_02" });
    if (admin_01 && admin_02) {
      console.log("Server listening at port 5000");
      return;
    }
    if (!admin_01) {
      admin_01 = new User({
        username: "admin_01",
        password: "fw2323444vvkgjJKFEHFE",
        fullName: "Admin 01",
        role: "admin",
      });
      await admin_01.save();
    }
    if (!admin_02) {
      admin_02 = new User({
        username: "admin_02",
        password: "123444444444",
        fullName: "Admin 02",
        role: "admin",
      });
      await admin_02.save();
    }
    console.log("Server listening at port 5000");
  } catch (error) {
    console.log(error);
  }
});
