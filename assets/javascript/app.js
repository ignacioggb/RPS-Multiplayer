var config = {
    apiKey: "AIzaSyA8ZYrtK---onOLt4LDJSBOgNmU1-rhELg",
    authDomain: "bootcampignacio.firebaseapp.com",
    databaseURL: "https://bootcampignacio.firebaseio.com",
    projectId: "bootcampignacio",
    storageBucket: "bootcampignacio.appspot.com",
    messagingSenderId: "943456383704"
  };
  firebase.initializeApp(config);
  
  firebase.database().ref(side).onDisconnect().remove();
  
  var side;var rival;var choose=" ";var flag=false;var mycounter=0;var rivalcounter=0;
  
  
    $(window).on('load',function(){
        $('#myModal').modal('show');
        $(".close").remove()
    });
  
    $( document ).ready(function() {
      $(".btn-secondary").on("click", logname);
      $(".choosebtn").on("click", imgchange);
    });
  
  function logname(){
    event.preventDefault();
    myplayer = $("#player1").val();
    $("#myname").text(myplayer);
    firebase.database().ref().once("value").then(function (snapshot) {
        if(snapshot.child("Player1").exists()) {
           side="Player2";
           rival="Player1";
           }
           else{
           side="Player1";
           rival="Player2";
           }
       }, function (errorObject) {
           console.log("The read failed: " + errorObject.code);
       });
      setTimeout(start,3000);
  }
  
  function imgchange(){
    $("#myimage").attr("src","assets/images/"+this.id+".png");
    choose=this.id;
    flag=true;
    firebase.database().ref(side).update({
      Choose:choose,Flag:flag
      });
  
      firebase.database().ref().child(rival).on("value", function (snapshot) { 
        var rivalchoose=snapshot.val().Choose;
        if(rivalchoose!=" "){
          $("#rivalimage").attr("src","assets/images/"+rivalchoose+".png");
        }
      });
compare();
  }
  
  function start(){
    firebase.database().ref().child(rival).on("value", function (snapshot) {
      if(snapshot.val().Flag==true){
      $("#rivalimage").attr("src","assets/images/ready.gif");}
      else{   $("#rivalimage").attr("src","assets/images/loading.gif"); }
    });
    firebase.database().ref(side).set({
        PlayerName:myplayer,
        Choose:choose,
        Flag:flag,
        });
  
        firebase.database().ref().child(rival).on("value", function (snapshot) { 
          var name=snapshot.val().PlayerName;
          $("#player2").text(name);
        });
  
  
        firebase.database().ref().on("value", function (snapshot) {
      if (snapshot.child("Player1").exists()==false && snapshot.child("Player2").exists()==false) {
    alert("Your rival left");
    location.reload();
      }
  });
  }
  
  
  function compare(){
    firebase.database().ref().child(rival).on("value", function (snapshot) {
      if(snapshot.val().Flag==true&&flag==true){
        var myrival=snapshot.val().Choose;
        if(myrival==choose){console.log("es un empate");  flag=false;
        choose=" ";  setTimeout(reset,3000);}
  
        else if(myrival=="rock"&&choose=="scissor"||
        myrival=="scissor"&&choose=="paper"||
        myrival=="paper"&&choose=="rock"){
          console.log("you lose");
          rivalcounter++;
          $("#rivalcounter").text(rivalcounter);
          flag=false;
          choose=" ";
          setTimeout(reset,3000);
        }
        
        else if(choose=="rock"&&myrival=="scissor"
        ||choose=="scissor"&&myrival=="paper"
        ||choose=="paper"&&myrival=="rock"){
          console.log("you win");
          mycounter++;
          $("#mycounter").text(mycounter);
          flag=false;
          choose=" ";
          setTimeout(reset,3000);
        }
      }
    });
  }
  
  function reset(){

    firebase.database().ref(side).update({
      Choose:choose,Flag:flag
      });
      $("#myimage").attr("src","assets/images/loading.gif");
      $("#rivalimage").attr("src","assets/images/loading.gif");
    start();
  }