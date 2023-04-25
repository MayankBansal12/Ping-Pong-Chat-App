
// Server side for socket.io
const io = require('socket.io')(process.env.PORT, {
    cors: {
      origin: '*',
    }
});
  
const users={};

// Connection for new socket request
io.on("connection",socket=>{
    // Whenever a new user joins
    socket.on("new-user-joined",name=>{
        users[socket.id]=name;
        // socket.broadcast.emit("user-joined",{name:name, totalUsers: users});
        io.emit("user-joined",{name:name, totalUsers: users}); 
    });
    // When a new message is send
    socket.on("send",message=>{
        socket.broadcast.emit("receive",{message: message, name: users[socket.id]});
    });
    // When a user lefts
    socket.on("disconnect",message=>{
        const name=users[socket.id]
        delete users[socket.id];
        socket.broadcast.emit("leave",{name: name, totalUsers: users});
    });
});