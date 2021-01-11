$(document).ready(function () {

  // eventEmitter.on('naruceno', function(data){
  //   console.log(data);
    
  // });


// Vidljivost dugmeta naruci

  $("#oblacic").on("click", function(){
    $("#brojPoruka").text(0)
  })
  // Izaberi sa kim se dopisujes

  $(".izaberi").on("click", function(){
   let message_id =  $(this).attr('id');
    $("#CHAT").css("display", "block");
    
   var xhttp = new XMLHttpRequest();
   xhttp.open("POST", "/admin/izaberi", true);
   xhttp.onreadystatechange = function() {
     if (this.readyState == 4 && this.status == 200) {
     ubaciUchat(JSON.parse(this.responseText)) 
       
     }
   };
   xhttp.setRequestHeader("Content-Type", "application/json")
   xhttp.send(JSON.stringify({ id : message_id}));
   
  })

  function ubaciUchat(onePerson){
   
    $(`[span_id=${onePerson._id}]`).text("");
    $(".sendBtn").attr("email",onePerson.email);
    $("#chatName").text(onePerson.name);
    let text = "";
    for(let i=0; i<onePerson.msg.length; i++){
      if(onePerson.msg[i].from === "admin"){
        text += `
        <div class="direct-chat-msg right">
     <div class="direct-chat-infos clearfix">
       <span class="direct-chat-timestamp float-left">${onePerson.msg[i].time}</span>
     </div>
     <div class="direct-chat-text">
       ${onePerson.msg[i].msg}
     </div>
   </div>
        `
      }else{
        text += `
        <div class="direct-chat-msg">
                    <div class="direct-chat-infos clearfix">
                      <span class="direct-chat-name float-left">${onePerson.name}</span>
                      <span class="direct-chat-timestamp float-right">${onePerson.msg[i].time}</span>
                    </div>
                    <!-- /.direct-chat-infos -->
                    <img class="direct-chat-img" src="../admin/dist/img/user1-128x128.jpg" alt="message user image">
                    <!-- /.direct-chat-img -->
                    <div class="direct-chat-text">
                    ${onePerson.msg[i].msg}
                    </div>
                    <!-- /.direct-chat-text -->
                  </div>
        `
      }
    }
      $("#dopisivanje").html(text)
    
  }

  // Brisanje Narudzbine

  $(".deleteBtn").on("click", function(){
    let id = $(this).attr("id");
    var xhttp = new XMLHttpRequest();
    xhttp.open("post", "/admin/delete", true);
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
       if(this.responseText === "ok"){
        location.replace("/admin");
       } 
      }
    };
    xhttp.setRequestHeader("Content-Type", "application/json")
    xhttp.send(JSON.stringify({id : id}));
    
  })

    // Modal uzimanje podataka

$(".moreInfoBtn").on("click",function(){
   let id = $(this).attr("id");
   
   var xhttp = new XMLHttpRequest();

   xhttp.open("POST", "/admin/modal", true);
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     unesiUmodal(JSON.parse(this.responseText));
      
    }
  };
  xhttp.setRequestHeader("Content-Type", "application/json")
  xhttp.send(JSON.stringify({ id : id}));
   

  function unesiUmodal(data){

    let text = "";
    for(let i = 0; i< data[0].narudzbina.brojPica; i++){
      if(data[0].narudzbina.brojPica === "1"){
        text = `
        <tr>
                <th scope="row">${i+1}</th>
                <td>${data[0].narudzbina.naziv}</td>
                <td>${data[0].narudzbina.velicina}cm</td>
                <td>${data[0].narudzbina.kolicina}</td>
                <td>${data[0].narudzbina.dodaci}</td>
  
              </tr>
        `
      }else{
        text += `
        <tr>
                <th scope="row">${i+1}</th>
                <td>${data[0].narudzbina.naziv[i]}</td>
                <td>${data[0].narudzbina.velicina[i]}cm</td>
                <td>${data[0].narudzbina.kolicina[i]}</td>
                <td>${data[0].narudzbina.dodaci[i]}</td>
  
              </tr>
        `
      }
     
    }
    $("tbody").html(text)
  }
    
})



})