import axios from "axios";

const URL_GET_BOOKS = "http://localhost:8080/api/books";
const URL_GET_BOOK = "http://localhost:8080/api/movies/";
const URL_POST_BOOK = "http://localhost:8080/api/movies";
const URL_PUT_BOOK = "http://localhost:8080/api/movies/";
const URL_DELETE_BOOK = "http://localhost:8080/api/movies/";


export const getBooks = async () => {
  const response = await axios.get(URL_GET_BOOKS);
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
