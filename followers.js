
var aNewFollowerList=[ 
  'yopqo',
  'Kahayag',
  'ZachrancaTV',
  'faun3007',
  'gabrielka_32',
  'RdoCM',
  'pepsijebordel',
  'Patrikos666',
  'domik53xd',
  'alexinho_svk',
  'outboundtax34439',
  'davidko1123',
  'drbosk',
  'AutistaFofko',
  'simoncahoj',
  'mirkodust9',
  'TachyoN4',
  'turtlespurples',
  'rejdoou',
  'clumsyteddybear',
  'lisiacik123',
  'nigasgang',
  'tupec2212',
  'dalko_svk',
  'Gurus15',
  'TheGangasYT',
  'Sparo_D',
  'botis55',
  'pr0vos',
  'radiss_77',
  'dominikbartos',
  'gulynko',
  'mnemuk24',
  'suffone',
  'subaruismylife',
  'jurajqo123',
  'PaN2001',
  'MoNKeY178official',
  'oimaov2',
  'kolac_nou_fejk',
  'yesko3',
  'kikorada',
  'Nasyna',
  '09kost09',
  'pan_medvidek',
  'FiFoGameTV',
  'Florianoksd',
  'ErkkoKiller',
  'Waziicek',
  'thehardric',
  'feelsshark',
  'Jakubcooler1',
  'barkerino76',
  'iMichalK',
  'lllritualgameslll',
  'kubes2365',
  'casper_28',
  'ezisfoglalt',
  'Legendaris4',
  'AdrianaSVK',
  'h1benny',
  'LenuliQ777',
  '4mazonis',
  '0_cyr3x_0',
  'Picnyvytok123',
  'Backucc',
  'Arradiel2',
  'Starkills21',
  'pa3k791',
  'Smilleyko',
  'skila18',
  'Lakiluk157',
  'r_kd0',
  'raidenxxlead',
  'nuri689',
  'ahorben',
  'Trolic18',
  'iannisCZ',
  'didlifon',
  'tomik28',
  're4zon',
  'hydral1',
  'Vallran_',
  'nate_svk',
  'rastiiiiiiik',
  'hacemos',
  'poligon133',
  'cigisvk',
  'YoLoALcaTraZ',
  'denko111111',
  'TRlXO',
  'denisjr111',
  'Trix321',
  'romanholahlavamoravcik',
  'jassebii',
  'zipko123123',
  'michael31900',
  'mino_2',
  'RamonBengal1995',
  'gago75',
  'blekdeni',
  'qweeecko',
  'jokl_lr',
  'rolandiik',
  'kikoss_sk',
  'milanostv',
  's1mplz',
  'arciusko',
  'matuuuus',
  'epikos123',
  'haribko11' ];



  

  var sql="INSERT INTO `users`\
  (`{{twitch_id}}`, `{{twitch_name}}`, `follow_date`, `points`, `points_spend`,\
   `is_subscriber`, `is_follower`, `steam_id`, `minutes_watched`) \
  VALUES ([value-2],[value-3],'2017-06-07',100,0,0,1,'',0)";

   

  for(var i=0; i<aNewFollowerList.length; i++){
    var returnSql=sql;
    var sUrl="https://api.twitch.tv/kraken/users?login="+aNewFollowerList[i]+"&client_id=23yai1ktgs6slqezfq88sqqrixjn77";
  var misko = {
    url: sUrl,
    method: 'GET',
    headers: {      
      'Client-ID': "23yai1ktgs6slqezfq88sqqrixjn77",
      'Accept': 'application/vnd.twitchtv.v5+json'
    }
  };
  $.getJSON( misko , function( jData ){
    console.log();
    returnSql=returnSql.replace("{{twitch_id}}", jData.users[0]._id);
    returnSql=returnSql.replace("{{twitch_name}}", aNewFollowerList[i]);
    console.log(returnSql);
    });
  }

