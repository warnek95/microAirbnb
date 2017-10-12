$(function () {
  var socket = io();
  $( "#tchat_button" ).bind( "click", function( event ) {
    socket.emit('chat message', {
      msg: $('#m').val(),
      username: window.localStorage ? window.localStorage.username : null
    });
    $('#m').val('');
    return false;
  });

  socket.on('username init', function(data){
    window.localStorage.setItem('username', data.username);
  });

  socket.on('chat message', function(data){
    $('#messages').append($('<li>').text(data.username + ' : ' + data.msg));
  });
});
