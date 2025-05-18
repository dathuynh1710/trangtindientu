var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");
var TaiKhoan = require("../models/taikhoan");
// GET: Đăng ký
router.get("/dangky", async (req, res) => {
    res.render("dangky", {
        title: "Đăng ký tài khoản",
    });
});
// POST: Đăng ký
router.post("/dangky", async (req, res) => {
    var salt = bcrypt.genSaltSync(10);
    var data = {
        HoVaTen: req.body.HoVaTen,
        Email: req.body.Email,
        HinhAnh: req.body.HinhAnh,
        TenDangNhap: req.body.TenDangNhap,
        MatKhau: bcrypt.hashSync(req.body.MatKhau, salt),
    };
    await TaiKhoan.create(data);
    req.session.success = "Đăng ký tài khoản thành công";
    res.redirect("/success");
});
// GET: Đăng nhập
router.get("/dangnhap", async (req, res) => {
    res.render("dangnhap", {
        title: "Đăng nhập ",
    });
});
// POST: Đăng nhập
router.post("/dangnhap", async (req, res) => {
    if (req.session.MaNguoiDung) {
        req.session.error = "Nguoi dung da dang nhap roi";
        res.redirect("/error");
    } else {
        var taikhoan = await TaiKhoan.findOne({
            TenDangNhap: req.body.TenDangNhap,
        }).exec();
        if (taikhoan) {
            if (bcrypt.compareSync(req.body.MatKhau, taikhoan.MatKhau)) {
                if (taikhoan.KichHoat == 0) {
                    req.session.error = "Tai khoan chua duoc kich hoat";
                    res.redirect("/error");
                } else {
                    req.session.MaNguoiDung = taikhoan._id;
                    req.session.HoVaTen = taikhoan.HoVaTen;
                    req.session.QuyenHan = taikhoan.QuyenHan;
                    res.redirect("/");
                }
            } else {
                req.session.error = "Sai mat khau";
                res.redirect("/error");
            }
        } else {
            req.session.error = "Tai khoan khong ton tai";
            res.redirect("/error");
        }
    }
});
// GET: Đăng xuất
router.get("/dangxuat", async (req, res) => {
    if (req.session.MaNguoiDung) {
        delete req.session.MaNguoiDung;
        delete req.session.HoVaTen;
        delete req.session.QuyenHan;
        res.redirect("/");
    } else {
        req.session.error = "Chưa đăng nhập.";
        res.redirect("/error");
    }
});
module.exports = router;
