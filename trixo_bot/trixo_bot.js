// require
var connection=require('./initialize.js');
var credentials=require('./credentials.js');
var dbCon=require('./db.js');
var request = require('xhr-request');
var cronJob = require('cron').CronJob;
var crypto = require('crypto');
// require ends
var db = dbCon.dbConnection;
db.connect();
//connection
connection.client.connect();
//connection ends
// variables
var sBotUserName=credentials.sBotUserName;
var sOauth=credentials.sOauth;
var aChannels=credentials.aChannels;
var sClientId=credentials.sClientId;
var iInsertFollowerController=0;
var fnCommandCountDown=true;



// follower list  is list of all follwers fetched from database
var aFollowerList=[];// all followers

  // new follower list 
var aNewFollowerList=[];
//variables ends

// cronjobs
var cGetLatestFollowers= setInterval(function() {
    // your function
    fnGetLatestFollowerList();
 
}, 60000);

var cGetStreamStatus=setInterval(function(){
     var aNamesForPoints=[];
     fnIsStreamOnline('131875000',function(data){
      if(data.streams&&!data.streams.length){

     }
      else{
                fnGetViewers("makemake",function(data){
          fnAddPoints(data,function(index,detail){
            if(detail==null){

            }
            else{
              aNamesForPoints.push(detail.twitch_name);
             
            }
             if(index=="all"){
                fnInsertPoints(aNamesForPoints,function(results){
                })
              }

          });
        });
     }
})

},150000)


connection.client.on("connected", function(address, port){
	//connection.client.action("makemake", "Tu som more!");

})

connection.client.on("disconnected", function (reason) {
    connection.client.action("makemake", "Som v piči["+reason+"]");
});


connection.client.on("whisper", function (from, userstate, message, self) {
    // Don't listen to my own messages..
  if(message.indexOf("!talk")!=-1){
    if(from==="#trlxo"){
      message=message.replace("!talk","");
      connection.client.action("makemake",message);
    }
  }

  else if(message==="!open"){
      if(fnCommandCountDown==true){
              fnCommandCountDowns();
              console.log(from);
              from=from.replace("#","");
          var userName=from.toLowerCase();
        

      fnCreateUserKey(function(openKey){
        var sOpenKey=openKey;
        fnInsertOpenKey(userName,sOpenKey,function(status,openKey){
          if(status===1){
            var sOpenKey=openKey;
            connection.client.whisper(from, " http://ec2-52-29-149-136.eu-central-1.compute.amazonaws.com:8080/?user="+sOpenKey);
            connection.client.action("makemake","@"+from+" ak ti link neprišiel, nezabudni dať follow tomuto botovi @trixo_bot");
          }
          if(status===2){
            var sOpenKey=openKey;
            connection.client.action("makemake","@"+from+" bracho bez followu case-ky neotváraš.");
          }
        });
      });
    }



   }
   console.log(message);
   console.log(from);

    // Do your stuff.

});




// chat events



