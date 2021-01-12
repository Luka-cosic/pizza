$(document).ready(function () {

  // SEARCH

  $("#searchField").on("keyup",()=>{
   let searchField = document.getElementById("searchField");
   let filter = searchField.value.toUpperCase();
   let ul = document.getElementById("myUl");
   li = ul.getElementsByTagName("li");
   let txtValue;
    for(let i=0; i < li.length; i++){
     let a =  li[i].getElementsByTagName("h4")[0];
     txtValue = a.textContent || a.innerText;
     if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
  } else {
      li[i].style.display = "none";
  }
    }
  });



//  Message

$(".chatIcon").on("click", function(){
  $(this).css('display',"none")
  $('#messageChat').css({'display':'block'});
 
})
$("#closeMess").on("click", function(){
  $(".chatIcon").css('display',"block")
  $('#messageChat').css('display','none')
})

  // on naruci btn

  $('#naruciBtn').on('click', function(){

      $("#ukCena").val($("#ukupnaCena").text());
      let narucenePice = $(".narucenaPica");
      $("#brojPica").val(narucenePice.length);
      let text = "";
      for(let i = 0; i< narucenePice.length; i++){
        
        text += `
                <input class="form-control mr-sm-2 col-10" style="display: none"   name="naziv" type="text" value="${narucenePice[i].children[0].innerText}" >
                <input class="form-control mr-sm-2 col-10 " style="display: none"   name="velicina" type="text" value="${parseInt(narucenePice[i].children[1].children[0].innerText)}" >
                <input class="form-control mr-sm-2 col-10 " style="display: none"   name="kolicina" type="text" value="${parseInt(narucenePice[i].children[1].children[1].innerText)}" >
                <input class="form-control mr-sm-2 col-10 " style="display: none"   name="dodaci" type="text" value="${narucenePice[i].children[2].innerText}" >
                <input class="form-control mr-sm-2 col-10 " style="display: none"   name="cena" type="text" value="${narucenePice[i].children[3].innerText}" >
                <input class="form-control mr-sm-2 col-10 " style="display: none"   name="vreme" type="text" value="${new Date().getHours() +":"+ new Date().getMinutes()}" >
              
        ` 
      }
      $("#forma").html(text);   
  })

  // Modal 1

    $(".imgClick").on('click', izmi_id)

    function izmi_id() {

      // Animacija kopiranje i postavljanje

      $("#zaBrisanje").html("");
     let self = $(this);
     let copy = self.clone();
      copy.addClass('kopirano')
    
     copy.css({
       position: 'absolute',
       top: self.offset().top,
       left: self.offset().left

     })
      
     $('#zaBrisanje').append(copy)

    
     
      // Komunikacija sa serverom AJAX


      let id = $(this).attr("id");
      var xhttp = new XMLHttpRequest();
      xhttp.open("POST", "/modul", true);
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          ubaciUmodul( JSON.parse(this.responseText) ) 
        }
      };
      xhttp.setRequestHeader("Content-Type", "application/json")
      xhttp.send(JSON.stringify({ id : id}));

    }

    // Velicina I cena pogled

    function ubaciUmodul(pica){
      $("#sakrivenaVelicinaCena").html(pica.cena[0].cena)
      $("#sakrivenaVelicina").html(pica.cena[0].velicina)
      $('#cena').html(pica.cena[0].cena+ " "+"Din")
      $('#modalHeader-1').attr('style',pica.style)
      $('#naziv').html(pica.naziv)
      $('#sastojci').html(pica.sastojci)

      let text = "";
     
      for(let i = 0; i < pica.cena.length; i++){
        text += `<div class="col-6">
          <div class="form-check  " >
            <p class="float-right">${pica.cena[i].cena} din</p>
            <input style="cursor: pointer;"  class="form-check-input vel" type="radio" name="velicina" id="${pica.cena[i].velicina}" value="${pica.cena[i].velicina}" required>
            <label class="form-check-label"  for="${pica.cena[i].velicina}"><span style="cursor: pointer;" >${pica.cena[i].velicina}</span></label>
          </div>
      </div>
      </hr>`
      }
      $("#vel_cena").html(text)


      // Biranje velicine pizze

      $('.vel').on('click',function(){
          let cena = (parseInt($(this).parent().find("p").text()) + parseInt($("#sakriveno").text())) * parseInt($("#kolicinaPica").text());
          $("#cena").html(cena+ " "+ "Din");
          $("#sakrivenaVelicinaCena").text($(this).parent().find("p").text())
          $("#sakrivenaVelicina").text($(this).parent().find("label").text())
    
      })
     
    // Biranje dodataaka

    
        $(".dodaci").on("click", function(){
          
          if(!this.checked){
            let minus = parseInt( $("#cena").text()) - parseInt($(this).parent().find("p").text()) * parseInt($("#kolicinaPica").text()) 
             $("#cena").text(minus + " " + "Din");
             let x = parseInt($("#sakriveno").text())  - parseInt($(this).parent().find("p").text())
            $("#sakriveno").html(x)
          }else{
            let plus = parseInt($("#cena").text())  + parseInt($(this).parent().find("p").text()) * parseInt($("#kolicinaPica").text()) 
            $("#cena").text(plus + " " + "Din");
            let x = parseInt($("#sakriveno").text())  + parseInt($(this).parent().find("p").text())
            $("#sakriveno").html(x)
            
          }    
      })

    }

    // Dodavanje pice 

    $("#vise").on('click', function(){
      
      let i = parseInt($("#kolicinaPica").text())  + 1;
        $("#kolicinaPica").text(i)

        if(parseInt($("#sakriveno").text()) == 0){
          let cena = parseInt($("#sakrivenaVelicinaCena").text()) * i;
          $("#cena").text(cena + " "+ "Din")

        }else{
          let cena = parseInt($("#sakrivenaVelicinaCena").text()) * i + parseInt($("#sakriveno").text()) * i;
          $("#cena").text(cena + " "+ "Din")

        }
    })

    // Oduzimanje Pice

    $("#manje").on('click', function(){
      
      let i = parseInt($("#kolicinaPica").text())  - 1;
        $("#kolicinaPica").text(i)

        if(parseInt($("#sakriveno").text()) == 0){
          let cena = parseInt($("#sakrivenaVelicinaCena").text()) * i;
          $("#cena").text(cena + " "+ "Din")

        }else{
          let cena = parseInt($("#sakrivenaVelicinaCena").text()) * i + parseInt($("#sakriveno").text()) * i;
          $("#cena").text(cena + " "+ "Din")

        }
   })


