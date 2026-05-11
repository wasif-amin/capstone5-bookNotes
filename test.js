import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
const isbn = 9780394800165;
const response = await axios.get(
  `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
);
const bookData = response.data[`ISBN:${isbn}`];
console.log(bookData.cover.large);
