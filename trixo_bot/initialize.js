var tmi=require("tmi.js");
var credentials=require('./credentials.js');

var options={
	options:{
		debug: true
	},
	connections:{
		cluster:"aws",
		reconnect:true
	},
	identity:{
		username:credentials.sBotUserName,
		password:credentials.sOauth
	},
	channels:credentials.aChannels
}

//var client= new tmi.client(options);

module.exports.client=new tmi.client(options);


