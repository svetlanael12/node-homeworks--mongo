const {Schema, model} = require('mongoose')

const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    authors: {
        type: String,
        default: "",
    },
    comments: {
        type: Array,
        default: [],
    }
})

module.exports = model('Book', bookSchema)
