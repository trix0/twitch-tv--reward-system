var express = require("express");
var fs= require("fs");//file System
var app= express();// we talk to the code
app.use(express.static(__dirname+"/public"));
	var sIndexHtml=fs.readFileSync(__dirname+"/view-index.html", "utf-8");
	var anim=fs.readFileSync(__dirname+"/animation.html", "utf-8");
	var APGet_cases=fs.readFileSync(__dirname+"/apis/get_cases.js", "utf-8");
	var sIndexCss=fs.readFileSync(__dirname+"/css-app.css", "utf-8");
	var sJavaScript=fs.readFileSync(__dirname+"/index.js", "utf-8");
	var sJavaScriptAnim=fs.readFileSync(__dirname+"/indexAnim.js", "utf-8");
// route to server the main website
app.get("/", function(request,response){

	var sName="Matus";
	sIndexHtml=sIndexHtml.replace("{{css}}",sIndexCss);
	sIndexHtml=sIndexHtml.replace("{{js}}", sJavaScript);
	response.send(sIndexHtml);
})


app.get("/apis/get_cases", function(request, response){
	response.send(APGet_cases);
})
app.get("/animation", function(request, response){	
	anim=anim.replace("{{css}}",sIndexCss);
	anim=anim.replace("{{js}}", sJavaScriptAnim);
	response.send(anim);
})
// app.get("/contact", function(request, response){
// 	response.send("<h1>Contact</h1>");
// })
app.listen(8080, function(){
	console.log("server listening to port 3241");
})