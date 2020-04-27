var express = require("express");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var router = express.Router();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
const PORT = process.env.PORT || 5000;

// set the view engine to ejs
app.set("view engine", "ejs");
app.locals.pretty = true;

app.get("/", function (req, res) {
  res.render("pages/index");
});

// mongoose defined
//var uri = "mongodb://127.0.0.1:27017/booklist";
const password = "laurea_ping";
var uri =
  "mongodb+srv://laurea_ping:laurea_ping@cluster0-kggoo.mongodb.net/booklist";
//db connect
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//defined a booklist
const Booklist = mongoose.model(
  "Booklist",
  {
    bookname: String,
    author: String,
    type: String,
    picture: String,
    content: String,
  },
  "booklist"
);

// Return a list of all documents in the collection
app.get("/api/getall", function (req, res) {
  Booklist.find({}, function (err, results) {
    if (err) {
      //console.log(err);
      res.json("Järjestelmässä tapahtui virhe", 500);
    } else {
      console.log(results);
      res.render("pages/allbooklist", { taulu: results });
    }
  });
});

// Return details of the document with id
app.get("/api/get/:id", function (req, res) {
  var id = req.params.id;
  //res.send("Update the  document with id" + req.params.id);
  Booklist.findById(id, function (err, results) {
    if (err) {
      console.log(err);
    } else {
      console.log(results);
      res.render("pages/detailbook", { taulu: results });
    }
  });
});

// Create a new document in the collection
app.get("/api/add", function (req, res) {
  //res.send("Create a new document in the collection");
  res.render("pages/addbooklist");

  app.post("/api/add", function (req, res) {
    console.log(req.body);
    const newbook = req.body;
    console.log(newbook);
    Booklist.create(newbook, function (err, result) {
      if (err) console.log(err);
      console.log("Tallennettu: " + result);
      //res.send("Add the book to the lukudiplomilist" + result);
      //res.render("pages/allbooklist");
    });
  });
  res.render("pages/allbooklist");
});

// Update the docment with id
app.put("/api/update/:id", function (req, res) {
  //res.send("Muokataan leffaa id:llä: " + req.params.id);
  var id = req.params.id;
  //show the book info to update
  Booklist.findById(id, function (err, results) {
    if (err) {
      console.log(err);
    } else {
      console.log(results);
      //redirct to the updatepage
      res.render("pages/updatebooklist", { taulu: results });

      //handle the update info
      app.post("/api/update", function (req, res) {
        console.log(req.body);
        const updatebook = req.body;
        console.log(updatebook);
        Booklist.findOneAndUpdate(id, updatebook, { new: true }, function (
          err,
          result
        ) {
          if (err) console.log(err);
          console.log("Update the book: " + result);
          res.send("Update the book to the lukudiplomilist" + result);
        });
      });
    }
  });
});

// Delete the  document with id
app.delete("/api/delete/:id", function (req, res) {
  var id = req.params.id;
  Booklist.findByIdAndDelete(id, function (err, results) {
    // Tietokantavirheen käsittely
    if (err) {
      console.log(err);
      res.json("Järjestelmässä tapahtui virhe.", 500);
    } // Tietokanta ok, mutta poistettavaa ei löydy. Onko kyseessä virhe vai ei on semantiikkaa
    else if (results == null) {
      res.json("Poistetavaa ei löytynyt.", 200);
    } // Viimeisenä tilanne jossa kaikki ok
    else {
      console.log(results);
      res.json("Deleted " + id + " " + results.title, 200);
    }
  });
  //res.send("Delete the  document with id" + req.params.id);
});

//app.listen(8081);
app.listen(PORT);
