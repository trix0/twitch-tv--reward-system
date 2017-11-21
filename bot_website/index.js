
var allItems;


var audioOpen = new Audio('audio/zaciatok_otvorenia.mp3');
var audioEnd = new Audio('audio/koniec_otvorenia.mp3');


$(document).on("click",".button",function(){
	var iClickedId=$(this).parent().parent().attr("data-id");
	fnChangeCases(iClickedId,aCases);
})

$(document).on("click",".open-case",function(){
	var sUserSecret=fnGetElementFromUrl("user");
	var iCaseId=$(".p2").attr("data-caseid");
	fnSendOpenRequst(sUserSecret,iCaseId,function(data){
		fnFindWinItem(data[0].case_id,data[0].item_id,function(winerItem){

			fnConstructItem(winerItem,function(returnHtml){
				fnCreateItemLine(data[0].case_id,allItems,returnHtml,function(builtitems,randomnumbers){
					fnLunchAnimation(builtitems,winerItem,data);
					 fnSendAnimation(randomnumbers,winerItem,data[0].case_id);
						
				});
			})
			
		});
				
	});
})
$(document).ready(function(){
	var sUserSecret=fnGetElementFromUrl("user");
	fnSendWhoRequest(sUserSecret,function(data){

	});
})

function fnSendOpenRequst(secretId,id,cb){
	var sSecret=secretId;
	var iCaseid=id;
	$.ajax
({
  type: "POST",
  url: "http://ec2-52-29-149-136.eu-central-1.compute.amazonaws.com:8000",
  crossDomain:true, 
  dataType: "json",
  data:JSON.stringify({fn: "openCase",secret:sSecret, caseId:iCaseid})
 }).done(function ( data ) {
 	cb(data);

   })
}

function fnSendWhoRequest(secretId,cb){
	var sSecret=secretId;
	$.ajax
({
  type: "POST",
  url: "http://ec2-52-29-149-136.eu-central-1.compute.amazonaws.com:8000",
  crossDomain:true, 
  dataType: "json",
  data:JSON.stringify({fn: "getUserInfo",secret:sSecret})
 }).done(function ( data ) {
 	cb(data);
   })
}

fnGetCasesFromDatabase();
var aCases=[
{id:1,name:"case1"}
];


function fnShowData(){
	for(var i=0; i<=5; i++){
		var id=$(".p"+i).attr("data-id");
		if(id=="1800"){

		}
		else{
			if(aCases[id]!=null||id!=null){
				$(".p"+i+" div > .caseImg").attr('src', 'images/'+aCases[id].case_image);
				$(".p"+i).attr('data-CaseId',aCases[id].case_id );
			}
				
			else{
			}
			
		}
	}
}

function fnGetElementFromUrl(Element){
	var sWindowUrl= window.location.href; //gets current location
	var jVariables={}; //
	var sUrlElement;
	aWindowUrl=sWindowUrl.split("?"); // splits variables from url
	aWindowUrl="&"+aWindowUrl[1]; // adds & to first variable 
	aWindowUrl=aWindowUrl.split("&");	// splits all variables to separated indexes
	aWindowUrl.splice(0,1); 	

	for(i=0;i<aWindowUrl.length; i++){
		aWindow=aWindowUrl[i].split("=");
		jVariables[aWindow[0]] = aWindow[1];
		// creates json from array 
	}
	sUrlElement=jVariables[Element];// find element in json object by name and prints value
	return sUrlElement;
	//var currentWindow= fnGetElementFromUrl("window"); example
}

function fnShowCaseItems(array){
var caseId=$(".p2").attr("data-caseid");
var aCase=array;
var iCaseInPosition=0;
var aCaseProperties=[];
for(var i=0; i<=aCase.length; i++){

	if(aCase[i].case_id==caseId){

		iCaseInPosition=i;
		break;
	}
}



	for(var i=0; i<aCase[iCaseInPosition].itemGroups.length; i++){
		var jTemporary={};
		var aTemporary=aCase[iCaseInPosition].itemGroups[i];
		if(aTemporary[0].group_image!=null){
			jTemporary.image=aTemporary[0].group_image;
			jTemporary.name=aTemporary[0].group_name;
			jTemporary.rarity=2000;
			aCaseProperties.push(jTemporary);
		}
		else{
		 var iTempId=aTemporary[0].item_group_id;
		 aCaseProperties.push(fnTrackItem(iTempId,iCaseInPosition,aCase));
		}
		
	


	}

aCaseProperties=fnShortByRarity(aCaseProperties);

fnShowItems(aCaseProperties);
}

