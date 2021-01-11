$(function () {

  // Ubacivanje svih poruka u cet

  $('.chatIcon').on('click', function(){
    let email = $(this).attr('email');
    
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/chatIcon", true);
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     ubaciUchat(JSON.parse(this.responseText)) 
      
    }
  };
  xhttp.setRequestHeader("Content-Type", "application/json")
  xhttp.send(JSON.stringify({ email : email}));
    
  })

  function ubaciUchat(onePerson){
 
    let text = "";
    for(let i=0; i<onePerson.msg.length; i++){
     
      if(onePerson.msg[i].from == "admin"){
        text += `
        <div class="row">
                            <div class="col-lg-12">
                              <div class="media">
                                <div class="media-body">
                                  <h4 class="media-heading">Picerija
                                    <span class="small pull-right">${onePerson.msg[i].time}</span>
                                  </h4>
                                  <div id="porukaZaposleni">
                                    <p>${onePerson.msg[i].msg}</p>

                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <hr>
        `
      }else{
        text += `
        <div class="row">
        <div class="col-lg-12">
            <div class="media">
                <div class="media-body" >
                    <div id="poruka">
                        <p>${onePerson.msg[i].msg}</p>
                    </div>
                    <span class="small pull-right">${onePerson.msg[i].time}</span>
                </div>
            </div> 
        </div>
    </div>
    <hr>
        `
      }
    }
   
    
    $("#dopisivanje").html(text)
  }


  // Socket

    var socket = io();
    $("#chatForm").submit(function (e) {
      e.preventDefault();
      socket.emit("client message", { msg : $('#m').val(), email : $("#sendBtn").attr("email")});
      $("#m").val("");
      return false;
    });
    socket.on('client message', function (msg) {
      $('#dopisivanje').append(`
    <div class="row">
        <div class="col-lg-12">
            <div class="media">
                <div class="media-body" >
                    <div id="poruka">
                        <p>${msg.msg}</p>
                    </div>
                    <span class="small pull-right">${msg.time}</span>
                </div>
            </div> 
        </div>
    </div>
    <hr>
    `);
    });

    socket.on('admin',function(msg){
      if(msg.email === $("#sendBtn").attr("email")){
        $('#dopisivanje').append(`
      <div class="row">
                            <div class="col-lg-12">
                              <div class="media">
                                <div class="media-body">
                                  <h4 class="media-heading">Picerija
                                    <span class="small pull-right">${msg.time}</span>
                                  </h4>
                                  <div id="porukaZaposleni">
                                    <p>${msg.msg}</p>

                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <hr>
      `)
      }
    })
  })