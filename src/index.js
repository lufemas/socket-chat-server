
const PORT = process.env.PORT || 3000
const app = require('express')()
const httpServer = require('http').createServer(app)
const io = require('socket.io')(httpServer, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    },
})



const loggedUsers = []
const messagesLog = []

// SERVER.JS SERVER-NODE
io.on('connection', function (socket) {

    socket.on('subscribeToTimer', (interval) => {
        console.log('client is subscribing to timer with interval ', interval);
        setInterval(() => {
            socket.emit('timer', new Date());
        }, interval);
    });

    socket.broadcast.emit('test', 'testdata');

    socket.on('login', (data) => {

        loggedUsers.push({
            id: data.id,
            username: data.username
        })

        console.table(loggedUsers)

        io.to(data.id).emit('messageHistory', messagesLog)
        io.to(data.id).emit('loggedUsers', loggedUsers)
        socket.broadcast.emit('newuser', data)
    })

    socket.on('message', (data) => {

        console.log(data)
        console.log(socket)


        // Transmit a message to everyone except the sender
        //    socket.broadcast.emit('newuser', data)
        messagesLog.push(data)
        console.log(messagesLog)
        // The same message, sent to all users - try it!
        socket.broadcast.emit('message', data)
    })

    socket.on('typing', (userID) => {

        socket.broadcast.emit('typing', userID)
    })

    socket.on('notTyping', (userID) => {

        socket.broadcast.emit('notTyping', userID)
    })
})


httpServer.listen(PORT, function () {
    console.log('listening on port ' + PORT)
})



