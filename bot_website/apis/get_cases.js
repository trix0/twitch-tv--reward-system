var port = 8000;
var http = require("http");
var crypto = require('crypto');
var xhrRequest = require('xhr-request');
var server = http.createServer();
server.on('request', request);
server.listen(port);
var dbCon=require('../.././trixo_bot/db.js');
var db = dbCon.dbConnection;
var aOpeningAnimation=[];
var refreshBool=false;
db.connect();

function request(request, response) {
    var store = '';

    request.on('data', function(data) 
    {   
        store=data;
        
    });
    request.on('end', function(){
        store=JSON.parse(store);
        console.log(store.fn);
        fnGetDataFromDb(store,function(results){
          store = results;
          response.setHeader("Content-Type", "text/json");
        response.setHeader("Access-Control-Allow-Origin", "*");
       response.end(JSON.stringify(store));
        })
        
    });
 } 

// create random key
function fnCreateUserKey(cb){
  crypto.randomBytes(15, (err, buf) => {
    var openKey=buf.toString('hex');
    db.query('SELECT * FROM `keys` WHERE security_key="'+openKey+'"', function (error, results, fields) {
      if(results.length>0){
        fnCreateUserKey();
      }
      else{
        cb(openKey);
      }
  });
    
  });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

 function fnGetDataFromDb(data,cb){
var func=data.fn;
var jData=data;
    if(func==="getAllCases"){
        var sql="SELECT * FROM cases";
         db.query(sql, function (error, results, fields) {
            var aCasesResult=results;
            fnGetCaseItems(aCasesResult,function(data){
                
               fnGetItemGroups(data,function(){
                    for(var i=0; i<data.length; i++){
                        data[i].items=[];
                    }
                    fnGetItemsLoop(data,function(){
                        
                        fnGetRarity(function(result){
                            data[0].rarity=result;
                            cb(data);//last dataa
                        })
                    })

               });
            }) 
        });

    }
        if(func==="getAllCases_0"){
        var sql="SELECT * FROM cases";
         db.query(sql, function (error, results, fields) {
            var aCasesResult=results;
            fnGetCaseItems(aCasesResult,function(data){
                
               fnGetItemGroups(data,function(){
                    for(var i=0; i<data.length; i++){
                        data[i].items=[];
                    }
                    fnGetItemsLoop_2(data,function(){
                        
                        fnGetRarity(function(result){
                            data[0].rarity=result;
                            cb(data);//last data
                        })
                    })

               });
            }) 
        });

    }
    if(func==="openCase"){
        if(jData.secret!=null){
            fnCheckUserEnoughPoints(jData.secret,jData.caseId,function(data){
                cb(data);
            });
        }
        else{
            cb("userNotFound");
        }
    }
    if(func==="getUserInfo"){
        fnGetUserInfo(jData.secret,function(data){
            cb(data);
        });

        
    }
    if(func==="getReturnPrices"){
        fnGetReturnPrices(function(data){
            cb(data);
        });

        
    }
    if(func==="return-item"){
            
            fnReturnItem(jData,function(returnResult){
                cb(returnResult);
            }); 
    }
    if(func==="take-item"){
            
            fnTakeItem(jData,function(takeResult){
               cb(takeResult);
            }); 
    }
    if(func==="animation-green"){
            console.log(jData);
            fnSaveAnimationItems(jData);
           
    }

    if(func==="get-animation-items"){
            fnGetAnimationItems(aOpeningAnimation,function(animProp){
                cb(animProp);
            });
           
    }
    if(func==="refresh-green"){
        fnRefresh();
           
    }
    if(func==="play-knock"){
        fnPlayKnock();
           
    }
    if(func==="play-steps"){
        fnPlaySteps();
           
    }
    if(func==="play-scaryTalk"){
        fnPlayScaryTalk();
           
    }

    if(func==="save-steam-url"){
            fnValidateUser(jData.secret,function(resultValid){
                if(resultValid==true){
                    fnSaveSteamUrl(jData.secret,jData.url,function(data){
                        cb(data);
                    });
                }

            });
            console.log(jData);

    }

}
function fnRefresh(cb){
    aOpeningAnimation.push("restart");
}
function fnPlayScaryTalk(cb){
    aOpeningAnimation.push("playScaryTalk");
}
function fnPlayKnock(cb){
    aOpeningAnimation.push("playKnock");
}
function fnPlayScream(cb){
    aOpeningAnimation.push("playScream");
}
function fnPlaySteps(cb){
    aOpeningAnimation.push("playSteps");
}
function fnGetAnimationItems(array,cb){
    var aItemArray=array;
    if(aItemArray&&aItemArray.length){
        var result=aItemArray[0];
        aOpeningAnimation.shift();
        if(result=="restart"){
            cb("restart");
        }
        else{

        cb(result);
        }
    }
    else{
        cb("empty")
    }

    }

function fnSaveAnimationItems(items){
var jsItems=items;
aOpeningAnimation.push(jsItems);
console.log("done");

}

function fnTakeItem(data,cb){
    var jsonReturnToken=data.token[0];
    fnIsKeyRight(jsonReturnToken.key_id,jsonReturnToken.security_key,function(key_right){
        if(key_right==true){
            fnCopyToTrade(jsonReturnToken.key_id,function(data){
                if(data==true){    
                    fnDeleteFromKeys(jsonReturnToken.key_id,function(deletedata){
                       if(deletedata==true){
                        cb("takeComplete")
                       }  
                    });

                }
            });
        }
        else{

        }
    });

}

function fnSaveSteamUrl(secret,url,cb){
    var sUrl=db.escape(url);
    var sSecret=db.escape(secret);
    var sql="UPDATE `trixobottwitch`.`users` SET `steam_id` ={{sUrl}} WHERE `open_key` = {{secret}};";

    sql=sql.replace("{{sUrl}}", sUrl);
    sql=sql.replace("{{secret}}", sSecret);
        console.log(sql);
    db.query(sql, function (error, results, fields) {
        cb(true);
    });

}

function fnReturnItem(data,cb){
    var jsonReturnToken=data.token[0];
    console.log(jsonReturnToken.key_id);
    fnIsKeyRight(jsonReturnToken.key_id,jsonReturnToken.security_key,function(key_right){
        if(key_right==true){
            fnCopyToHistory(jsonReturnToken.key_id,function(data){
                if(data==true){
                    fnDeleteFromKeys(jsonReturnToken.key_id,function(deletedata){
                        if(deletedata==true){
                            fnPlusQuantity(jsonReturnToken.item_id,function(plusreturn){
                                if(plusreturn==true){
                                    fnSelectItemFromDatabase(jsonReturnToken.item_id,function(databaseItem){
                                        console.log(databaseItem);
                                        fnGetReturnPrices(function(returnPrices){
                                            console.log(returnPrices);
                                            for(var x=0; x<returnPrices.length; x++){
                                                console.log(x);
                                                if(returnPrices[x].return_id==databaseItem[0].return_id){
                                                    fnAddUserPoints(jsonReturnToken.user_id,returnPrices[x].return_price,function(pointsBack){
                                                        console.log(pointsBack+"pointsBack");
                                                         cb("returnComplete")
                                                    })
                                                break;
                                                }
                                                
                                            }
                                        });
                                    });
                                }
                             });    
                        }
                    })
                    
                }
            });
        }
        else{

        }
    });

}
function fnSelectItemFromDatabase(item_id,cb){
    var sql="SELECT * FROM items WHERE item_id='{{item_id}}';";
    sql=sql.replace("{{item_id}}", item_id);
    db.query(sql, function (error, results, fields) {
        cb(results);
    });
}

function fnDeleteFromKeys(key_id,cb){
var sql="DELETE FROM `trixobottwitch`.`keys`\
WHERE key_id='{{key_id}}';";
sql=sql.replace("{{key_id}}", key_id);
db.query(sql, function (error, results, fields) {
    cb(true);
});
}



function fnCopyToTrade(key_id,cb){
    var sql="    INSERT INTO `trixobottwitch`.`keys_trade`\
(`key_id`,\
`security_key`,\
`user_id`,\
`case_id`,\
`item_id`,\
`sell`)\
SELECT `keys`.`key_id`,\
    `keys`.`security_key`,\
    `keys`.`user_id`,\
    `keys`.`case_id`,\
    `keys`.`item_id`,\
    `keys`.`sell`\
FROM `trixobottwitch`.`keys`where key_id ={{key_id}};";
sql=sql.replace("{{key_id}}", key_id);
db.query(sql, function (error, results, fields) {
    cb(true);
});

}


function fnCopyToHistory(key_id,cb){
    var sql="    INSERT INTO `trixobottwitch`.`keys_history`\
(`key_id`,\
`security_key`,\
`user_id`,\
`case_id`,\
`item_id`,\
`sell`)\
SELECT `keys`.`key_id`,\
    `keys`.`security_key`,\
    `keys`.`user_id`,\
    `keys`.`case_id`,\
    `keys`.`item_id`,\
    `keys`.`sell`\
FROM `trixobottwitch`.`keys`where key_id ={{key_id}};";
sql=sql.replace("{{key_id}}", key_id);
db.query(sql, function (error, results, fields) {
    cb(true);
});

}

function fnIsKeyRight(key_id,security_key,cb){
    //var security_key ="68286b1ad2b5fdaa49f6bc572825b2";
    var sql="SELECT * FROM trixobottwitch.`keys` WHERE key_id='{{key_id}}' and security_key='{{security_key}}';";

    sql=sql.replace("{{security_key}}", security_key);  
    sql=sql.replace("{{key_id}}", key_id);  
    db.query(sql, function (error, results, fields) {
        var response=results;
        response.push("asd");
        if(response.length==1){
           
            cb(false);
            
        }
        if(response.length==2){
           cb(true); 
        }
        cb(results);
    })  
}

function fnGetReturnPrices(cb){
    var sql="SELECT * FROM return_prices;";
         db.query(sql, function (error, results, fields) {
            cb(results);
         })
}
function fnGetUserInfo(secret,cb){
    var sUserSecret=secret;
var sql="SELECT * FROM users WHERE open_key='"+sUserSecret+"'";
         db.query(sql, function (error, results, fields) {
            cb(results);
         })

}

function fnValidateUser(secret,cb){
    var sUserSecret=db.escape(secret);
    console.log(sUserSecret);
var sql="SELECT * FROM users WHERE open_key="+sUserSecret;
console.log(sql);
         db.query(sql, function (error, results, fields) {
            cb(results);
            var response=results;
            response.push("asd");
            if(response.length==1){
                  cb(false);
            }
            else{
                cb(true);
            }
         })

}

function fnGetCaseInfo(caseId,cb){
    var iCaseId=caseId;
    var sql="SELECT * FROM cases WHERE case_id='"+iCaseId+"'";
         db.query(sql, function (error, results, fields) {
            cb(results);
         })       
}
function fnCheckUserEnoughPoints(secret,caseId,cb){
    var sUserSecret=secret;
    var iCase=caseId;
    var iUserId;
    fnGetUserInfo(sUserSecret,function(data){
            iUserId=data[0].user_id;
            fnGetCaseInfo(iCase,function(result){
                if(data[0].points<result[0].case_price){
                    console.log("not enough points");
                    var response=0;
                    cb(response);
                }
                else{
                     var response=1;
                    
                    price=result[0].case_price;
                    fnBuyCase(iUserId,iCase,price,function(doneline){
                        cb(doneline);
                    });

                }
            });
        });
}

function fnBuyCase(userid,caseId,price,doneline){
var iUserId=userid;
var iCaseId=caseId;
var iPrice=price;
var fn={};
var aCase;
var iCount=0;
var iHigerChance=0;
var jChances=[];
fn.fn="getAllCases";
    fnGetDataFromDb(fn,function(data){
        for(var i=0; i<data.length; i++){
            if(data[i].case_id==iCaseId){
                aCase=data[i];
                iCount++;
                break;
            }
        }  
        if(iCount==1){
            fnCheckForDecimals(aCase.itemGroups,function(data){
                var iMultiplier=+data;
                for(var x=0; x<aCase.itemGroups.length; x++){
                var aCurrentGroup=aCase.itemGroups[x];
                var iCurrentNumber=aCurrentGroup[0].item_group_drop_chance*iMultiplier;
                //if(x==0){iCurrentNumber=iCurrentNumber-1}
                var iCurrentGroupId=aCurrentGroup[0].item_group_id;
                iHigerChance+=iCurrentNumber;
                var jsonCreation={"groupId":iCurrentGroupId,"chanceStart":iHigerChance-iCurrentNumber+1,"chanceEnds":iHigerChance};
                jChances.push(jsonCreation);
                    if(x==aCase.itemGroups.length-1){
                    console.log(jChances);
                    var iRandomNumber=getRandomInt(jChances[0].chanceStart,jChances[jChances.length-1].chanceEnds);
                    fnPickWinnerItem(jChances,iRandomNumber,function(winnerGroup){
                        fnSelectWinnerGroup(winnerGroup,function(response){
                            fnSelectWinnerItem(response,iUserId,iCaseId,function(winItem,userid,iWithdraw){
                                fnInsertToKeys(iCaseId,userid,winItem,iWithdraw,function(insertData){
                                    console.log(insertData.insertId);
                                    fnSelectKeyId(insertData.insertId,function(result){
                                        fnRemoveUserPoints(userid,iPrice,function(data){
                                            fnAddSpentPoints(userid,iPrice,function(data){
                                                fnMinusQuantity(winItem,function(data){
                                                    doneline(result);
                                                });
                                            });

                                        });

                                     });   
                                });

                            });
                        });
                    });
                    }
                }
            

             });// how many decimals->*10 or *100 
            // continue with calculations
           
        }

    });
}

function fnSelectKeyId(keyid,cb){
    var iKeyId=keyid;
    var sql="SELECT * FROM `keys` WHERE key_id='{{key_id}}';";
    sql=sql.replace("{{key_id}}", iKeyId);
        db.query(sql, function (error, results, fields){
            console.log(results);
            cb(results);
        });
}

function fnMinusQuantity(itemid,cb){
var iItemId=itemid.item_id;
console.log(iItemId+": item id");
var sql="UPDATE `trixobottwitch`.`items` SET `quantity` = quantity-1 WHERE `item_id` = {{iItemId}};";
sql=sql.replace("{{iItemId}}", iItemId);
db.query(sql, function (error, results, fields) {
            cb(results);
        });

}

function fnPlusQuantity(itemid,cb){
var iItemId=itemid;
console.log(iItemId+": item id");
var sql="UPDATE `trixobottwitch`.`items` SET `quantity` = quantity+1 WHERE `item_id` = {{iItemId}};";
sql=sql.replace("{{iItemId}}", iItemId);
db.query(sql, function (error, results, fields) {
            cb(true);
        });

}

function fnPickWinnerItem(chances,randomNumber,cb){
    var ajChances=chances;
    var iRandomNumber=randomNumber;
    var aDrop=ajChances.map(function(data){
        var input=data;
        var iGroupId=input.groupId
        var iStartChance=input.chanceStart;
        var iEndChance=input.chanceEnds;
        var jResponse={"groupId":iGroupId, "status":"win"}
        var jResponseFalse={"groupId":"none", "status":"false"}
        if(iStartChance<=iRandomNumber&&iRandomNumber<=iEndChance){
            return jResponse;
        }
        else{
            return jResponseFalse;
        }

    })
    cb(aDrop);
}
function fnInsertToKeys(iCaseId,userid,winItem,sell,cb){
    var caseId=iCaseId;
    var itemId=winItem.item_id;
    var sql="INSERT INTO `trixobottwitch`.`keys`(`security_key`,`user_id`,`case_id`,`item_id`,`sell`)VALUES('{{security_key}}',{{user_id}},{{case_id}},{{item_id}},{{sell}});";
    fnCreateUserKey(function(userkey){
    sql=sql.replace("{{security_key}}", userkey);
    sql=sql.replace("{{user_id}}", userid);    
    sql=sql.replace("{{case_id}}", caseId);    
    sql=sql.replace("{{item_id}}", itemId);    
    sql=sql.replace("{{sell}}", sell); 
        db.query(sql, function (error, results, fields) {
            console.log(error);
            cb(results,userid,userkey,sell);
        });
    });



}
function fnRemoveUserPoints(userid,changePoints,cb){
    var sUserId=userid;
    var iChangePoints=changePoints;
    var sql="UPDATE `trixobottwitch`.`users` SET`points` = points-{{changePoints}} WHERE `user_id` = {{userid}};";

    sql=sql.replace("{{changePoints}}", iChangePoints); 
    sql=sql.replace("{{userid}}", sUserId); 
        db.query(sql, function (error, results, fields) {
            cb(results);
      
    });
}
function fnAddUserPoints(userid,changePoints,cb){
    var sUserId=userid;
    var iChangePoints=changePoints;
    var sql="UPDATE `trixobottwitch`.`users` SET`points` = points+{{changePoints}} WHERE `user_id` ='{{userid}}';";

    sql=sql.replace("{{changePoints}}", iChangePoints); 
    sql=sql.replace("{{userid}}", sUserId); 
        db.query(sql, function (error, results, fields) {
            cb(true);
      
    });
}

function fnAddSpentPoints(userid,changePoints,cb){
    var sUserId=userid;
    var iChangePoints=changePoints;
    var sql="UPDATE `trixobottwitch`.`users` SET `points_spend` = points_spend+{{changePoints}} WHERE `user_id` = {{userid}};";

    sql=sql.replace("{{changePoints}}", iChangePoints); 
    sql=sql.replace("{{userid}}", sUserId); 
        db.query(sql, function (error, results, fields) {
            cb(results);
      
    });
}
function fnCheckForDecimals(input,cb){
    var aChances=input
    var aAllChances=[];
    var sMultiplier=1;
    for(var x=0; x<aChances.length; x++){
        var iDropChance=aChances[x];
        aAllChances.push(iDropChance[0].item_group_drop_chance);
        if(x==aChances.length-1){
            var aCountDecimals=aAllChances.map(function(t){
                var s=String(t).split(".");
                if(s.length!=1){
                  var iLength=s[1].length;
                  return iLength;  
                }
                else{
                    return 0;
                }
                
            })
            aCountDecimals.sort(function(a, b){return b-a});
            for(var i=0; i<aCountDecimals[0]; i++){
                sMultiplier=sMultiplier+"0";
                if(i==aCountDecimals[0]-1){
                  cb(sMultiplier);  
                }
            }
            
        }
    }
}
function fnGetItemsLoop(cases,cb){
    var aCases=cases;

    for(var i=0; i<aCases.length; i++){
        fnGetItems(aCases[i],i,function(data,repeat){
        for(var i=0; i<data.length; i++){
            var currentData=data[i];
            for(var x=0; x<currentData.length;x++){
                aCases[repeat].items.push(currentData[x]);
            }
            
        }
        
        if(repeat==aCases.length-1){
            cb(aCases)
        }
        })
    }
}

function fnGetItemsLoop_2(cases,cb){
    var aCases=cases;

    for(var i=0; i<aCases.length; i++){
        fnGetItems_2(aCases[i],i,function(data,repeat){
        for(var i=0; i<data.length; i++){
            var currentData=data[i];
            for(var x=0; x<currentData.length;x++){
                aCases[repeat].items.push(currentData[x]);
            }
            
        }
        
        if(repeat==aCases.length-1){
            cb(aCases)
        }
        })
    }
}
function fnGetRarity(cb){

        var sql="SELECT * FROM weapon_rarity";
        db.query(sql, function (error, results, fields) {  
        cb(results);     
        })
}
function fnGetItems(cases,repeat,cb){
    var aCase=cases;
    var repeat=repeat; 
    var aAllGroups=[]; 
    var iCounters=0;
    for(var i=0; i<aCase.itemGroups.length; i++){
        var iItemGroupId=aCase.itemGroups[i];
        iItemGroupId=iItemGroupId[0].item_group_id;
        
        var sql="SELECT *\
                 FROM item_groups_items\
                 LEFT JOIN items  ON \
                 item_groups_items.items_item_id= items.item_id\
                 where item_groups_items.item_groups_item_group_id="+iItemGroupId;
        db.query(sql, function (error, results, fields) {
         
            aAllGroups.push(results)
            iCounters++

            if(iCounters===aCase.itemGroups.length){
            //all
            cb(aAllGroups,repeat);
        }   
        })

         
    }
}

function fnGetItems_2(cases,repeat,cb){
    var aCase=cases;
    var repeat=repeat; 
    var aAllGroups=[]; 
    var iCounters=0;
    for(var i=0; i<aCase.itemGroups.length; i++){
        var iItemGroupId=aCase.itemGroups[i];
        iItemGroupId=iItemGroupId[0].item_group_id;
        
        var sql="SELECT *\
                 FROM item_groups_items\
                 LEFT JOIN items  ON \
                 item_groups_items.items_item_id= items.item_id\
                 where item_groups_items.item_groups_item_group_id="+iItemGroupId+" AND quantity>0;";
        db.query(sql, function (error, results, fields) {
         
            aAllGroups.push(results)
            iCounters++

            if(iCounters===aCase.itemGroups.length){
            //all
            cb(aAllGroups,repeat);
        }   
        })

         
    }
}


function fnSelectWinnerGroup(groupId,cb){
var iGroupId=groupId;
var iWinGroup;
for(var i=0; i<iGroupId.length; i++){
    if(iGroupId[i].status==="win"){
        iWinGroup=iGroupId[i].groupId;
    }
    else{

    }
}
console.log(iWinGroup);
var sql="SELECT *\
                 FROM item_groups_items\
                 LEFT JOIN items  ON \
                 item_groups_items.items_item_id= items.item_id\
                 where (item_groups_items.item_groups_item_group_id="+iWinGroup+" and quantity>0)";
db.query(sql, function (error, results, fields) {
        cb(results); 
        })
}
function fnIsAllowedToWithdraw(groupId,cb){
    var aSellOnlyCases=[1];

    for(var x=0; x<aSellOnlyCases.length; x++){
        if(aSellOnlyCases[x]==groupId){
            cb(0)
            console.log("notwith");
        }
        else{
            cb(1)
            console.log("with");
        }
    }
    
}
function fnSelectWinnerItem(items,userid,caseid,cb){
    var iUserId=userid;
    var iCaseId=caseid;
    var aItems=items;
    var winItem;
   fnIsAllowedToWithdraw(aItems[0].item_groups_item_group_id,function(data){
    var iWithdraw=data;

    if(aItems.length>1){
        var iRandomNumber=getRandomInt(0,aItems.length-1);
        if(iRandomNumber<0){
            fnSelectWinnerItem(aItems,iUserId,iCaseId);
        }
        else{
         winItem=aItems[iRandomNumber];
         cb(winItem,iUserId,iWithdraw);
        }
    }
    else if(aItems.length===1){
        winItem=aItems[0];
        cb(winItem,iUserId,iWithdraw);
    }
    else{
        fnBuyCase(iUserId,iCaseId);
    }

   })

    

}


function fnGetItemGroups(cases,cb){
    var aCases=cases;
    for(var i=0; i<aCases.length; i++){
        fnGetItemGroup(aCases[i],i,function(data,repeat){
            aCases[repeat].itemGroups=data;
            if(repeat==aCases.length-1){
                cb(aCases);
                // send data back to collection
            }
        });
    }
}

function fnGetItemGroup(casek,repeat,cb){
var aCase=casek;
var repeat=repeat;
var aAllGroups=[];
var iCounters=0;
    for(var i=0; i<aCase.caseItems.length; i++){
        var iItemGroupId=aCase.caseItems[i].item_group_id
        var sql="SELECT * FROM item_groups WHERE item_group_id="+iItemGroupId;
        db.query(sql, function (error, results, fields) {
            aAllGroups.push(results)
            iCounters++
            if(iCounters===aCase.caseItems.length){
            //all
            cb(aAllGroups,repeat);
        }   
        })

         
    }

      
}






function fnGetCaseItems(cases,cb){
  var aCasesResult =cases;
  var iCounter=0;
    for(var i=0; i<aCasesResult.length; i++){
        
    var iCaseId=aCasesResult[i].case_id;
    var sql_1="SELECT cs.case_id, casit.case_id, casit.case_item_id, casit.item_group_id, casit.drop_chance \
                FROM `case_items` casit\
                INNER JOIN cases cs ON cs.case_id =  casit.case_id\
                WHERE casit.case_id= "+iCaseId;
        db.query(sql_1, function (error, results, fields) {
            var iCaseIds=results[0].case_id;

            for(var g=0; g<aCasesResult.length; g++){
                if(iCaseIds===aCasesResult[g].case_id){
                    aCasesResult[g].caseItems=results;
                    iCounter++;
                    break;

                }

            }
        if(iCounter==aCasesResult.length){
             cb(aCasesResult);
        }
             
        })
        
    }

}

