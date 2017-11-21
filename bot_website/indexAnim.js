
var allItems;

fnGetOpeningProperties();
var audioOpen = new Audio('audio/zaciatok_otvorenia.mp3');
var audioKnock = new Audio('audio/knock.mp3');
var audioCtSteps = new Audio('audio/steps.mp3');
var audioEnd = new Audio('audio/koniec_otvorenia.mp3');
var audioScream = new Audio('audio/scream.mp3');
var audioScaryTalk = new Audio('audio/scarytalk.mp3');
fnGetCasesFromDatabase();
var aCases=[
{id:1,name:"case1"}
];





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
//console.log(iItemId);
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
      aCases=data;
      console.log(aCases);

   })
}


function fnLunchAnimation(input,winitem,winToken){
	$(".case-select-area").empty();
	  $( ".case-select-area" ).css("display", "flex");

			$(".case-select-area").html(input).promise().done(function(){
				//$(".case-select-area").fadeIn( "slow", function() {
  				fnIAnimation();
					var pointer=0;
			    fnEndSound(function(data){
			    	if(pointer==0){
			    		pointer++;
			    		setTimeout(function(){
			    		//$(".case-select-area").fadeOut()( "slow", function() {
			    			fnClearContainer("case-select-area");
			    		//});

			    		},3000)
			    
			    	//fnWinItemsOptions(winitem,winToken);
						}
			    });
			    //fnTrackMargin();
			//});

  				});

	
}

function fnWinItemsOptions(winItem,winToken){

			var htmlBlueprint='<div class="case-result-container-anim">\
		<div class="case-result">\
			<div class="case-result-itemname">{{itemname}}</div>\
			<div class="case-result-image">\
				<img class="" src="{{itemimage}}">\
			</div>\
		</div>\
	</div>';
	htmlBlueprint=htmlBlueprint.replace("{{itemname}}",winItem.item_name);
	htmlBlueprint=htmlBlueprint.replace("{{itemimage}}",winItem.item_image);
	$(".appender").append(htmlBlueprint);
	setTimeout(function(){
		fnClearContainer("appender");
	},5000);

}

function fnCreateItemLine(input,random,items,cb){
	var aItems=items;
	//var iCaseId=caseid;
	//var iWinItem=winItem;
	var aRandomNumbers=random;
	var htmlItems="";

	for(var y=0; y<aRandomNumbers.length; y++){
		if(y==46){
			htmlItems+=input;
		}
		else{
			var number=aRandomNumbers[y]
			var htmlBlueprint=aItems[number];
			htmlItems+=htmlBlueprint;
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
					console.log(aItemsArray[y].item_id);
					cb(aItemsArray[y]);
				}
			}
			break;
		}
	}

}
function fnShowItems(array,cb){
	$(".item-container").empty();
var aPrintItems=array;
var htmlAll=[];
var sBluePrint='<div class="item-container-item">\
						 		<div class="item-card">\
						 		<div style="background-color:{{bg-color}}" class="rarity"></div>\
						 		<div class="border"></div>\
						 		<div class="bg"></div>\
						 		<div class="name">{{WeaponName}}</div>\
						 		<img class="" src="{{WeaponImage}}"></div>\
						 		</div>'
	for(var i=0; i<aPrintItems.length; i++){
		var sPrintItem=sBluePrint;
		sPrintItem=sPrintItem.replace("{{WeaponName}}",aPrintItems[i].name);
		if(aPrintItems[i].image.indexOf("http")!==-1){
		
		sPrintItem=sPrintItem.replace("{{WeaponImage}}",aPrintItems[i].image);
		}
		else{
		sPrintItem=sPrintItem.replace("{{WeaponImage}}","images/"+aPrintItems[i].image);
		}
		sPrintItem=sPrintItem.replace("{{bg-color}}",fnDefineRarityColors(aPrintItems[i].rarity));
		htmlAll.push(sPrintItem);
		
	}
	cb(htmlAll);
}


function fnShowCaseItems(array,caseid,cb){
var caseId=caseid;
var aCase=array;
var iCaseInPosition=0;
var aCaseProperties=[];
for(var i=0; i<=aCase.length; i++){

	if(aCase[i].case_id==caseId){

		iCaseInPosition=i;
		break;
	}
}



	for(var i=0; i<aCase[iCaseInPosition].items.length; i++){
		var jTemporary={};
		var aTemporary=aCase[iCaseInPosition].items[i];
			jTemporary.image=aTemporary.item_image;
			jTemporary.name=aTemporary.item_name;
			jTemporary.rarity=aTemporary.weapon_rarity_id;
			aCaseProperties.push(jTemporary);

		
	


	}

console.log(aCaseProperties);
cb(aCaseProperties);

//fnShowItems(aCaseProperties);

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

setTimeout(function(){
	var boxOne = document.getElementsByClassName('animation-items')[0];
       boxOne.classList.add('animation-items-anim'); }, 500);
			 audioOpen.play();


}

function fnEndSound(cb){
	var boxOne = document.getElementsByClassName('animation-items')[0];
	var interval= setInterval(function(){
		if($(boxOne).css('margin-left')=="-7130px"){
			setTimeout(function(){

			//	audioEnd.play();
				console.log("do");
				cb("here");
				clearInterval(interval);
			},1000)


		}
	},50)
}


function fnClearContainer(input){
	$("."+input).html("");
}


function fnGetOpeningProperties(){
	var interCheckInterval=setInterval(function(){
			$.ajax
		({
		 type: "POST",
		 url: "http://ec2-52-29-149-136.eu-central-1.compute.amazonaws.com:8000",
		crossDomain:true, 
		dataType: "json",
		 data:JSON.stringify({'fn': "get-animation-items"})
		}).done(function ( data ) {
			console.log(data);
			if(data=="empty"){
				// nothing
			}
			else if(data=="restart"){
				location.reload(true);
			}

			else if(data=="playKnock"){
				audioKnock.play();
			}
			else if(data=="playSteps"){
				audioCtSteps.play();
			}
			else if(data=="playScream"){
				audioScream.play();
			}
			else if(data=="playScaryTalk"){
				audioScaryTalk.play();
			}
			else{
				// run anim
				fnConstructItemLine2(data.numbers,allItems,data.win_item,data.caseid);
			}
		})

	},20000)
}

function fnConstructItemLine2(numbers,cases,winItem,caseid){

	fnShowCaseItems(cases,caseid,function(data){

		fnShowItems(data,function(streturn){
						
			//console.log(streturn);
			

			fnConstructItem(winItem,function(returnHtml){
				fnCreateItemLine(returnHtml,numbers,streturn,function(line,asd){
					console.log(line);
					fnLunchAnimation(line,winItem,"aa");
				});
			});
		});

		
	});



}





// $.ajax
// 		({
// 		 type: "POST",
// 		 url: "http://ec2-52-29-149-136.eu-central-1.compute.amazonaws.com:8000",
// 		crossDomain:true, 
// 		dataType: "json",
// 		 data:JSON.stringify({'fn': "refresh-green"})
// 		})
// $.ajax
// 		({
// 		 type: "POST",
// 		 url: "http://ec2-52-29-149-136.eu-central-1.compute.amazonaws.com:8000",
// 		crossDomain:true, 
// 		dataType: "json",
// 		 data:JSON.stringify({'fn': "play-scaryTalk"})
// 		})