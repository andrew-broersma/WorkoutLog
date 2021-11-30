const router = require("express").Router()
const { UserModel } = require("../models")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

router.post("/register", async (req, res) => {
    try {
        const newUser = await UserModel.create({
            userName: req.body.userName,
            passwordHash: bcrypt.hashSync(req.body.passwordHash, 12)
        })

        const token = jwt.sign({ id: newUser.id },process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24})

        res.status(201).json({
            message: "Account created successfully",
            token: `Bearer ${token}`
        })
    } catch (err) {
        res.status(500).json({
            message: `failed to create user: ${err}`
        })
    }
});

router.post("/login", async (req, res) => {
    let { userName, passwordHash } = req.body;
    try {
        let loginUser = await UserModel.findOne({
            where: {
                userName: userName
            },
        });
        if (loginUser) {

            let passwordComparison = await bcrypt.compare(passwordHash, loginUser.passwordHash);

            if (passwordComparison) {

                let token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 72})

                res.status(200).json({
                    user: loginUser,
                    message: "User succssfully logged in",
                    sessionToken: `Bearer ${token}`
                });
            } else {
                res.status(401).json({
                    message: "Incorrect email or password"
                })
            }
        } else {
            res.status(401).json({
                message: 'Incorrect email or password'
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Failed to find user"
        })
    }
});

module.exports = router