connection.client.on("chat", function (channel,user, message, self) {
    if(message==="!body"||message==="!points"){
      if(fnCommandCountDown==true){
              fnCommandCountDowns();
        fnCheckPoints(user['display-name'],function(results,status){
          var results=results;
          var status=status;
          if(status==1){
          connection.client.action("makemake","@"+user['display-name']+" momentálne máš "+results[0].points+" bodov."); 
          }
          else if(status==2){
          connection.client.action("makemake","@"+user['display-name']+" bracho bez followu body nedostávaš."); 
          }
          else{}
        });
      }
    }

            console.log(message);
   if(message.indexOf("!addall")!=-1){
    var userName=user['display-name'].toLowerCase();
    if(userName=="trlxo"||userName=="makemake"){
      var aMessage=message.split(" ");
      fnAddPointsToAll(aMessage[1]);
      connection.client.action("makemake", "všetkým som pridal body ");
    }
  }

   else if(message.indexOf("!add")!=-1){
      var userName=user['display-name'].toLowerCase();
        if(userName=="trlxo"||userName=="makemake"){
          var aMessage=message.split(" ");
          aMessage.shift();
          var buildString="";
         
          var pointsAdd=aMessage[aMessage.length-1];
          for(var x=0; x<aMessage.length-1; x++){
             var userAdd=aMessage[x].toLowerCase();
             userAdd=userAdd.replace("@","");
             buildString+="@"+userAdd;
             fnDirrectAddPoints(userAdd,pointsAdd,x,function(data){
              if(data==aMessage.length-2){
                if(pointsAdd==1){
                  connection.client.action("makemake",buildString+" dostal si "+pointsAdd+" bod.");
                }
                else if(pointsAdd>1&&pointsAdd<5){
                  connection.client.action("makemake",buildString+" dostal si "+pointsAdd+" body.");
                }
                else{
                  connection.client.action("makemake",buildString+" dostal si "+pointsAdd+" bodov.");            
                }
              }
             });
          } 

        }

    }

  // else if(message==="!kow"){
  //   var userName=user['display-name'].toLowerCase();
  //   if(userName=="trlxo"){
  //               connection.client.action("makemake","Ame is my kow!");  
  //   } 
  //   else if(userName=="ameindahouse"){
  //               connection.client.action("makemake","Trixo is my kow!");      
  //   }
  //   else{

  //   }
  // }

   else if(message.indexOf("!remove")!=-1){
      var userName=user['display-name'].toLowerCase();
        if(userName=="trlxo"||userName=="makemake"){
          var aMessage=message.split(" ");
          aMessage.shift();
          var buildString="";
          var pointsAdd=aMessage[aMessage.length-1]
          for(var x=0; x<aMessage.length-1; x++){
             var userAdd=aMessage[x].toLowerCase();
             userAdd=userAdd.replace("@","");
             buildString+="@"+userAdd;
             fnDirrectRemovePoints(userAdd,pointsAdd,x,function(data){
              if(data==aMessage.length-2){
                if(pointsAdd==1){
                  connection.client.action("makemake",buildString+" prišiel si o "+pointsAdd+" bod.");
                }
                else if(pointsAdd>1&&pointsAdd<5){
                  connection.client.action("makemake",buildString+" prišiel si o "+pointsAdd+" body.");
                }
                else{
                  connection.client.action("makemake",buildString+" prišiel si o "+pointsAdd+" bodov.");            
                }
              }
             });
          }
        }

    }
  else if(message==="!open"){
      if(fnCommandCountDown==true){
              fnCommandCountDowns();
          console.log(user);
          var userName=user['display-name'].toLowerCase();
        

      fnCreateUserKey(function(openKey){
        var sOpenKey=openKey;
        fnInsertOpenKey(userName,sOpenKey,function(status,openKey){
          if(status===1){
            var sOpenKey=openKey;
            connection.client.whisper(user['display-name'], " http://ec2-52-29-149-136.eu-central-1.compute.amazonaws.com:8080/?user="+sOpenKey);
            connection.client.action("makemake","@"+user['display-name']+" ak ti link neprišiel, nezabudni dať follow tomuto botovi @trixo_bot");
          }
          if(status===2){
            var sOpenKey=openKey;
            connection.client.action("makemake","@"+user['display-name']+" bracho bez followu case-ky neotváraš.");
          }
        });
      });
    }



   }
   else{

   }

    // Do your stuff.
});



//////////////////////////// function defintion////////////////////////////////
function fnAddPointsToAll(points){
 console.log(points);
 var aNamesForPoints=[];
  fnGetViewers("makemake",function(data){
    fnAddPoints(data,function(index,detail){
      if(detail==null){
      }
      else{
       aNamesForPoints.push(detail.twitch_name);
      }
      if(index=="all"){
        fnAddPointsGlobal(aNamesForPoints,points,function(results){
        })
      }
    });
  });

}

function fnCommandCountDowns(){
fnCommandCountDown=false;
setTimeout(function(){
fnCommandCountDown=true;
},5000)
}

function fnInsertOpenKey(userName,openKey,cb){
  var sUserName=userName;
  var sOpenKey=openKey;
  var status=0;
  db.query('SELECT * FROM `users` WHERE twitch_name="'+sUserName+'"', function (error, results, fields) {
      if(results && results.length){
        // if is in database

        if(results[0].open_key===""){
          // update wtih key
          status=1;
          fnUpdateOpenKey(sUserName,sOpenKey);
          cb(status,sOpenKey);
        }
        else{
          //send same key
          status=1;
          cb(status,results[0].open_key);
        }
      }
      else{
        status=2;
          cb(status,"");
      }

  });
}
function fnUpdateOpenKey(userName,key){
  sOpenKey=key;
  sUserName=userName;
  var sql="UPDATE `users` SET open_key='"+sOpenKey+"' WHERE twitch_name='"+sUserName+"';";
  db.query(sql, function (error, results, fields) {
      if (error) throw error;
  });
}
// create random key
function fnCreateUserKey(cb){
  crypto.randomBytes(15, (err, buf) => {
    var openKey=buf.toString('hex');
    db.query('SELECT * FROM `users` WHERE open_key="'+openKey+'"', function (error, results, fields) {
      if(results && results.length){
        fnCreateUserKey();
      }
      else{
        cb(openKey);
      }
  });
    
  });
}

