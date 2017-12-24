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
      res.render('index', { title: 'DB Project | Library', books: result });
  });
});

router.get('/add_book', function (req, res, next) {
   res.render("addbook", { title: 'Add book'});
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
        res.render('prog_books', { title: 'Proramming books', books: result });
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

router.get('/search/:word', function (req, res) {
    var word = req.params.word;
    word = word.toLowerCase();
    var sql = "SELECT b.book_id, b.title,b.cover,b.pages_no,b.category,b.isbn,b.edition,b.publish_year,b.description,b.avilable,a.Author_name,p.Publisher_name\n" +
        "FROM books b \n" +
        "JOIN author a \n" +
        "on (b.author_id = a.Author_id)\n" +
        "Join publisher p\n" +
        "on (b.publisher_id = p.Publisher_id) WHERE LCASE(b.title) LIKE '%" + word + "%'";
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.render('index', { title: 'Search', books: result });
    })
});

router.post('/search', function (req, res, next) {
   var word  = req.body.word;
   res.redirect('/search/' + word);
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
        res.render('lit_books', { title: 'Literature books', books: result });
    });
});

router.get('/admin_panel', function(req, res, next) {
    var sql = "SELECT b.book_id, b.title,b.cover,b.pages_no,b.category,b.isbn,b.edition,b.publish_year,b.description,b.avilable,a.Author_name,p.Publisher_name\n" +
        "FROM books b \n" +
        "JOIN author a \n" +
        "on (b.author_id = a.Author_id)\n" +
        "Join publisher p\n" +
        "on (b.publisher_id = p.Publisher_id);";
    con.query(sql, function (err, result, field) {
        if (err) throw err;
        res.render('admin_panel', { title: 'Admin Panel', books: result });
    });
});

router.get('/admin_panel/:m', function (req, res) {
    var m = req.params.m;
    var sql = "";
    if (m === "authors") {
        sql = "SELECT * FROM author";
        con.query(sql, function (err, result) {
            if (err) throw err;
            res.render('admin_panel_authors', { title: 'Authors', authors: result });
        })
    }
    else if (m === "publishers") {
        sql = "SELECT * FROM publisher";
        con.query(sql, function (err, result) {
            if (err) throw err;
            res.render('admin_panel_publishers', { title: 'Publishers', publishers: result });
        })
    }
    else if (m === "borrowers") {
        sql = "select * from borrower join department on borrower.Department_id = department.Department_id\n" +
            "join membership on membership.Mem_id = borrower.Mem_id";
        con.query(sql, function (err, result) {
            res.render('admin_panel_borrowers', { title: 'Borrowers', borrowers: result });
        });
    }
});

router.get('/delete/:book_id', function (req, res) {
   var id = req.params.book_id;
   var sql = "DELETE FROM books WHERE book_id = " + id;
   con.query(sql, function (err, result) {
       if (err) throw err;
       res.redirect('/admin_panel');
   });
});

router.post('/edit/:m', function (req, res) {
    var m = req.params.m;
    var info = req.body;
    var sql = "";
    if (m === "book") {
        var id = info.book_id;
        sql = "update books join author on books.author_id = author.Author_id\n" +
            "join publisher on books.publisher_id = publisher.Publisher_id\n" +
            "set ? where book_id = " + id;
        con.query(sql, info, function (err, result) {
            if (err) throw err;
            res.redirect('/admin_panel');
        })
    }
    else if (m === "author") {
        var a_id = info.Author_id;
        sql = "update author set ? where Author_id = " + a_id;
        con.query(sql, info, function (err, result) {
            if (err) throw err;
            res.redirect('/admin_panel/authors');
        })
    }
    else if (m === "publisher") {
        var p_id = info.Publisher_id;
        sql = "update publisher set ? where Publisher_id = " + p_id;
        con.query(sql, info, function (err, result) {
            if (err) throw err;
            res.redirect('/admin_panel/publishers');
        })
    }
});

module.exports = router;
