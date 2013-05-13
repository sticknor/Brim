var user;

//Create Login if necessary
    function getMe(callBack){
      $.ajax({
        type: "get",
        url: "/me",
        success: function(data){
          user = data;
          callBack(data);
        }  
      });
    }


    function createLogin(user){
      console.log('createLogin');
      console.log(user);
      var head = $('head');
      var topBar = $('.topBar');
      var bar = $('#bar');
      var logo = $('#goHome');
      var login = $("<span>");
      login.attr('id','login');

      if(user == 'no login data present'){
        var button = $('<span>');
        button.addClass('smallRoundedCorners');
        button.attr("id", "phoneHomeMenu");
        button.click(function(){addPhoneMenu();;});

        login.append(button);
        
        var ref = $("<a href = 'home.html'>");
        
      }
      else{
        var button = $("<span>");
        button.addClass('homePageButton button roundedCorners');
        button.attr('id','logoutButton');
        button.html('Log Out');

        $.getScript("scripts/logout.js", function(){
            logoutFunction();
        });

        var ref = $("<a href = 'index.html'>");
      
      }
      logo.attr("id", "logo");
      ref.append(logo);
      bar.append(ref);
      login.append(button);
      bar.append(login);
      
    }

    getMe(createLogin);


    var upload = $("#upload");
    var actualUpload = $("#actualUpload");
    var url = $("#url");

    url.click(function(){
        var imageBox = $(".imageBoxContainer");
        var form = $("<form>");
        var text = $("<input id = 'urlText' type='text' placeholder = 'http://...'/>");
        var button = $("<div>");
        button.addClass('button roundedCorners');
        button.attr('id','urlButton');
        button.html('Submit');
        button.click(function(){
          var urlText = $('#urlText');
          var url = urlText.val();
          var url4 = url.slice(-4);
          var url5 = url.slice(-5);
          if(url !="" && (url4 === ".jpg" || url4 === ".gif" || url4 === ".png" || url5 === ".jpeg")){
            getOnlineImage(urlText.val());
            var t=setTimeout(function(){window.location.reload();},300)

          }
          else(alert("You must include an image (.jpg, .gif, or .png) URL!"))
        });
        form.append(text);
        form.append(button);
        imageBox.append(form);

      var cancel = $("<div>");
      cancel.addClass("button");
      cancel.addClass("roundedCorners");
      cancel.html("x");
      cancel.attr("id", "URLcancel");
      cancel.click(function(){
          sessionStorage.removeItem('justUploaded');
          window.location.reload();
      });
      $("#imageBox").append(cancel);

      $("#upload").remove();
      $("#or").remove();
      $("#url").remove();
      $(".fileUpload").remove();
      $("#chooseFile").remove();
      $("#actualUpload").remove();

    });

    upload.click(function(){
      var uploadButton = $("#upload");
      var or = $("#or");
      var url = $("#url");
      uploadButton.remove();
      or.remove();
      url.remove();
      $(".fileUpload").each(function(){
        $(this).removeClass("hide");
      });
      $("input[type='file']").change(function(){
        var filename = $(this).val();
        console.log(user.currentUpload);
        filename = (filename.replace("C:\\fakepath\\","uploads/"));
        console.log(filename);
        sessionStorage.setItem('justUploaded',filename);
        $("#uploadForm").submit();
      });
        var cancel = $("<div>");
        cancel.addClass("button");
        cancel.addClass("roundedCorners");
        cancel.html("x");
        cancel.attr("id", "cancel");
        cancel.click(function(){
           sessionStorage.removeItem('justUploaded');
            window.location.reload();
      });
      $("#imageBox").append(cancel);

    });



function correctBoxSize(){
    var w = $("#imageBox").css("width");
    if($(".img")[0] !== undefined && $(".img2")[0]===undefined){
        var h = $(".img").css("height");
        $("#imageBox").css("height", h);
    }
    else if($(".img")[0] !== undefined && $(".img2")[0] !== undefined){
        var h = $(".braille").css("height");
        h = h.slice(0, -2);
        h =  100+(+h)+"px";
        $("#imageBox").css("height", h);
    }
    else{
        $("#imageBox").css("height", "100%");
    }
}

 window.addEventListener('resize', function() {
    correctBoxSize();
 });






