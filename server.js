const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Book = require('./books')
const cors = require('cors')

app.use(cors())

mongoose.connect('mongodb://localhost/livros')

app.get('/books', paginatedResults(Book), (req, res) => {
    res.json(res.paginatedResults)
})

function paginatedResults(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const results = {}

        if(endIndex < await model.countDocuments().exec()){
            results.next = {
                page: page + 1,
                limit: limit
            }
        }
        
        if(startIndex > 0){
            results.previus = {
                page: page - 1,
                limit: limit
            }
        }

        results.total = {
            pages: Math.ceil(await model.countDocuments().exec() / limit),
            books: await model.countDocuments().exec()
        }

        let first = 0
        let last = 0
        if(page != Math.ceil(await model.countDocuments().exec() / limit)){
            first = (page-1) * 10 + 1
            last = (page-1) * 10 + 10
        } else {
            first = (page-1) * 10 + 1
            last = await model.countDocuments().exec()
        }
        results.showing = {
            first: first,
            last: last
        }

        try{
            results.results = await model.find().limit(limit).skip(startIndex).exec()
            res.paginatedResults = results
            next()
        } catch (e) {
            res.status(500).json({ message: e.message })
        }   
    }
}


app.listen(3000)