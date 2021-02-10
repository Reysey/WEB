
// SERVER
const express = require('express')

// APP VARIABLE FOR EXPRESS FUNCTION
const app = express()

// SERVER SETTING
const server = require('http').Server(app)

// SOCKET IO
const io = require('socket.io')(server)

// 
const { v4: uuidV4 } = require('uuid')


// SET THE VIEW ENGINE 'EJS'
app.set('view engine', 'ejs')

// set static folder
app.use(express.static('public'))

// get a request and response to create a new room...
app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(3000)