$( document ).ready(function() {
  if(window.localStorage.token){
    $('#login_form').hide()
    $('#profile_button').show()
  }
  $( "#login_button" ).bind( "click", function( event ) {
    $.post( "/sessions", {
      username : $('#username').val(),
      password : $('#password').val()
    })
    .done(function( data ) {
      console.log( "Data Loaded: " + data );
      window.localStorage.setItem('token', data.token);
      window.localStorage.setItem('username', $('#username').val());
      window.location.href = "/trips";
    })
    .fail(function(err) {
      console.log(err.responseJSON.message);
      $("#err").html(err.responseJSON.message)
    });
  });
  $( "#searchButton" ).bind( "click", function( event ) {
    window.location.href = "/trips?q="+$('#searchValue').val();
  });
});