function fnShortByRarity(input){
	var aArrayToSort=input;
	var aArrayOfInt=[];
	var aReturnArray=[];
	for(var i=0; i<aArrayToSort.length;i++){
		aArrayOfInt.push(aArrayToSort[i].rarity);


	}
	aArrayOfInt = aArrayOfInt.sort(sortNumber);
	for(var i=0; i<aArrayOfInt.length; i++){
		for(var x=0; x<aArrayOfInt.length; x++){
			if(aArrayOfInt[i]===aArrayToSort[x].rarity){
				aReturnArray.push(aArrayToSort[x]);
				aArrayToSort[x]="done";
			}
		}
		
	}
	return aReturnArray;
}

function sortNumber(a,b)
{
  return a - b;
}


function fnShowItems(array){
	$(".item-container").empty();
var aPrintItems=array;
var sBluePrint='<div class="item-container-item">\
						 		<div class="item-card">\
						 		<div style="background-color:{{bg-color}}" class="rarity"></div>\
						 		<div class="border"></div>\
						 		<div class="bg"></div>\
						 		<div class="{{name-class}}">{{WeaponName}}</div>\
						 		<img class="" src="{{WeaponImage}}"></div>\
						 		</div>'
	for(var i=0; i<aPrintItems.length; i++){
		var sPrintItem=sBluePrint;
		if(aPrintItems[i]=="done"){
			break;
		}
		else{
			if(aPrintItems[i].name.indexOf("StatTrak")==-1){
				sPrintItem=sPrintItem.replace("{{name-class}}","name");
			}
			else{
				sPrintItem=sPrintItem.replace("{{name-class}}","name-orange");
			}
			sPrintItem=sPrintItem.replace("{{WeaponName}}",aPrintItems[i].name);
			if(aPrintItems[i].image.indexOf("http")!==-1){
			
			sPrintItem=sPrintItem.replace("{{WeaponImage}}",aPrintItems[i].image);
			}
			else{
			sPrintItem=sPrintItem.replace("{{WeaponImage}}","images/"+aPrintItems[i].image);
			}
			sPrintItem=sPrintItem.replace("{{bg-color}}",fnDefineRarityColors(aPrintItems[i].rarity));

			$(".item-container").append(sPrintItem);
		}
	}

}

function fnDefineRarityColors(id){
	var color="";
		switch (id) {  
   case 0: color = 'rgb(175,175,175)'; break;  
   case 1: color = 'rgb(202,171,5)'; break;  
   case 2: color = 'rgb(235,75,75)'; break;  
   case 3: color = 'rgb(211,44,230)'; break;  
   case 4: color = 'rgb(136,71,255)'; break;  
   case 5: color = 'rgb(17,85,221)'; break;  
   case 6: color = 'rgb(135,199,255)'; break;  
   case 7: color = 'rgb(175,175,175)'; break;  

   default: color = 'rgb(178, 255, 0)';
   
	}
	return color;
}
function fnTrackItem(itemid,caseInArray,array){
var aCase=array;
var iItemId=itemid;
var iCaseInPosition=caseInArray;
var jTemporary={};
for(var i=0; i<aCase[iCaseInPosition].items.length; i++){
	var aCasePosition=aCase[iCaseInPosition].items[i];
	if(aCasePosition.item_groups_item_group_id==iItemId){
		jTemporary.image=aCasePosition.item_image;
		jTemporary.name=aCasePosition.item_name;
		jTemporary.rarity=aCasePosition.weapon_rarity_id;
		break;

	}
	else{
	}
	
}
return jTemporary;
}

function fnGetCasesFromDatabase(){
$.ajax
({
  type: "POST",
  url: "http://ec2-52-29-149-136.eu-central-1.compute.amazonaws.com:8000",
  crossDomain:true, 
  dataType: "json",
  data:JSON.stringify({fn: "getAllCases_0"})
 }).done(function ( data ) {
 			allItems=data;
 			for(var x=0; x<allItems.length; x++){
 				allItems[x].itemGroups.map(function(data){
 					data[0].item_group_drop_chance=0;
 				})
 			}

      aCases=data;
      fnCreateCases(aCases);
      fnChangeCases(0,aCases);
      fnShowData();
      fnShowCaseItems(aCases);
   })
}


function fnChangeCases(ids,array){
	var aCases=array;
var id=parseInt(ids);
fnChangeP0(id-2);
fnChangeP1(id-1);
fnChangeP2(id);
fnChangeP3(id+1,aCases);
fnChangeP4(id+2,aCases);
fnReload();
fnShowData();
fnShowCaseItems(aCases);
}

