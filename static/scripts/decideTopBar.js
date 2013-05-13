var user;
function getMe(callBack){
    $.ajax({
        type: "get",
        url: "/me",
        success: function(data){
            changeHome(data);
        }  
    });
}


//decide if logo should link to user home or regular home
function changeHome(user){
    if (user !== "no login data present"){
        $("#goHome").attr("href", "index.html");
        $("#goBackHome").attr("href", "index.html");
        makeLogout();
    }
    else{
        $("#goHome").attr("href", "home.html");
        $("#goBackHome").attr("href", "home.html");
    }
}


function makeLogout(){
    var head = $('head');
    var topBar = $('.topBar');
    var bar = $('#bar');
    var logo = $('#goHome');
    var login = $("<span>");
    login.attr('id','login');

    $("#phoneHomeMenu").remove();

    var button = $("<span>");
    button.addClass('homePageButton button roundedCorners');
    button.attr('id','logoutButton');
    button.html('Log Out');

    $.getScript("scripts/logout.js", function(){
        logoutFunction();
    });
      
    login.append(button);
    bar.append(login);
}


getMe();