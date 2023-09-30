const books = require('./books');

const addBookHandler = (request, h) => {
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
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);

  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);

  }

  const id = Date.now().toString();
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);
  const isSuccess = books.find((book) => book.id === id);
  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    }).code(201);
  }

  return h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  }).code(500);
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  
  let booksWithFilter = books;
      
      if(name){
          booksWithFilter = booksWithFilter.filter((book) => 
            book.name.toLowerCase().includes(name.toLowerCase()) !==false);
      }

      if(reading){
          booksWithFilter = booksWithFilter.filter((book) => 
            book.reading == Number(reading));    
      }

      if(finished){
          booksWithFilter = booksWithFilter.filter((book) => 
            book.finished == Number(finished));    
      }

      return h.response({
        status: 'success',
        data: {
          books: booksWithFilter.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      });
};

const getDetailBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = books.find((book) => book.id === id);

  if(book){
      return h.response({
          status: 'success',
          data: {
              book
          }
      });
  }

  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  }).code(404);
}

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const { 
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading 
  } = request.payload;

  if(!name){
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);    
  }
  
  if(readPage > pageCount){
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const indexbuku = books.findIndex((book) => book.id === id);

  if (indexbuku === -1) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan', //text sesuaikan dengan kriteria
    }).code(404);
  }

  const updatedAt = new Date().toISOString();

  books[indexbuku] = {
    ...books[indexbuku],
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

  return h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  })
};

const deleteBookByIdHandler = (request, h) => {
  const { id } =  request.params;

  const index = books.findIndex((book) => book.id === id);
  if(index !== -1){
      books.splice(index, 1);

      return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
}

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getDetailBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};