const User = require("../models/User");

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "name email status"
    );

    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

module.exports = {
  getUsers
};