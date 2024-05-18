const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    autor: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true
    },
    paginas: {
        type: Number,
        required: true
    },
    ano: {
        type: Number,
        required: true
    },
    valor: {
        type: Number,
        required: true
    },
}, { collection: 'livro' })

module.exports = mongoose.model('Book', userSchema)