const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')

/**
 * socket.io
 */

const socketio = require('socket.io')
const http = require('http')

const routes = require('./routes')
const app = express()

const server = http.Server(app)
const io = socketio(server)

const connectedUser = {}

mongoose.connect('mongodb+srv://omnistack:omnistack@omnistack-cjueh.mongodb.net/semana09?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

io.on('connection', socket =>{
    const { user_id } = socket.handshake.query
    connectedUser[user_id] = socket.id
    
})

app.use((req, res, next) => {
    req.io = io
    req.connectedUser = connectedUser    

    return next()
})

// GET, POST, PUT, DELETE

// req.query = Acessar query params (para filtros)
// req.params = Acessar oute params (para edição. delete)
// req.body = Acessar corpo da requisição (para criação, edicao )

// Senha banco omnistack

app.use(cors())
app.use(express.json())
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')))
app.use(routes)
server.listen(3333)