var express = require("express");
var app = express();
var fs = require('fs');
var mongoExpressAuth = require('mongo-express-auth');
var request = require('request');







//===========================
//  init
//===========================

mongoExpressAuth.init({
    mongo: { 
        dbName: 'myApp',
        collectionName: 'accounts'
    }
}, function(){
    console.log('mongo ready!');
    app.listen(8889);
});

app.use(express.bodyParser({uploadDir:'./static/uploads'}));
app.use(express.cookieParser());
app.use(express.session({ secret: 'The electric Trex strikes again' }));

//===========================
//  routes
//===========================


app.get('/', function(req, res){
    mongoExpressAuth.checkLogin(req, res, function(err){
        if (err)
            res.sendfile('static/login.html');
        else
            res.sendfile('static/index.html');
    });
});


// get the current logged in user
app.get('/me', function(req, res){
    mongoExpressAuth.checkLogin(req, res, function(err){
        if (err)
            res.send(err);
        else {
            mongoExpressAuth.getAccount(req, function(err, result){
                if (err)
                    res.send(err);
                else 
                    res.send(result); 
            });
        }
    });
});


//logging in
app.post('/login', function(req, res){
    mongoExpressAuth.login(req, res, function(err){
        if (err)
            res.send(err); 
        else
            res.send('ok');
    });
});

//logging out 
app.post('/logout', function(req, res){
    mongoExpressAuth.logout(req, res);
    res.send('ok');
});


// creating a new user
app.post('/register', function(req, res){ 
    mongoExpressAuth.register(req, function(err){
        if (err)
            res.send(err);
        else
            res.send('ok');
    });
});


//=================================================================
var child_process = require('child_process');
var justUploaded = "";
var converted = "";
var outPutFile = "static/foo.txt";
var filterUsed = 1;


//converts the image based on current filter
app.post('/convert', function(req,res){
    justUploaded = req.body.justUploaded;
    var ext = justUploaded.lastIndexOf('.');
    outPutFile = justUploaded.substring(0,ext)+".txt";
    //makes the call to the python script
    child_process.exec('python filter.py static/'+justUploaded+' static/'+outPutFile+' '+filterUsed,function(error,stdout,stderr){
        if(error){
            throw error;
        }
        converted = stdout.replace('static/','');
        console.log('converted: '+ converted);
        res.send({
            success: true
        });
    });
    console.log(converted);
});

// send the newly converted image
app.put("/converted", function(request, response){
    var text;
    justUploaded = request.body.justUploaded;
    console.log("Just uploaded: "+justUploaded);
    var ext = justUploaded.lastIndexOf('.');
    outPutFile = "static/"+justUploaded.substring(0,ext)+".txt";
    readFile(outPutFile,"",function(err,data){
        text = data;
        //make the text file work for rendering with html
        text = text.replace(/ /g,"&nbsp;");
        text = text.replace(/</g,"&#60");
        text = text.replace(/\n/g,"<br />");
        response.send({
            text: text,
            success: true
        });
    });
    
});



// grabbing the image from a url and adding it to uploads folder
var download = function(uri, filename,response){
    request.head(uri, function(err, res, body){
    if(err){
        console.log(err);
        response.redirect("genImage1.html");
    }
    else if ((res.headers['content-type']).indexOf('image')== -1){
        console.log('Not Image URL!');
        response.redirect("genImage1.html");
    }
    else{
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename));
        request(uri).on('end', function (){
            console.log("redirect");
            response.redirect("genImage1.html");
        });
    }
  });
};


// sending the url to be downloaded
app.post('/onlineImage', function(req, res){
    var urlText = req.body.urlText;
    var date = req.body.date;


    var outPutImageFile = 'static/uploads/trial'+date+'.png';
    
    justUploaded = 'uploads/trial'+date+'.png';
    outPutFile = "uploads/trial"+date+".txt";

    download(urlText, outPutImageFile,res);

});


// when the user downloads their printable braille .txt file
app.get('/uploads/:filename', function(req, res){
                          //uploads/foo.txt
    var file = __dirname + "/static/uploads/"+req.params.filename;
    console.log("\nfile: "+file);
    res.download(file); // Set disposition and send it.
});


// uploads the image
app.post('/upload', function(req, res) { 
    var type = req.files['thumbnail'].type;
    // make sure the file is actually an image!
    if (type !== "image/jpeg" && type !== "image/png" && type !== "image/gif"){
        res.redirect('notanImage.html');        
    }
    else{
    // get the name of the uploaded file and intended name
    var fileName = req.files['thumbnail'].path;
    var newName = req.files['thumbnail'].name;
    var srcimg = "static/uploads/"+newName;
    justUploaded = "uploads/"+newName;
    var ext = justUploaded.lastIndexOf('.');
    outPutFile = justUploaded.substring(0,ext)+".txt";


    // rename the file
    fs.renameSync(fileName, srcimg);
    if (mongoExpressAuth.isLoggedIn(req)){
        mongoExpressAuth.updateUploadImage(req, justUploaded, function(err, result){
            if(err){
                res.send(err);
            }
        });
    }
    res.redirect('genImage1.html');}
});


// changes the filter based of a click if the 'radio' buttons
app.post('/filter', function(req, res){
   filterUsed = req.body.filterNum;
   res.send({
       success: (filterUsed === 1 || filterUsed === 2 || filterUsed === 3)
   });
});


// gets the current working image
app.get("/justUploaded", function(request, response){
    if (mongoExpressAuth.isLoggedIn(request)){
        // depends on user
        mongoExpressAuth.getAccount(request, function(err, result){
            if (err)
                response.send(err);
            else 
                justUploaded = result.currentUpload;
        });
    }
    response.send({
        justUploaded: justUploaded, 
        success: (justUploaded !== "")
    });

});

// Asynchronously read file contents, then call callbackFn
function readFile(filename, defaultData, callbackFn) {
  fs.readFile(filename, "utf8", function(err, data) {
    if (err) {
      console.log("Error reading file: ", filename);
      data = defaultData;
    } else {
      console.log("Success reading file: ", filename);
    }
    if (callbackFn) callbackFn(err, data);
  });
}


// grab all the images from a specific user
app.get("/allImages", function(request,response){
    if (mongoExpressAuth.isLoggedIn(request)){
    var h = mongoExpressAuth.getUserImages(request, function(err, result){
            if(err){
                res.send(err);
            }
        });
    }
});


// saves the image to the database
app.post("/save", function(request,response){
    var img = request.body.img;
    var title = request.body.title;
    var desc = request.body.desc;
    //depends on user
    if (mongoExpressAuth.isLoggedIn(request)){
        mongoExpressAuth.addImage(request, img, title, desc, function(err, result){
            if(err){
                res.send(err);
            }
        });
    }
})



/// Creating the permanent standard library
var library = {"Elephant":"imageLib/elephant.jpg",
               "Letter A":"imageLib/letter_a.jpg",
               "Letter B":"imageLib/letter_b.jpg",
               "Letter C":"imageLib/letter_c.jpg",
               "Letter D":"imageLib/letter_d.jpg",
               "Letter E":"imageLib/letter_e.jpg",
               "Letter F":"imageLib/letter_f.jpg",
               "Letter G":"imageLib/letter_g.jpg",
               "Circle":"imageLib/shape_circle.jpg",
               "Square":"imageLib/shape-square.jpg",
               "Triangle":"imageLib/shape-triangle.jpg"
};

// sending the library contents
app.get('/imageLib', function(request, response){
    response.send({
        library: library
    })
});



app.use(express.static(__dirname + '/static/'));
// Finally, initialize the server, then activate the server at port 8889
