const { DataTypes } = require("sequelize");
const db = require("../db")

const User = db.define("user", {
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
    }
})


module.exports = User