const {
  addBooksEnvoy,
  getAllBooksEnvoy,
  getBooksByIdEnvoy,
  editBooksByIdEnvoy,
  deleteBooksByIdEnvoy,
} = require('./envoy.js');
const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBooksEnvoy,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksEnvoy,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBooksByIdEnvoy,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBooksByIdEnvoy,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBooksByIdEnvoy,
  },
];
module.exports = routes;
