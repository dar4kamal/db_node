var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    database: "library"
});

/* GET home page. */
router.get('/', function(req, res, next) {
  con.query("SELECT * FROM books", function (err, result, field) {
      if (err) throw err;
      res.render('index', { title: 'Express', books: result });
  });
});

router.get('/admin_panel', function(req, res, next) {
    con.query("SELECT * FROM books", function (err, result, field) {
        if (err) throw err;
        res.render('admin_panel', { title: 'Express', books: result });
    });
});

router.get('/add_book', function (req, res, next) {
   res.render("addbook", { title: 'Express'});
});

router.post('/add_book', function (req, res, next) {
    con.query("INSERT INTO books SET ?", req.body, function (err, result, field) {
        if (err) throw err;
        res.render("addbook", { title: 'Express', bookAdded: true});
    });
});

router.get('/prog_books', function(req, res, next) {
    con.query("SELECT * FROM books WHERE category='programming'", function (err, result, field) {
        if (err) throw err;
        res.render('prog_books', { title: 'Express', books: result });
    });
});

router.get('/lit_books', function(req, res, next) {
    con.query("SELECT * FROM books WHERE category='literature'", function (err, result, field) {
        if (err) throw err;
        res.render('lit_books', { title: 'Express', books: result });
    });
});

module.exports = router;
