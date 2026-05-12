import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "booknotes",
  password: "21070212w",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
async function bookCover(isbn) {
  try {
    const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`;
    const response = await axios.get(url);
    const bookData = response.data[`ISBN:${isbn}`];
    const coverUrl = bookData.cover ? bookData.cover.large : null;
    if (bookData && bookData.cover) {
      return coverUrl;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to make request:", error.message);
    return null;
  }
}
app.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM books ORDER BY id ASC ");
  const entries = result.rows;
  res.render("index.ejs", { entries: entries });
});
app.get("/compose", (req, res) => {
  res.render("compose.ejs");
});
app.post("/new", async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const rating = req.body.rating;
  const isbn = req.body.isbn;
  try {
    await db.query("INSERT INTO books (title, description, rating, isbn) VALUES ($1, $2, $3, $4)",[title, description, rating, isbn]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.redirect("/");

  
  }
});
app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM books WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
