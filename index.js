var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var https = require("https");
var fs = require("fs");
var jks = require("jks-js");

var upload = multer();
var app = express();

// Host du serveur d'intégration de test du Designer : "ace-designer-designer-https-ace-os.apps.ace4pm.os.fyre.ibm.com"
// Host du serveur d'intégration indépendant : "is-personsdbaccess-https-ace-os.apps.ace4pm.os.fyre.ibm.com"
const ACE_HOST = process.env.ACE_HOST || "is-personsdbaccess2-https-ace-os.apps.ace4pm.os.fyre.ibm.com";
const ACE_PORT = process.env.ACE_PORT || "443";

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
            //rejectUnauthorized: false
            rejectUnauthorized: true
        };

        var truststore = jks.toPem(
            fs.readFileSync("./stores/ace-os-truststore.jks"),
            "password"
        );
        var mycert = truststore["ace-os-cert"].ca;
        console.log(mycert);
    
        var httpsOptions = {
            host: ACE_HOST,
            port: ACE_PORT,
            path: "/PersonsDBAccessFlow/Person/RetrieveAllPersons",
            agent: new https.Agent(agentOptions),
            method: "GET",
            headers: {"accept": "application/json", "Authorization": "Basic eTdPTUlGZjY6VkdKVGRBSVlGOTAzMVdDVVh5OG00UkJjczJMbGk3cnA="},
            ca: mycert
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
        //rejectUnauthorized: false
        rejectUnauthorized: true
    };

    var truststore = jks.toPem(
        fs.readFileSync("./stores/ace-os-truststore.jks"),
        "password"
    );
    var mycert = truststore["ace-os-cert"].ca;
    console.log(mycert);

    var httpsOptions = {
        host: ACE_HOST,
        port: ACE_PORT,
        path: "/PersonsDBAccessFlow/Person/" + req.param("id"),
        agent: new https.Agent(agentOptions),
        method: "GET",
        headers: {"accept": "application/json", "Authorization": "Basic eTdPTUlGZjY6VkdKVGRBSVlGOTAzMVdDVVh5OG00UkJjczJMbGk3cnA="},
        ca: mycert
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
        //rejectUnauthorized: false
        rejectUnauthorized: true
    };

    var truststore = jks.toPem(
        fs.readFileSync("./stores/ace-os-truststore.jks"),
        "password"
    );
    var mycert = truststore["ace-os-cert"].ca;
    console.log(mycert);

    var httpsOptions = {
        host: ACE_HOST,
        port: ACE_PORT,
        path: "/PersonsDBAccessFlow/Person",
        agent: new https.Agent(agentOptions),
        method: "POST",
        headers: {"accept": "application/json", "Authorization": "Basic eTdPTUlGZjY6VkdKVGRBSVlGOTAzMVdDVVh5OG00UkJjczJMbGk3cnA="},
        ca: mycert
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
        //rejectUnauthorized: false
        rejectUnauthorized: true
    };

    var truststore = jks.toPem(
        fs.readFileSync("./stores/ace-os-truststore.jks"),
        "password"
    );
    var mycert = truststore["ace-os-cert"].ca;
    console.log(mycert);

    var httpsOptions = {
        host: ACE_HOST,
        port: ACE_PORT,
        path: "/PersonsDBAccessFlow/Person/" + req.param("id") + "/deletebyid",
        agent: new https.Agent(agentOptions),
        method: "DELETE",
        headers: {"accept": "application/json", "Authorization": "Basic eTdPTUlGZjY6VkdKVGRBSVlGOTAzMVdDVVh5OG00UkJjczJMbGk3cnA="},
        ca: mycert
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
