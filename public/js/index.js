$(document).ready(function() {

    var socket = io.connect();

    $('.box').click(function() {
	//alert($(this).attr("id"));
        var selectedID = $(this).attr("id");
        socket.emit('click', selectedID);
    });

    $('#gDoor').click(function() {
        var selectedID = $(this).attr("id");
        socket.emit('gDoor', selectedID);
    });

    $('.olet').click(function() {
	var code = $(this).text();
        socket.emit('click2', code);
    });

    socket.on('gDoorToggled', function(msg) {
	alert('gDoorToggled');
	$('#msg').append('<p>' + msg + '</p>');
    });

    socket.on('changeColor', function(selectedID) {
        $("#"+selectedID).css({"background-color":"red"});
    });

    socket.on('resetColor', function() {
	$('.box').css({"background-color":"white"});
    });
});
