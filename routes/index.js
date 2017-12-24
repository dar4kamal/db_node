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
  var sql = "SELECT b.book_id, b.title,b.cover,b.pages_no,b.category,b.isbn,b.edition,b.publish_year,b.description,b.avilable,a.Author_name,p.Publisher_name\n" +
      "FROM books b \n" +
      "JOIN author a \n" +
      "on (b.author_id = a.Author_id)\n" +
      "Join publisher p\n" +
      "on (b.publisher_id = p.Publisher_id);";
  con.query(sql, function (err, result, field) {
      if (err) throw err;
      console.log(result);
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
    var a_id = Math.round(Math.random() * 1000 );
    var sql = "INSERT INTO author (Author_id, Author_name, Author_address, Nationality)" +
        "VALUES (" + a_id + ", '" + req.body.Author_name + "', '" + req.body.Author_address + "', '" + req.body.Nationality + "')";
    con.query(sql, function (err, result, field) {
        if(err) throw err;
    });
    var p_id = Math.round(Math.random() * 1000 );
    sql = "INSERT INTO publisher (Publisher_id, Publisher_name, Publisher_address)" +
        "VALUES (" + p_id + ", '" + req.body.Publisher_name + "', '" + req.body.Publisher_address + "')";
    con.query(sql, function (err, result, field) {
        if(err) throw err;
    });

    var obj = req.body;
    delete obj["Publisher_name"];
    delete obj["Publisher_address"];
    delete obj["Author_address"];
    delete obj["Author_name"];
    delete obj["Nationality"];
    obj["author_id"] = a_id;
    obj["publisher_id"] = p_id;
    obj["borrower_id"] = null;

    console.log(obj);

    con.query("INSERT INTO books SET ?", obj, function (err, result, field) {
        if (err) throw err;
        res.redirect('/');
    });
});

router.get('/prog_books', function(req, res, next) {
    var sql = "SELECT b.title,b.cover,b.pages_no,b.category,b.isbn,b.edition,b.publish_year,b.description,b.avilable,a.Author_name,p.Publisher_name\n" +
        "FROM books b \n" +
        "JOIN author a \n" +
        "on (b.author_id = a.Author_id)\n" +
        "Join publisher p\n" +
        "on (b.publisher_id = p.Publisher_id) where category='programming';";
    con.query(sql, function (err, result, field) {
        if (err) throw err;
        console.log(result);
        res.render('prog_books', { title: 'Express', books: result });
    });
});

router.post('/borrow_book', function (req, res, next) {
    var mem_id = Math.round(Math.random() * 1000 );
    var dep_id = Math.round(Math.random() * 1000 );
    var sql = "INSERT INTO membership (Mem_id, Mem_type, Exp_date)" +
        "VALUES (" + mem_id + ", '" + req.body.Mem_type + "', '" + req.body.Exp_date + "')";
    con.query(sql, function (err, result, field) {
        if(err) throw err;
    });

    sql = "INSERT INTO department (Department_id, Department_name)" +
        "VALUES (" + dep_id + ", '" + req.body.Department_name + "')";
    con.query(sql, function (err, result, field) {
        if(err) throw err;
    });

    var obj = req.body;
    var book_id = req.body.book_id;
    delete obj["Mem_type"];
    delete obj["Exp_date"];
    delete obj["book_id"];
    delete obj["Department_name"];
    obj["Mem_id"] = mem_id;
    obj["Department_id"] = dep_id;

    con.query("INSERT INTO borrower SET ?", obj, function (err, result, field) {
        if (err) throw err;
        sql = "UPDATE books SET borrower_id = " + result.insertId + ", avilable = 0 WHERE book_id = " + book_id;
        console.log(sql);
        con.query(sql, function (err, result, field) {
           if(err) throw err;
            res.redirect('/');
        });
    });
});

router.get('/lit_books', function(req, res, next) {
    var sql = "SELECT b.title,b.cover,b.pages_no,b.category,b.isbn,b.edition,b.publish_year,b.description,b.avilable,a.Author_name,p.Publisher_name\n" +
        "FROM books b \n" +
        "JOIN author a \n" +
        "on (b.author_id = a.Author_id)\n" +
        "Join publisher p\n" +
        "on (b.publisher_id = p.Publisher_id) where category='literature';";
    con.query(sql, function (err, result, field) {
        if (err) throw err;
        res.render('lit_books', { title: 'Express', books: result });
    });
});

module.exports = router;