function getOnlineImage(urlText){
  $.ajax({
    type: "post",
    url: "/onlineImage",
    data: {urlText:urlText},
    success: function(data){
        var date = new Date().getTime();
        sessionStorage.setItem('justUploaded', "uploads/trial.png");
  }
});
}

    
/*function uploadImage(){
  $.ajax({
    type: "post",
    url: "/upload",
    success: function(data){
      alert('sup nigga');
      console.log(data.justUploaded);
      sessionStorage.justUploaded = data.justUploaded;
      //get();
    }  
  });
}*/
function convert(){
  $.ajax({
    type: "post",
    url: "/convert",
    data: {justUploaded:sessionStorage.getItem('justUploaded')},
    success: function(data){
      getConverted();
    }
  });
}

function saveImage(){
  $.ajax({
    type:"post",
    url: "/save",
    data: {
      img : sessionStorage.getItem('justUploaded'),
      title : "",
      desc : ""
    },
    success: function(data){
    }
  });
}

function getAllImages(){
  $.ajax({
    type: "get",
    url: "/allImages",
    success: function(data){}
  });
}

function getConverted(){
  $.ajax({
    type: "get",
    url: "/converted",
    success: function(data) {
      text = data.text;
      if (text !== ""){
          var imageBox = $("#imageBox");
          var textDiv = $("<div>");

          $(".braille").remove();
          textDiv.html(text);
          textDiv.addClass("braille");
          imageBox.append(textDiv);


          $(".img").addClass("img2");
          correctBoxSize();

        // sessionStorage.removeItem('justUploaded');
      }
    }
  });
}



function changeFilter(filterNum){
  $("#filter1").removeClass("filterSelected");
  $("#filter2").removeClass("filterSelected");
  $("#filter3").removeClass("filterSelected");
  $("#filter"+filterNum).addClass("filterSelected")

  $.ajax({
    type: "post",
    url: "/filter",
    data: {filterNum:filterNum},
    success: function(data){
        convert();
    }  
  });
}



function get(){
  var uploaded = sessionStorage.getItem('justUploaded');
  console.log(uploaded);
  console.log(uploaded !== null);


  if (uploaded !== null){
    var up4 = uploaded.slice(-4);
    var up5 = uploaded.slice(-5);
    if(up4 === ".jpg" || up4 === ".gif" || up4 === ".png" || up5 === ".jpeg"){

      var cancel = $("<div>");
      cancel.addClass("button");
      cancel.addClass("roundedCorners");
      cancel.html("x");
      cancel.attr("id", "cancel");
      cancel.click(function(){
             
             sessionStorage.removeItem('justUploaded');
             window.location.reload();
      });

     
      $("#imageBox").append(cancel);
      console.log("justUploaded: "+uploaded);
      var call =  function(){
      var imageBox = $("#imageBox");
      var image = $("<img>");
      image.attr("src", uploaded);
      image.addClass("img");
      imageBox.append(image);
      //correctImageSize();
      //correctBoxSize();

      $("#upload").addClass("hide");
      //$("#actualUpload").addClass("hide");
      //$("#chooseFile").addClass("hide");
      $("#or").addClass("hide");
      $("#url").addClass("hide");
      $(".fileUpload").each(function(){
        $(this).addClass("hide");
      });

      $("#centerBottom").removeClass("hide");
      $("#filters").removeClass("hide");

      $("#filter1").removeClass("hide");
      $("#filter1").click(function(){
          changeFilter(1);
          $("#convert").removeClass("hide"); 
      });
      $("#filter2").removeClass("hide");
      $("#filter2").click(function(){
          changeFilter(2);
      $("#convert").removeClass("hide"); 
      });
      $("#filter3").removeClass("hide");
      $("#filter3").click(function(){
          changeFilter(3);
                $("#convert").removeClass("hide"); 

      });
       

      $("#convert").click(function(){
        if (true){
          console.log('converting...');
          $("#convert").unbind("click");
          $("#convert").html("New Image");
          $("#convert").attr("id", "newImage");
          $('#filters').addClass("hide");
          //sessionStorage.removeItem('justUploaded');

          $("#newImage").click(function(){
             sessionStorage.removeItem('justUploaded');
             window.location.reload();
          });

          $("#download").removeClass("hide");



          if(user !== 'no login data present'){
            $('#newImage').addClass('halfWidth');
            $("#save").removeClass("hide");
            $("#save").click(function(){
              saveImage();
            });
          }
          //($("#cancel")).remove();
          convert();
        }
      });
      }();
  }
}
}


window.onload = function(){
  get();
  var b=setTimeout(function(){correctBoxSize();},50)
};