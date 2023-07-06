const express = require('express');
const router = express.Router();
const Book = require('../../models/book')

// Получить все книги
router.get('/books', async (req, res) => {
    try {
        const books = await Book.find().select('-__v')
        res.render("book/index", {
            title: "Library",
            books: books,
        });
    } catch (e) {
        res.status(500).json(e)
    }
});

// Получить книгу по ID
router.get('/books/:id', async (req, res) => {
    const { id } = req.params

    try {
        const book = await Book.findById(id).select('-__v')
        if (book) {
            res.render("book/view", {
                title: "Book | view",
                book: book,
            });
        } else {
            res.redirect('/404');
        }
    } catch (e) {
        res.status(500).json(e)
    }
});

// Создать книгу
router.get('/create', (req, res) => {
    res.render("book/create", {
        title: "Book | create",
        book: {},
    });
});
router.post('/create', async (req, res) => {
    const { title, description, authors } = req.body

    const newBook = new Book({
        title,
        description,
        authors,
    })
    try {
        await newBook.save()
        return res.json({ status: 'success', message: newBook })
    } catch (e) {
        res.status(500).json(e)
    }
});

// Редактировать книгу по ID
router.get('/update/:id', async (req, res) => {
    const { id } = req.params
    const book = await Book.findById(id).select('-__v')
    if (book) {
        res.render("book/update", {
            title: "Book | update",
            book: book,
        });
    } else {
        res.redirect('/404');
    }
});
router.post('/update/:id', async (req, res) => {
    const { id } = req.params
    const { title, description, authors } = req.body
    try {
        let result = await Book.findByIdAndUpdate(id, { title, description, authors })
        return res.json({ status: 'success', message: result })
    } catch (e) {
        res.status(500).json(e)
    }
});

// Удалить книгу по ID
router.get('/delete/:id', async (req, res) => {
    const { id } = req.params

    try {
        await Book.deleteOne({ _id: id })
        const books = await Book.find().select('-__v')
        res.render("book/index", {
            title: "Library",
            books: books,
        });
    } catch (e) {
        res.status(500).json(e)
    }
});

// сохранить комментарии
router.post('/comment/:id', async (req, res) => {
    try {
        const { id } = req.params
        const comment = req.body
        let result = await Book.findByIdAndUpdate(
            id,
            { $push: { "comments": comment } },
            { upsert: true, new: true })
        return res.json({ status: 'success', message: result })
    } catch (e) {
        res.status(500).json(e)
    }
});

module.exports = router;
