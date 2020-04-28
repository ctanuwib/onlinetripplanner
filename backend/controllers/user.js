const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hash
    });
    user.save().then(result => {
      res.status(201).json({
        message: "User Created!",
        result: result
      });
    })
      .catch(err => {
        res.status(500).json({
          message: "Invalid user credentials!"
        });
      })
  })
}

exports.updateUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hash,
      _id: req.params.id
    });
    User.updateOne({ _id: req.params.id }, user).then(result => {
      res.status(201).json({
        message: "User Created!",
        result: result
      });
    })
      .catch(err => {
        res.status(500).json({
          message: "Invalid user credentials!"
        });
      })
  })
}


exports.login = (req, res, next) => {
  let fetchUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      else {
        fetchUser = user;
        return bcrypt.compare(req.body.password, user.password);
      }
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      else {
        const token = jwt.sign({ name: fetchUser.name, email: fetchUser.email, userId: fetchUser._id }, process.env.JWT_KEY, { expiresIn: "1h" });
        res.status(200).json({
          token: token,
          userId: fetchUser._id,
          name: fetchUser.name,
          email: fetchUser.email,
          expiresIn: 3600
        })
      }
    })
    .catch(err => {
      return res.status(401).json({
        message: "Invalid user credentials!"
      });
    })
}