function fnChangeP0(id){
var iId=parseInt(id);
	if(iId<0){
		$(".p0").attr("data-id","1800");
	}
	else{
		$(".p0").attr("data-id",iId);
	}
}
function fnChangeP1(id){
var iId=parseInt(id);
	if(iId<0){
		$(".p1").attr("data-id","1800");
	}
	else{
		$(".p1").attr("data-id",iId);
	}
}
function fnChangeP2(id){
var iId=parseInt(id);
	if(iId<0){
		$(".p2").attr("data-id","1800");
	}
	else{
		$(".p2").attr("data-id",iId);
	}
}
function fnChangeP3(id,cases){
var iId=parseInt(id);
	if(iId>=cases.length){
		$(".p3").attr("data-id","1800");
	}
	else{
		$(".p3").attr("data-id",iId);
	}
}
function fnChangeP4(id,cases){
var iId=parseInt(id);
	if(iId>=cases.length){
		$(".p4").attr("data-id","1800");
	}
	else{
		$(".p4").attr("data-id",iId);
	}
}







function fnCreateCases(array){
	var aCase=array;
	if(aCase.length==2){
		$(".p4").attr("data-id","1800");
	}
	else{
		$(".p4").attr("data-id",2);
	}
		if(aCase.length==1){
		$(".p3").attr("data-id","1800");
	}
	else{
		$(".p3").attr("data-id",2);
	}
$(".p0").css("visibility","hidden");
$(".p1").css("visibility","hidden");
$(".p2").attr("data-id",0);
$(".p3").attr("data-id",1);

fnReload();
}


function fnReload(){
var p0=$(".p0").attr("data-id");
var p1=$(".p1").attr("data-id");
var p2=$(".p2").attr("data-id");
var p3=$(".p3").attr("data-id");
var p4=$(".p4").attr("data-id");

	if(p0==1800){
		$(".p0").css("visibility","hidden");
		}
	else{
		$(".p0").css("visibility","visible");
	}

	if(p1==1800){
		$(".p1").css("visibility","hidden");
		}
	else{
		$(".p1").css("visibility","visible");
	}

	if(p2==1800){
		$(".p2").css("visibility","hidden");
		}
	else{
		$(".p2").css("visibility","visible");
	}

	if(p3==1800){
		$(".p3").css("visibility","hidden");
		}
	else{
		$(".p3").css("visibility","visible");
	}

	if(p4==1800){
		$(".p4").css("visibility","hidden");
		}
	else{
		$(".p4").css("visibility","visible");
	}


}

/// animation


function fnLunchAnimation(input,winitem,winToken){
	$(".case-select-area").empty();
	$(".case-select-area").html(input).promise().done(function(){
	    fnIAnimation();
	var pointer=0;
	    fnEndSound(function(data){
	    	if(pointer==0){
	    		pointer++;
	    	fnClearContainer("container");
				fnWinItemsOptions(winitem,winToken);
				}
	    });
	    //fnTrackMargin();
	});
}

