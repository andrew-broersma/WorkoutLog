require("dotenv").config()
const Express = require('express');
const app = Express();
const dbConnection = require("./db")
const controllers = require("./controllers")
const middleware = require("./middleware")

app.use(Express.json());

app.use("/user", controllers.userController)
app.use(require("./middleware/validate-session"));
app.use("/log", middleware.validateSession, controllers.logController)

dbConnection.authenticate()
.then(() => dbConnection.sync())
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`[Server]: App is listening on ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log(`[Server] crashed`)
    console.log(err)
})