function fnCheckPoints(userName,cb){
  var twitch_name=userName.toLowerCase();
  var sql="SELECT * FROM users WHERE twitch_name='{{twitch_name}}';";
    sql=sql.replace("{{twitch_name}}", twitch_name);

    db.query(sql, function (error, results, fields) {
      var status=0;
      if(results && results.length){
        status=1;
      }
      else{
        status=2;
      }
      cb(results,status);
    });

}
function fnInsertPoints(names,cb){
  var aTwitchNames=names;
  // if(aTwitchNames.length>1){
  //  aTwitchNames.pop();
  // }
  for(var i=0; i<aTwitchNames.length; i++){
    var sql="UPDATE `users` SET `points`=points+2,`minutes_watched`=minutes_watched+2.5 WHERE twitch_name='{{twitch_name}}'";
    //var sql="INSERT IGNORE INTO `users`(`twitch_id`, `twitch_name`, `follow_date`, `points`, `points_spend`, `is_subscriber`, `is_follower`, `steam_id`, `minutes_watched`) VALUES ({{twitch_id}},'{{twitch_name}}','{{date}}',100,0,0,1,'',0);";
    var date=fnGetDate();
    sql=sql.replace("{{twitch_name}}", aTwitchNames[i]);

    db.query(sql, function (error, results, fields) {
      if (error) throw error;
      cb(results);
    });
  }
}


function fnAddPointsGlobal(names,points,cb){
  var aTwitchNames=names;
  var iNumberOfPoints=points;
  // if(aTwitchNames.length>1){
  //  aTwitchNames.pop();
  // }
  for(var i=0; i<aTwitchNames.length; i++){
    var sql="UPDATE `users` SET `points`=points+{{points}} WHERE twitch_name='{{twitch_name}}'";
    //var sql="INSERT IGNORE INTO `users`(`twitch_id`, `twitch_name`, `follow_date`, `points`, `points_spend`, `is_subscriber`, `is_follower`, `steam_id`, `minutes_watched`) VALUES ({{twitch_id}},'{{twitch_name}}','{{date}}',100,0,0,1,'',0);";
    var date=fnGetDate();
    sql=sql.replace("{{twitch_name}}", aTwitchNames[i]);
    sql=sql.replace("{{points}}", iNumberOfPoints);

    db.query(sql, function (error, results, fields) {
      if (error) throw error;
      cb(results);
    });
  }
}


function fnAddPoints(names,cb){
  var aTwitchNames=names;
  //aTwitchNames=["zachrancatv","alexinho_svk"];
  for(var i=0; i<aTwitchNames.length; i++){
    fnIsUserNameInDatabase(aTwitchNames[i],i,function(index,detail){
      if(index<aTwitchNames.length){
        if(index==aTwitchNames.length-1){
          index="all";
        }
        cb(index,detail);
      }
    })
  }
  
}
function fnGetViewers(twitch_name,cb){
  var twitch_name=twitch_name;
  var sUrl="https://tmi.twitch.tv/group/user/"+twitch_name+"/chatters";

  var options = {
      method: 'GET',  
      headers: {      
        'Client-ID': sClientId,
        'Accept': 'application/vnd.twitchtv.v5+json'
      },
      rejectUnauthorized: true
    };
  request(sUrl,options
    , function (err, data) {
      if (err){

  }
      data=JSON.parse(data);
      cb(data.chatters.viewers);
  })
}

function fnDirrectAddPoints(userAdd,pointsAdd,x,cb){
    var sql="UPDATE `users` SET `points`=points+{{pointsAdd}},`minutes_watched`=minutes_watched+2.5 WHERE twitch_name='{{twitch_name}}'";
    sql=sql.replace("{{twitch_name}}",userAdd);
    sql=sql.replace("{{pointsAdd}}",pointsAdd);
    db.query(sql, function (error, results, fields) {
      if (error){}
        else{
                cb(x)
        }

    });

}

