const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()
const errorMiddleware = require('./middleware/error');
const bookApiRouter = require('./routes/api/book');

const app = express();
app.use(express.json())

app.use('/api/books', bookApiRouter);

app.use(errorMiddleware);

async function start(PORT, UrlDB) {
    try {
        await mongoose.connect(UrlDB);
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

const UrlDB = process.env.UrlDB
const PORT = process.env.PORT || 3000;
start(PORT, UrlDB);
