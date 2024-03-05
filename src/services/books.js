import axios from "axios";

const URL_GET_BOOKS = "http://localhost:8080/api/books";
const URL_GET_BOOK = "http://localhost:8080/api/books/";
const URL_GET_BOOKS_BY_AUTHOR = "http://localhost:8080/api/books/author";
const URL_GET_BOOKS_BY_RELEASE_DATE = "http://localhost:8080/api/books/release-date";
const URL_GET_BOOKS_BY_IMAGE = "http://localhost:8080/api/books/image";
const URL_POST_BOOK = "http://localhost:8080/api/books";
const URL_PUT_BOOK = "http://localhost:8080/api/books/";
const URL_DELETE_BOOK = "http://localhost:8080/api/books/";


export const getBooks = async () => {
  const response = await axios.get(URL_GET_BOOKS);
  console.log(response.data);
  return response.data;
};

export const getBooksByAuthor = async () => {
  const response = await axios.get(URL_GET_BOOKS_BY_AUTHOR);
  console.log(response.data);
  return response.data;
};

export const getBooksByReleaseDate = async () => {
  const response = await axios.get(URL_GET_BOOKS_BY_RELEASE_DATE);
  console.log(response.data);
  return response.data;
};

export const getBooksByImage = async () => {
  const response = await axios.get(URL_GET_BOOKS_BY_IMAGE);
  console.log(response.data);
  return response.data;
};

export const getBook = async (id) => {
  const response = await axios.get(URL_GET_BOOK + id);
  return response.data;
};

export const postBook = async (book) => {
  const response = await axios.post(URL_POST_BOOK, book);
  return response.data;
};

export const putBook = async (id, book) => {
  const response = await axios.put(URL_PUT_BOOK + id, book);
  return response.data;
};

export const deleteBook = async (id) => {
  const response = await axios.delete(URL_DELETE_BOOK + id);
  return response.data;
};

export default {
  getBooks,
  getBook,
  postBook,
  putBook,
  deleteBook
};