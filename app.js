const express = require('express');
const path = require('path');
const formatMessage  =  require('./utilis/messages');
const {
  userJoin , 
  getCurrentUser, 
  userLeft,
  getRoomUsers
} = require('./utilis/user');


const app = express();

//Set up port and socket.io server 
const port = process.env.PORT || 3000;
const server = app.listen( port, () => 
  console.log(`Listening on port ${port}...`)
);

// Set static folder 
app.use(express.static(path.join(__dirname, 'public')));

const io = require('socket.io')(server);

// Connect io 
io. on('connection', onConnected);

function onConnected(socket) {
  console.log('New socket connection...' , socket.id);

  // User joins a room
  socket.on('joinRoom' , ({username, room}) => {
    const user = userJoin(socket.id, username, room);
  
    socket.join(user.room);

    // welcome current user 
    socket.emit('message', formatMessage('Admin message','Welcome to Devpod😎'));

    // Send users and room info;
    io.to(user.room).emit('roomUsers' , {
      room: user.room,
      users: getRoomUsers(user.room)
    });

    // Broadcast when a user connects
    socket.broadcast
    .to(user.room)
    .emit('message', formatMessage('Admin message', `${user.username} has joined the chat...`));

  });

  // Listen for chat messages
  socket.on('chatMessage' , (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room)
    .emit('message' ,   formatMessage(user.username,msg));
  });

  // Broadcast when a user disconnects
  socket.on('disconnect' , () => {
    const user = userLeft(socket.id);

    if (user) {
      io.to(user.room)
      .emit('message',  formatMessage('Admin message', ` ${user.username} has left the chat...`));
    }

  });


}  
// const io = require('socket.io')(server);