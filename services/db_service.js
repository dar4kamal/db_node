var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    database: "library"
});

exports.initConnect = function () {
    con.query("CREATE DATABASE IF NOT EXISTS lb_db", function (err) {
        if (err) throw err;
        console.log("lb created!");
    })
};

exports.getAllBoks = function () {
    con.query("SELECT * FROM books", function (err, res, field) {
        if (err) throw err;
        console.log(res);
        return res;
    })
};