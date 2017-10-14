$( document ).ready(function() {
  if(window.localStorage.token){
    $('#login_form').hide()
    $('#askToConnect').hide()
    $('#edit_profile_button').show()
    $('#profile_button').show()
    $('#disconnect').show()
  }
  $( "#login_button" ).bind( "click", function( event ) {
    $.post( "/sessions", {
      username : $('#username').val(),
      password : $('#password').val()
    })
    .done(function( data ) {
      window.localStorage.setItem('token', data.token);
      window.localStorage.setItem('username', $('#username').val());
      window.location.href = "/trips";
    })
    .fail(function(err) {
      $("#err").html(err.responseJSON.message)
    });
  });
  $( "#searchButton" ).bind( "click", function( event ) {
    window.location.href = "/trips?q="+$('#searchValue').val();
  });
  $( "#mailButton" ).bind( "click", function( event ) {
    $.post( "/mail", {
      mail: $('#mailValue').val()
    })
    .done(function( data ) {

    })
    .fail(function(err) {
    });
  });
  $( "#disconnect" ).click(function( event ) {
    event.preventDefault();
    window.localStorage.clear();
    window.location.reload();
  });
});
