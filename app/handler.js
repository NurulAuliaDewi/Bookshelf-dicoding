const {
    nanoid
} = require('nanoid');
const Joi = require('joi');
const books = require('./bookself');

const validateBookData = (payload) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        year: Joi.number().integer().min(1).required(),
        author: Joi.string().required(),
        summary: Joi.string().required(),
        publisher: Joi.string().required(),
        pageCount: Joi.number().integer().min(1).required(),
        readPage: Joi.number().integer().min(0).max(Joi.ref('pageCount')).required(),
        reading: Joi.boolean().required(),
    });

    return schema.validate(payload);
};

//menyimpan buku
const createBook = (request, h) => {
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

    const {
        error
    } = validateBookData(request.payload);

    if (error) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi data buku dengan benar.',
        }).code(400);
    }

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();

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
        updatedAt: insertedAt,
    };

    books.push(newBook);

    return h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            bookId: id,
        },
    }).code(201);
};

//menampilkan semua buku
const getAllBooks = (request, h) => {
    return h.response({
        status: 'success',
        data: {
            books: books.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    }).code(200);
};

//menampilkan detail buku berdasarkan ID buku
const getBookbyID = (req, h) => {
    const {
        bookId
    } = req.params;
    books.filter((b) => b.id == bookId);

    // console.log(books)


    if (!books) {
        return h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        }).code(404);
    }

    return h.response({
        status: 'success',
        data: {
            books,
        },
    }).code(200);
};

//mengubah data buku
const editBookbyID = (req, h) => {
    const {
        bookId
    } = req.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = req.payload;
    // Validasi data
    const schema = Joi.object({
        name: Joi.string().required(),
        year: Joi.number().integer().min(1).required(),
        author: Joi.string().required(),
        summary: Joi.string().required(),
        publisher: Joi.string().required(),
        pageCount: Joi.number().integer().min(1).required(),
        readPage: Joi.number().integer().min(0).max(Joi.ref('pageCount')).required(),
        reading: Joi.boolean().required(),
    });

    const {
        error
    } = schema.validate(req.payload);

    if (error) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi data buku dengan benar.',
        }).code(400);
    }

    const bookIndex = books.filter((b) => b.id === bookId);

    if (bookIndex === -1) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. ID tidak ditemukan.',
        }).code(404);
    }

    const updatedAt = new Date().toISOString();
    const finished = pageCount === readPage;

    books[bookIndex] = {
        ...books[bookIndex],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
        finished,
    };

    return h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    }).code(200);
}

const deleteBook = (req, h) => {
    const {
        bookId
    } = req.params;
    const bookIndex = books.filter((b) => b.id === bookId);

    if (bookIndex === -1) {
        return h.response({
            status: 'fail',
            message: 'Gagal menghapus buku. ID tidak ditemukan.',
        }).code(404);
    }

    books.splice(bookIndex, 1);

    return h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
    }).code(200);
}

module.exports = {
    createBook,
    getAllBooks,
    getBookbyID,
    editBookbyID,
    deleteBook
};