function fnDirrectRemovePoints(userAdd,pointsAdd,x,cb){
    var sql="UPDATE `users` SET `points`=points-{{pointsAdd}},`minutes_watched`=minutes_watched+2.5 WHERE twitch_name='{{twitch_name}}'";
    sql=sql.replace("{{twitch_name}}",userAdd);
    sql=sql.replace("{{pointsAdd}}",pointsAdd);
    db.query(sql, function (error, results, fields) {
      if (error){}
        else{
                cb(x)
        }
    });

}


// check if stream is online
function fnIsStreamOnline(twitch_id,cb){
  var stream_id=twitch_id;
  var sUrl="https://api.twitch.tv/kraken/streams?channel="+stream_id;

  var options = {
      method: 'GET',  
      headers: {      
        'Client-ID': sClientId,
        'Accept': 'application/vnd.twitchtv.v5+json'
      },
      rejectUnauthorized: true
    };
  request(sUrl,options
    , function (err, data) {
      if (err){

  }
      data=JSON.parse(data);
      cb(data);
  })
}
// gets current follower list
function fnGetLatestFollowerList(){
aNewFollowerList=[];
 var options = {
    method: 'GET',  
    headers: {      
      'Client-ID': sClientId,
      'Accept': 'application/vnd.twitchtv.v5+json'
    },
    rejectUnauthorized: true
  };


request('https://api.twitch.tv/kraken/channels/131875000/follows?limit=100',options
, function (err, data) {
  if (err) throw err
  data=JSON.parse(data);
  // the JSON result 
  for(var i=0; i<data.follows.length; i++){
    aNewFollowerList.push(data.follows[i].user.display_name);// new followers from twitch api

  }
    
      
    fnCompareFollowers(aNewFollowerList);
  
    

});

}



function fnGetUserFromDatabase(){
  db.query('SELECT * FROM `users` ORDER BY user_id DESC LIMIT 100', function (error, results, fields) {
    if (error) throw error;
    for(var i=0; i<results.length; i++){
      aFollowerList.push(results[i].twitch_name);

    }
   

  });

}


function fnCompareFollowers(newFollowerList){
  var aRecentFollowers=[];
  var aRecentSize=[];
  var aInsertToDatabase=[];
  var aUpdateName=[];

  for(var i=0; i<newFollowerList.length; i++){
    var sFollowerName=newFollowerList[i];
    sFollowerName=sFollowerName.toLowerCase();
      fnIsUserNameInDatabase(sFollowerName,i,function(index,jUserDetail){

        var iCurrentIndex=index;
        iInsertFollowerController++
        if(jUserDetail==null){
          // name is not in database
          aRecentFollowers.push(newFollowerList[iCurrentIndex]);
        
        }
         if(jUserDetail!=null){

          // name is  in database
        }

        if(iInsertFollowerController==100){
          iCurrentIndex=0;
          fnIsUserIdInDatabase(aRecentFollowers,function(userinfo,twitch_id,userName,done){

            var jUserDetail=userinfo;
            var sTwitchId=twitch_id;
            var sUserName=userName;
            var iDone=done;
            aRecentSize.push(iDone);
  
            if(jUserDetail==null){
            // id is not in database-->insert to database
            aInsertToDatabase.push(sUserName);
            }
            if(jUserDetail!=null){
            aUpdateName.push(sTwitchId);
          // id is in database--> update name
            }
            if(aRecentFollowers.length==aRecentSize.length){
              fnUpdateUserName(aUpdateName,function(){

              });
              fnBeforeInsertNewFollowers(aInsertToDatabase);

              //cleaning

                aRecentFollowers=[];
                aRecentSize=[];
                aInsertToDatabase=[];
                aUpdateName=[];
                iInsertFollowerController=0;
                aFollowerList=[];
            }
          });
      //      checked all
           iInsertFollowerController=0;
       }
      });

  }
  

}
function fnBeforeInsertNewFollowers(recentfollowers){
  var aRecentFollowers=recentfollowers;
    if (Array.isArray(aRecentFollowers) && aRecentFollowers.length) {
  // array does not exist, is not an array, or is empty
    aRecentFollowers=aRecentFollowers.reverse();
    fnInsertNewFollowers(aRecentFollowers);
        var sNewFollowers=aRecentFollowers;
        if(sNewFollowers.length==1){
          connection.client.action("makemake", "Nový follower @"+sNewFollowers);
        }
        else{
          sNewFollowers=sNewFollowers.join(" @");
          connection.client.action("makemake", "Noví followeri @"+sNewFollowers);
        }
        
      
    }
  else{
  }
}
function fnInsertNewFollowers(newFollowerList){
  var aNewFollowers=newFollowerList;
  for(var i=0; i<aNewFollowers.length; i++){
   var jUserData= fnGetUserData(aNewFollowers[i],i,"",function(data,i){
    var sUsername=data.users[0].display_name;
    var sUserTwitchId=data.users[0]._id;
    fnInsertFollowerToDatabase(sUserTwitchId,sUsername);

   });

  }

}

