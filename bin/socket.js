var i = 0;
module.exports = function(io) {
  io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('chat message', function(data){
      if(!data.username){
        var username = 'anon' + (++i)
        data.username = username
        socket.emit('username init', {
          username: username
        })
      }
      io.emit('chat message', data);
    });
  });
}
