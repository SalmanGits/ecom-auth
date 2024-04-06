require("dotenv").config();
const PORT = process.env.PORT || 3000;
const App = require("./app/main.js");
const register = new App()
const app = register.init()
app.listen(PORT, () => {
    console.log(`app is listening on ${PORT}`)
})


