require("dotenv").config();
let express = require("express");
let app = express();
let sequelize = require("./db");

let user = require("./controllers/usercontroller");
let profile = require("./controllers/profilecontroller");
let post = require("./controllers/postcontroller");
let comment = require("./controllers/commentcontroller");

sequelize.sync();

app.use(express.json());

app.use("/user", user);
app.use("/profile", profile);
app.use("/post", post);
app.use("/comment", comment);

//app.use(require("./middleware/headers.js"));

app.listen(process.env.PORT, () => {
	console.log(`Red Badge Server is running on: ${process.env.PORT}`);
});
