const {
    createBook,
    getAllBooks,
    getBookbyID,
    editBookbyID,
    deleteBook
} = require('./handler');

const routes = [{
        method: 'POST',
        path: '/books',
        handler: createBook,
    }, {
        method: 'GET',
        path: '/books',
        handler: getAllBooks,
    },
    {
        method: 'GET',
        path: '/books/{bookID}',
        handler: getBookbyID
    },
    {
        method: 'PUT',
        path: '/books/{bookID}',
        handler: editBookbyID
    },
    {
        method: 'DELETE',
        path: '/books/{bookID}',
        handler: deleteBook
    }
]

module.exports = routes