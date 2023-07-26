// Node server => handle socket.io connections
const dotenv = require('dotenv').config();
const io = require('socket.io')({
  cors: {
    origin: '*',
    method: '*'
  }
});

// io.on => listen for new client
// socket.on => listen to events of connected clients
// socket.on => declaration of business logic
// socket.emit => call of the method

const users = {};
console.log('server running on ', process.env.PORT);

io.on('connection', (socket) => {
  socket.on('new-user-joined', name => {
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

  socket.on('send', message => {
    socket.broadcast.emit('recieve', { message, name: users[socket.id] });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
  });
});

io.listen(process.env.PORT);