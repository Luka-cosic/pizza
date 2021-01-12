$(function () {
    var socket = io();
 $("#chatForm").submit(function (e) {
   e.preventDefault();
   socket.emit("admin", { msg : $('#m').val(), email : $(".sendBtn").attr("email"), time : new Date().getHours()+"h : "+new Date().getMinutes()+"min" });
   $("#m").val("");
   return false;
 });

 socket.on('admin', function (msg) {
   $('#dopisivanje').append(`
   <div class="direct-chat-msg right">
   <div class="direct-chat-infos clearfix">
     <span class="direct-chat-timestamp float-left">${msg.time}</span>
   </div>
   <div class="direct-chat-text">
     ${msg.msg}
   </div>
 </div>
 `);
 });

 socket.on('client message', function (msg) {
   $("#brojPoruka").text(parseInt($("#brojPoruka").text()) + 1)
   if(msg.email === $(".sendBtn").attr('email')){
    $('#dopisivanje').append(`
    <div class="direct-chat-msg">
                  <div class="direct-chat-infos clearfix">
                    <span class="direct-chat-name float-left">${$("#chatName").text()}</span>
                    <span class="direct-chat-timestamp float-right">${msg.time}</span>
                  </div>
                  <!-- /.direct-chat-infos -->
                  <img class="direct-chat-img" src="../admin/dist/img/user1-128x128.jpg" alt="message user image">
                  <!-- /.direct-chat-img -->
                    ${msg.msg}
                  </div>
                  <!-- /.direct-chat-text -->
                </div>
  `);
   } 
  });

  socket.on("neprocitane poruke",function(msgUsers){
   let filtered =  $(`[span_id=${msgUsers._id}]`);
      filtered.text(0);
      for(let i=0; i<msgUsers.msg.length; i++){
      if(msgUsers.msg[i].from == "client" && msgUsers.msg[i].read == "neprocitano"){
        filtered.text(parseInt(filtered.text()) + 1);  
      } 
    }  
  })
});