function fnInsertFollowerToDatabase(twitch_id,twitch_name){
  var twitch_name=twitch_name.toLowerCase();
  var sql="INSERT IGNORE INTO `users`(`twitch_id`, `twitch_name`, `follow_date`, `points`, `points_spend`, `is_subscriber`, `is_follower`, `steam_id`, `minutes_watched`) VALUES ({{twitch_id}},'{{twitch_name}}','{{date}}',100,0,0,1,'',0);";
  var date=fnGetDate();
  sql=sql.replace("{{twitch_id}}", twitch_id);
  sql=sql.replace("{{date}}", date);
  sql=sql.replace("{{twitch_name}}", twitch_name);

  db.query(sql, function (error, results, fields) {
    console.log(results);
    if (error) throw error;
  });

}
function fnIsUserIdInDatabase(userNames,cb){
  var aUserNames=userNames;
  var iDone=0;
  for(var i=0; i<aUserNames.length; i++){
    
    fnGetUserData(aUserNames[i],i,iDone,function(userResult,index,userName,done){
    var sUsername=userName;
    var iDone=index;
    var sUserTwitchId=userResult.users[0]._id;
    var sql="SELECT * FROM users WHERE twitch_id='"+sUserTwitchId+"';";
      db.query(sql, function (error, results, fields) {
        if (error) throw error;
        var jUserDetail=results[0];
        
       
      cb(jUserDetail,sUserTwitchId,userName,iDone);
      });

    });

    }
  

}

function fnIsUserNameInDatabase(userName,index,cb){
  var sUserName=userName;
  var iCurrentIndex=index;
  var sql="SELECT * FROM users WHERE twitch_name='"+sUserName+"';";
    db.query(sql, function (error, results, fields) {
      if (error) throw error;
      var jUserDetail=results[0];
    cb(iCurrentIndex,jUserDetail);
    });

}


function fnGetDate(){
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();

  newdate = year + "-" + month + "-" + day;
  return newdate;
}

function fnGetUserData(userName,index,done,cb){
  var sUserName=userName;
  sUserName=sUserName.split(' ').join('')
  var iIndex=index;
  var iDone=done;
  "MrMarkoX "
  var sUrl="https://api.twitch.tv/kraken/users?login="+sUserName+"&client_id="+sClientId;

  var options = {
      method: 'GET',  
      headers: {      
        'Client-ID': sClientId,
        'Accept': 'application/vnd.twitchtv.v5+json'
      },
      rejectUnauthorized: true
    };



request(sUrl,options
  , function (err, data) {
    if (err){

}
    data=JSON.parse(data);
    console.log(data);
  cb(data,iIndex,sUserName,iDone);
  });

}

function fnUpdateUserName(twitch_id){
  var aTwitchId=twitch_id;

  for(var i=0; i<aTwitchId.length; i++){
    var sUrl="https://api.twitch.tv/kraken/users/"+aTwitchId[i];

    var options = {
      method: 'GET',  
      headers: {      
        'Client-ID': sClientId,
        'Accept': 'application/vnd.twitchtv.v5+json'
      },
      rejectUnauthorized: true
    };
    request(sUrl,options
    , function (err, data) {
      if (err){

    }
    data=JSON.parse(data);
    sUserId=data._id;
    sUserName=data.name
    var sql="UPDATE `users` SET twitch_name='"+sUserName+"' WHERE twitch_id='"+sUserId+"';";
    db.query(sql, function (error, results, fields) {
      if (error) throw error;
    });
  });
  }
}
//////////////////////////// function defintion ends////////////////////////////////

