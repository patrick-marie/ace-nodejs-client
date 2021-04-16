var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var https = require("https");

var upload = multer();
var app = express();

app.set('view engine', 'pug');
app.set('views', './views');

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

app.get("/", function(req, res){
    console.log("Received a request");
    res.render('main-form');
 });
 
app.get("/action", function(req, res){
    console.log("Received a request: action selected:" + req.param("action"));
    if (req.param("action") == "retrieve") {
        res.render("retrieve-form");
    } else if (req.param("action") == "retrieveall") {
        console.log("Received a request: action/retrieveall");
    
        var agentOptions = {
            rejectUnauthorized: false
        };
    
        var httpsOptions = {
            // Serveur d'intégration de test du Designer :
            //host: "ace-designer-designer-https-ace-os.apps.ace4pm.os.fyre.ibm.com",
            // Serveur d'intégration indépendant :
            host: "is-personsdbaccess-https-ace-os.apps.ace4pm.os.fyre.ibm.com",
            path: "/PersonsDBAccessFlow/Person/RetrieveAllPersons",
            port: "443",
            agent: new https.Agent(agentOptions),
            method: "GET",
            headers: {"accept": "application/json", "Authorization": "Basic eTdPTUlGZjY6VkdKVGRBSVlGOTAzMVdDVVh5OG00UkJjczJMbGk3cnA="}
        };
    
        var request = https.request(httpsOptions, function(response) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
          
            // Buffer the body entirely for processing as a whole.
            var responseStr = "";
            response.on("data", function(chunk) {
                responseStr += chunk;
            });
    
            response.on("end", function(){
                console.log("Response: " + responseStr);
                res.render("retrieveall-resp", {
                    body: responseStr
                });
            });
        });
          
        request.on("error", function(e) {
              console.log("ERROR: " + e.message);
        });
    
        request.end();
    } else if (req.param("action") == "input") {
        res.render("input-form");
    } else {
        res.render("delete-form");
    }
 });
 
app.get("/action/retrieve", function(req, res){
    console.log("Received a request: action/retrieve " + req.param("id"));
    
    var agentOptions = {
        rejectUnauthorized: false
    };

    var httpsOptions = {
        // Serveur d'intégration de test du Designer :
        //host: "ace-designer-designer-https-ace-os.apps.ace4pm.os.fyre.ibm.com",
        // Serveur d'intégration indépendant :
        host: "is-personsdbaccess-https-ace-os.apps.ace4pm.os.fyre.ibm.com",
        path: "/PersonsDBAccessFlow/Person/" + req.param("id"),
        port: "443",
        agent: new https.Agent(agentOptions),
        method: "GET",
        headers: {"accept": "application/json", "Authorization": "Basic eTdPTUlGZjY6VkdKVGRBSVlGOTAzMVdDVVh5OG00UkJjczJMbGk3cnA="}
    };

    var request = https.request(httpsOptions, function(response) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
      
        // Buffer the body entirely for processing as a whole.
        var responseStr = "";
        response.on("data", function(chunk) {
            responseStr += chunk;
        });

        response.on("end", function(){
            console.log("Response: " + responseStr);
            res.render("retrieve-resp", {
                body: responseStr
            });
        });
    });
      
    request.on("error", function(e) {
          console.log("ERROR: " + e.message);
    });

    request.end();
});
 
app.post("/action/input", function(req, res){
    console.log("Received a request : action/input " + req.body.id + " " + req.body.lastname + " " + req.body.firstname);

    var agentOptions = {
        rejectUnauthorized: false
    };

    var httpsOptions = {
        // Serveur d'intégration de test du Designer :
        //host: "ace-designer-designer-https-ace-os.apps.ace4pm.os.fyre.ibm.com",
        // Serveur d'intégration indépendant :
        host: "is-personsdbaccess-https-ace-os.apps.ace4pm.os.fyre.ibm.com",
        path: "/PersonsDBAccessFlow/Person",
        port: "443",
        agent: new https.Agent(agentOptions),
        method: "POST",
        headers: {"accept": "application/json", "Authorization": "Basic eTdPTUlGZjY6VkdKVGRBSVlGOTAzMVdDVVh5OG00UkJjczJMbGk3cnA="}
    };

    var request = https.request(httpsOptions, function(response) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
      
        // Buffer the body entirely for processing as a whole.
        var responseStr = "";
        response.on("data", function(chunk) {
            responseStr += chunk;
        });

        response.on("end", function(){
            console.log("Response: " + responseStr);
            res.render("input-resp", {
                body: responseStr
            });
        });
    });
      
    request.on("error", function(e) {
          console.log("ERROR: " + e.message);
    });

    request.write(JSON.stringify(req.body));

    request.end();
});
 
app.get("/action/delete", function(req, res){
    console.log("Received a request : action/delete " + req.param("id"));
    var agentOptions = {
        rejectUnauthorized: false
    };

    var httpsOptions = {
        // Serveur d'intégration de test du Designer :
        //host: "ace-designer-designer-https-ace-os.apps.ace4pm.os.fyre.ibm.com",
        // Serveur d'intégration indépendant :
        host: "is-personsdbaccess-https-ace-os.apps.ace4pm.os.fyre.ibm.com",
        path: "/PersonsDBAccessFlow/Person/" + req.param("id") + "/deletebyid",
        port: "443",
        agent: new https.Agent(agentOptions),
        method: "DELETE",
        headers: {"accept": "application/json", "Authorization": "Basic eTdPTUlGZjY6VkdKVGRBSVlGOTAzMVdDVVh5OG00UkJjczJMbGk3cnA="}
    };

    var request = https.request(httpsOptions, function(response) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
      
        // Buffer the body entirely for processing as a whole.
        var responseStr = "";
        response.on("data", function(chunk) {
            responseStr += chunk;
        });

        response.on("end", function(){
            console.log("Response: " + responseStr);
            res.render("delete-resp", {
                body: responseStr
            });
        });
    });
      
    request.on("error", function(e) {
          console.log("ERROR: " + e.message);
    });

    request.end();
});
 
app.listen(3000);
