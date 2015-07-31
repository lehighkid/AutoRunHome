$(document).ready(function() {

    var rfdevs = $('.rfdev').bootstrapSwitch();

    var socket = io.connect();

    $('#gDoor').click(function() {
      var selectedID = $(this).attr("id");
      socket.emit('gDoor', selectedID);
    });

  rfdevs.on('switchChange.bootstrapSwitch', function(event, state) {
    var device = {};
    device.id = this.getAttribute("id");
    device.codes = this.getAttribute("data-codes").split(",");
    device.state = this.getAttribute("data-state");
    var json = JSON.stringify(device);
    socket.emit('sendrfcode', json);

  });

    socket.on('gDoorToggled', function(msg) {
	    //alert('gDoorToggled');
	    $('#msg').append('<p>' + msg + '</p>');
    });

    socket.on('stateUpdated', function(data){
      var resp = JSON.parse(data);
      var id = resp.id;
      var state = resp.state;
      var rfdev = $("#"+id);
      if(rfdev.bootstrapSwitch("state")!=state){
        rfdev.bootstrapSwitch('state', state, true);
      }
      rfdev.attr("data-state", state);
      var rfdevts = rfdev.parent().parent().next("div").find("em");
      rfdevts.text(resp.statechanged);
    });
});
