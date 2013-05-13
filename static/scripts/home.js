//////////////////////////////////////////////////////////////////
////////////// For home.html  ////////////////////////////////////
//////////////////////////////////////////////////////////////////


var phoneFace = $("#phoneHomeMenu");
phoneFace.click(function(){
    addPhoneMenu();
});

function addPhoneMenu(){
    // check if menu is already displayed
    if ($("#mobileMenu")[0] === undefined){
        var menu = $("<div>");
        var login = $("<span>");
        var register = $("<span>");
        var loginLink = $("<a>");
        var registerLink = $("<a>");

        menu.attr("id", "mobileMenu");

        // login button
        login.attr("id", "mobileLogin");
        login.addClass("button");
        login.addClass("mobileMenuButton");
        login.addClass("roundedCorners");
        login.html("Login");
        loginLink.attr("href", "loginDialogue.html");
        loginLink.append(login);

        // register button    
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
        $("#preIntroduction").attr("id", "preExpand");
        $(".topBar").addClass("topBarExpanded");
        $(".topBar").append(menu);
    }
    else{
        // if already displayed, and icon clicked again,
        // collapse the drawer
        $("#mobileMenu").remove();
        $("#mobileLogin").remove();
        $("#mobileRegister").remove();
        $("#phoneHomeMenu").removeClass("menuSelected");
        $(".topBar").removeClass("topBarExpanded");
        $("#preExpand").attr("id", "preIntroduction");
    }
}

