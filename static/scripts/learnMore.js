////////////////////////////////////////////////////
////////// For About Us Page ///////////////////////
///////////////////////////////////////////////////
//Create Login if necessary
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

var phoneFace = $("#phoneHomeMenu");
phoneFace.click(function(){
    addPhoneMenu();
});

function addPhoneMenu(){
    if ($("#mobileMenu")[0] === undefined){
        var menu = $("<div>");
        var login = $("<span>");
        var register = $("<span>");
        var loginLink = $("<a>");
        var registerLink = $("<a>");


        menu.attr("id", "mobileMenu");
        
        login.attr("id", "mobileLogin");
        login.addClass("button");
        login.addClass("mobileMenuButton");
        login.addClass("roundedCorners");
        login.html("Login");
        loginLink.attr("href", "loginDialogue.html");
        loginLink.append(login);
        
        register.attr("id", "mobileRegister");
        register.addClass("button");
        register.addClass("mobileMenuButton");
        register.addClass("roundedCorners");
        register.html("Register");
        registerLink.attr("href", "registerDialogue.html");
        registerLink.append(register);

        menu.append(loginLink);
        menu.append(registerLink);
      
        $("#phoneHomeMenu").addClass("menuSelected");
        $("#learnMorePage").attr("id", "learnExpanded");
        $(".topBar").addClass("topBarExpanded");
        $(".topBar").append(menu);
        }
    else{
        $("#mobileMenu").remove();
        $("mobileLogin").remove();
        $("mobileRegister").remove();
        $("#phoneHomeMenu").removeClass("menuSelected");
        $(".topBar").removeClass("topBarExpanded");
        $("#learnExpanded").attr("id", "learnMorePage");
    }
}