function fnCreateItemLine(caseid,aItems,input,cb){
	//var iCaseId=caseid;
	//var iWinItem=winItem;

	for(var u=0; u<aItems.length; u++){
		if(caseid==aItems[u].case_id){
			aItems=aItems[u].items;
			break;
		}
	}
	var aRandomNumbers=[];
	var htmlItems="";
	for(var x=0; x<=50; x++){
		var iRandomNumber=getRandomInt(0,aItems.length-1);
		aRandomNumbers.push(iRandomNumber);
	}
	for(var y=0; y<aRandomNumbers.length; y++){
		if(y==46){
			htmlItems+=input;
		}
		else{
			var number=aRandomNumbers[y]
			var aPrintItems=aItems[number];


			var sBluePrint='<div class="item-container-item">\
						 		<div class="item-card">\
						 		<div style="background-color:{{bg-color}}" class="rarity"></div>\
						 		<div class="border"></div>\
						 		<div class="bg"></div>\
						 		<div class="{{name-class}}">{{WeaponName}}</div>\
						 		<img class="" src="{{WeaponImage}}"></div>\
						 		</div>'

				var sPrintItem=sBluePrint;
			    if(aPrintItems.item_name.indexOf("StatTrak")==-1){
					sPrintItem=sPrintItem.replace("{{name-class}}","name");
				}
				else{
					sPrintItem=sPrintItem.replace("{{name-class}}","name-orange");
				}
				sPrintItem=sPrintItem.replace("{{WeaponName}}",aPrintItems.item_name);
				if(aPrintItems.item_image.indexOf("http")!==-1){
				
				sPrintItem=sPrintItem.replace("{{WeaponImage}}",aPrintItems.item_image);
				}
				else{
				sPrintItem=sPrintItem.replace("{{WeaponImage}}","images/"+aPrintItems.item_image);
				}
				sPrintItem=sPrintItem.replace("{{bg-color}}",fnDefineRarityColors(aPrintItems.weapon_rarity_id));

			htmlItems+=sPrintItem;
		}
	}

	var htmlBase='<div class="animation">\
										<div class="animation-bg"></div>\
										<div class="animation-svetlo"></div>\
										<div class="animation-palicka"></div>\
										<div class="animation-border"></div>\
										<div class="animation-items">\
										{{animationitems}}\
										</div>\
								</div>';
 htmlBase=htmlBase.replace("{{animationitems}}",htmlItems);

cb(htmlBase,aRandomNumbers);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fnFindWinItem(caseid,itemid,cb){
	var aAllCases=allItems;
	var iCaseId=caseid;
	var iItemId=itemid;
	for(var x=0; x<aAllCases.length; x++){
		if(aAllCases[x].case_id==iCaseId){
			var aItemsArray=aAllCases[x].items;
			for(var y=0; y<aItemsArray.length; y++){
				if(aItemsArray[y].item_id==iItemId){
					cb(aItemsArray[y]);
				}
			}
			break;
		}
	}

}

function fnConstructItem(item,cb){
	var oItem=item;
var sPrintItem='<div class="item-container-item win-item-here">\
						 		<div class="item-card">\
						 		<div style="background-color:{{bg-color}}" class="rarity"></div>\
						 		<div class="border"></div>\
						 		<div class="bg"></div>\
						 		<div class="name">{{WeaponName}}</div>\
						 		<img class="" src="{{WeaponImage}}"></div>\
						 		</div>'

		sPrintItem=sPrintItem.replace("{{WeaponName}}",oItem.item_name);
		if(oItem.item_image.indexOf("http")!==-1){
		
		sPrintItem=sPrintItem.replace("{{WeaponImage}}",oItem.item_image);
		}
		else{
		sPrintItem=sPrintItem.replace("{{WeaponImage}}","images/"+oItem.item_image);
		}
		sPrintItem=sPrintItem.replace("{{bg-color}}",fnDefineRarityColors(oItem.weapon_rarity_id));
		cb(sPrintItem);
}

function fnIAnimation(){
var boxOne = document.getElementsByClassName('animation-items')[0];
setTimeout(function(){
       boxOne.classList.add('animation-items-anim'); }, 500);
			 audioOpen.play();


}

function fnEndSound(cb){
	var boxOne = document.getElementsByClassName('animation-items')[0];
	var interval= setInterval(function(){
		if($(boxOne).css('margin-left')=="-7130px"){
			setTimeout(function(){
				audioEnd.play();
				cb("here");
				clearInterval(interval);
			},1000)


		}
	},50)
}

// function fnTrackMargin(){
// 	var boxOne = document.getElementsByClassName('animation-items')[0];
// 	setInterval(function(){
// 	console.log($(boxOne).css('margin-left'));
// 	},1)

// }
function fnClearContainer(input){
	$("."+input).html("");
}

function fnWinItemsOptions(winItem,winToken){
	var returnPrice;
	fnGetReturnPrices(function(data){
		for(var x=0; x<data.length; x++){
			if(data[x].return_id==winItem.return_id){
				returnPrice=data[x].return_price;
			}
		}
			var htmlBlueprint='<div class="case-result-container">\
		<div class="case-result">\
		<div style="\
    position: absolute;\
    bottom: 50px;\
    overflow: unset;\
    color: white;\
">V prípade vrátenia itemu ti bude pripísaný počet bodov: {{returnPrice2}}</div>\
			<div class="case-result-itemname">{{itemname}}</div>\
			<div class="case-result-image">\
				<img class="" src="{{itemimage}}">\
			</div>\
			<div class="case-result-bg"></div>\
			<div class="case-result-buttons">\
				<div class="{{tokenbroken-class}}"><img data-func="take-item" class="buttons" src="{{takebroken}}"></div>\
				<div class="case-result-return"><img data-func="return-item" class="buttons" src="design/return_button.png">\
							<div class="case-result-return-price">({{returnPrice}})</div>\
				</div>\
			</div>\
		</div>\
	</div>';
	htmlBlueprint=htmlBlueprint.replace("{{itemname}}",winItem.item_name);
	htmlBlueprint=htmlBlueprint.replace("{{tokenbroken-class}}","case-result-take");
	htmlBlueprint=htmlBlueprint.replace("{{takebroken}}","design/take_button.png");
	htmlBlueprint=htmlBlueprint.replace("{{tokenbroken-class}}",winToken.item_image);
	htmlBlueprint=htmlBlueprint.replace("{{itemimage}}",winItem.item_image);
		htmlBlueprint=htmlBlueprint.replace("{{returnPrice}}",returnPrice);
		htmlBlueprint=htmlBlueprint.replace("{{returnPrice2}}",returnPrice);
	$(".appender").append(htmlBlueprint)
	fnCreateClicks(winToken);

})
}
function fnGetReturnPrices(cb){
	$.ajax
	({
	  type: "POST",
	  url: "http://ec2-52-29-149-136.eu-central-1.compute.amazonaws.com:8000",
	  crossDomain:true, 
	  dataType: "json",
	  data:JSON.stringify({fn: "getReturnPrices"})
	 }).done(function ( data ) {
	cb(data);
	   })
	
}

function fnCreateClicks(winToken){
 $(".buttons").on("click",function(e) {
       var func= 	$(this).attr("data-func");


 $.ajax
	({
	  type: "POST",
	  url: "http://ec2-52-29-149-136.eu-central-1.compute.amazonaws.com:8000",
	  crossDomain:true, 
	  dataType: "json",
	  data:JSON.stringify({fn: func, token:winToken})
	 }).done(function ( data ) {

				if(data=="returnComplete"){
					fnReturnMessage();
				}
				if(data=="takeComplete"){
					fnTake();
				}

	   })
    });



}

function fnTake(){
	var sUserSecret=fnGetElementFromUrl("user");
	fnSendWhoRequest(sUserSecret,function(data){
		var userData=data;
		if(userData[0].steam_id==""){
			fnSteamUrlInsert();
		}
		else{
			fnTakeMessage();
		}


	});

}

function fnReturnMessage(){
	$(".case-result-itemname").text("Body sme pripísali na tvoj účet brácho.");
	$(".case-result-buttons").empty();
	setTimeout(function(){
		location.reload();
	},3000);
}

function fnTakeMessage(){
	$(".case-result-itemname").text("Tvoju výhru dostaneš po streame.");
	$(".case-result-buttons").empty();
	setTimeout(function(){
		location.reload();
	},3000);
}


function fnSteamUrlInsert(){



var htmlBlueprint='<div class="case-result-container">\
		<div class="case-result">\
			<div class="case-result-itemname">Vlož svoj SteamTradeUrl brácho.</div>\
			<div class="case-result-itemname"><input type="text" class="steam-trade-url"></div>\
			<div class="case-result-bg"></div>\
			<div class="case-result-buttons">\
				<div class="case-result-return"><img data-func="save-url" class="buttons save-button" src="design/save_button.png">\
				</div>\
			</div>\
		</div>\
	</div>';
	fnClearContainer("appender");
		$(".appender").append(htmlBlueprint);

		 $(".save-button").on("click",function(e) {
       var func= 	$(this).attr("data-func");

       if(func=="save-url"){
       		if($(".steam-trade-url").val().indexOf("https://steamcommunity.com/tradeoffer")!=-1){
       				

       			fnSaveUserSteamUrl($(".steam-trade-url").val());
       			fnTakeMessage();

       		}
       		else{
       			alert("Vlož tvoj steamtradeUrl/Insert Steam TRade URL");
       		}
       	}
     });

}

function fnSaveUserSteamUrl(url){
	var sUrl=url;
		var sUserSecret=fnGetElementFromUrl("user");
			$.ajax
		({
		 type: "POST",
		 url: "http://ec2-52-29-149-136.eu-central-1.compute.amazonaws.com:8000",
		crossDomain:true, 
		dataType: "json",
		 data:JSON.stringify({'fn': "save-steam-url",'secret':sUserSecret,'url':sUrl})
		}).done(function ( data ) {
			cb(data);
		})
}

function fnSendAnimation(numbers,winItem,caseid){
var aRandomNumbers=numbers;
var sWinItem=winItem;

		$.ajax
			({
			 type: "POST",
			 url: "http://ec2-52-29-149-136.eu-central-1.compute.amazonaws.com:8000",
			crossDomain:true, 
			dataType: "json",
			 data:JSON.stringify({'fn': "animation-green",'numbers':aRandomNumbers,'win_item':sWinItem,'caseid':caseid})
			}).done(function ( data ) {
				cb(data);
		})
}