$(function () {
   
    $("#chatForm").submit(function (e) {
        console.log('Radi');
        
      e.preventDefault();
      socket.emit("chat message",   $('#m').val() );
    //   socket.emit("chat message", { msg : $('#m').val(), id : $("#sendBtn").attr("user_id") });
      $("#m").val("");
      return false;
    });
    socket.on('chat message', function (msg) {
      $('#dopisivanje').append(`
      <div class="direct-chat-msg right">
      <div class="direct-chat-infos clearfix">
        <span class="direct-chat-name float-right">Sarah Bullock</span>
        <span class="direct-chat-timestamp float-left">23 Jan 6:10 pm</span>
      </div>
      <img class="direct-chat-img" src="../admin/dist/img/user3-128x128.jpg" alt="message user image">
      <div class="direct-chat-text">
        I would love to.
      </div>
    </div>
    `);
    });
  })