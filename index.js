var express = require("express");
var app = express();
var mongoose = require("mongoose");

var indexRouter = require("./routes/index");
var chudeRouter = require("./routes/chude");
var taikhoanRouter = require("./routes/taikhoan");
var baivietRouter = require("./routes/baiviet");

const uri =
    "mongodb+srv://huynhthanhdat2506:Thanhdat1710@cluster0.jidw04y.mongodb.net/trangtin?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri).catch((err) => console.log(err));

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/chude", chudeRouter);
app.use("/taikhoan", taikhoanRouter);
app.use("/baiviet", baivietRouter);

app.get("/", (req, res) => {
    res.render("index", {
        title: "Trang tin",
    });
});

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});
