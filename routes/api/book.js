const express = require('express');
const router = express.Router();
const Book = require('../../models/book')

// Получить все книги
router.get('/', async (req, res) => {
    try {
        const books = await Book.find().select('-__v')
        res.json(books)
    } catch (e) {
        res.status(500).json(e)
    }
});

// Получить книгу по ID
router.get('/:id', async (req, res) => {
    const {id} = req.params

    try {
        const book = await Book.findById(id).select('-__v')
        if (book) {
            res.json(book)
        } else {
            res.status(404).json({status: 404, message: 'Книга не найдена'})
        }
    } catch (e) {
        res.status(500).json(e)
    }
});

// Создать книгу
router.post('/', async (req, res) => {
    const {title, description, authors, favorite, fileCover, fileName} = req.body

    const newBook = new Book({
        title, 
        description, 
        authors, 
        favorite, 
        fileCover, 
        fileName
    })

    try {
        await newBook.save()
        res.json(newBook)
    } catch (e) {
        res.status(500).json(e)
    }
});

// Редактировать книгу по ID
router.put('/:id', async (req, res) => {
    const {id} = req.params
    const {title, description, authors, favorite, fileCover, fileName} = req.body

    try {
        await Book.findByIdAndUpdate(id, {title, description, authors, favorite, fileCover, fileName})
        res.redirect(`/api/books/${id}`)
    } catch (e) {
        res.status(500).json(e)
    }
});

// Удалить книгу по ID
router.delete('/:id', async (req, res) => {
    const {id} = req.params

    try {
        await Book.deleteOne({_id: id})
        res.json({status: true, message: 'ok'})
    } catch (e) {
        res.status(500).json(e)
    }
});

module.exports = router;
