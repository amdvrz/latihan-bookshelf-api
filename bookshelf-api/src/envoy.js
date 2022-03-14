/* eslint-disable max-len */
const {nanoid} = require('nanoid');
const books = require('./books');

/* Tambah Buku*/
const addBooksEnvoy = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBuku = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    insertedAt,
    updatedAt,
  };

  /* push buku ke array*/
  books.push(newBuku);

  /* cek newBuku sudah push*/
  const isBerhasil = books.filter((buku) => buku.id === id).length > 0;

  if (isBerhasil) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    response.header('Access-Control-Allow-Origin', '*');
    return response;
  }
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

/* Get All Books*/
const getAllBooksEnvoy = (request, h) => {
  const {name, reading, finished} = request.query;

  if (!name && !reading && !finished) {
    const response = h.response({
      status: 'success',
      data: {
        books: books.map((buku) => ({
          id: buku.id,
          name: buku.name,
          publisher: buku.publisher,
        })),
      },
    })
        .code(200);
    return response;
  }

  if (name) {
    const filterBooksName = books.filter((buku) => {
      const nameRgx = new RegExp(name, 'ig');
      return nameRgx.test(buku.name);
    });

    const response = h.response({
      status: 'success',
      data: {
        books: filterBooksName.map((buku) => ({
          id: buku.id,
          name: buku.name,
          publisher: buku.publisher,
        })),
      },
    })
        .code(200);

    return response;
  }

  if (reading) {
    const filterBooksReading = books.filter(
        (buku) => Number(buku.reading) === Number(reading),
    );
    const response = h.response({
      status: 'success',
      data: {
        books: filterBooksReading.map((buku) => ({
          id: buku.id,
          name: buku.name,
          publisher: buku.publisher,
        })),
      },
    })
        .code(200);
    return response;
  }

  const filterBooksFinished = books.filter(
      (buku) => Number(buku.finished) === Number(finished),
  );

  const response = h.response({
    status: 'success',
    data: {
      books: filterBooksFinished.map((buku) => ({
        id: buku.id,
        name: buku.name,
        publisher: buku.publisher,
      })),
    },
  })
      .code(200);

  return response;
};

/* Get Buku dari Id*/
const getBooksByIdEnvoy = (request, h) => {
  const {bookId} = request.params;
  const buku = books.filter((c) => c.id === bookId)[0];

  if (buku !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book: buku,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

/* Edit Buku*/
const editBooksByIdEnvoy = (request, h) => {
  const {bookId} = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((buku) => buku.id === bookId);

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

/* Hapus Buku*/
const deleteBooksByIdEnvoy = (request, h) => {
  const {bookId} = request.params;

  const index = books.findIndex((buku) => buku.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBooksEnvoy,
  getAllBooksEnvoy,
  getBooksByIdEnvoy,
  editBooksByIdEnvoy,
  deleteBooksByIdEnvoy,
};