// Dodavanje u korpu i animacija

   $("#dodajUkorpu").on("click",dodajUkorpu)
     
   function dodajUkorpu(){
    $("#naruciBtn").css({"display":"block"})
    // Animacija 

    $('.kopirano')[0].animate({
      with : "0px",
      top : "250px",
      left: "1200px"
    },2000)

     
    // dodavanje u korpu

    let dodaci = document.querySelectorAll(".dodaci");
    let niz = "";
    
    for(let i =0; i<dodaci.length; i++){
      if(dodaci[i].checked){
        niz += dodaci[i].defaultValue+" "
      }
      dodaci[i].checked = false
    }

      if($("#dodajteProizvod").text() === "Dodajte proizvod!!"){

        $("#asideRigthCard").html(`
        <div class="narucenaPica"> 
        <h5 class=" card-title">${$("#naziv").text()}</h5>
        <div class="row">
        <div class="col-6">
        <p class="card-text"> ${$("#sakrivenaVelicina").text()}</p>
        </div>
        <div class="col-6">
        <p class="card-text narucenoPizza"> ${$("#kolicinaPica").text()} kom.</p>
        </div>
      </div>
        <p> ${niz}</p>
        <button class="ukCena btn btn-primary">Cena: ${$("#cena").text()}</button></div>
        <hr>`)
        $("#ukupnaCena").text($("#cena").text())
      }else{
        $("#asideRigthCard").append(`
        <div class="narucenaPica"> 
        <h5 class=" card-title">${$("#naziv").text()}</h5>
        <div class="row">
        <div class="col-6">
        <p class="card-text"> ${$("#sakrivenaVelicina").text()}</p>
        </div>
        <div class="col-6">
        <p class="card-text narucenoPizza"> ${$("#kolicinaPica").text()} kom.</p>
        </div>
      </div>
        <p> ${niz}</p>
        <button class=" ukCena btn btn-primary ">Cena: ${$("#cena").text()}</button></div>
        <hr>`)
        $("#ukupnaCena").text(parseInt($("#ukupnaCena").text()) + parseInt($("#cena").text()) +" "+ "Din")
      }

      setTimeout(function() { $('.broj').css('display','block');
     $('.broj').text(parseInt($("#kolicinaPica").text()) + parseInt($(".broj").text()) ) }, 2000)
  

     setTimeout(function() {$("#kolicinaPica").text(1)},3000)  
      
   }

  //  on Close

  $('#close').on('click', function(){
    let dodaci = document.querySelectorAll(".dodaci")
    for(let i =0; i<dodaci.length; i++){
      dodaci[i].checked = false
    }
  });

  

    


  });