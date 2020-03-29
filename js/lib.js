link = {
	online: 'https://l2-corona-api.adeptio.cc/apiv1/getOnline',
	getUserInfo: 'https://l2-corona-api.adeptio.cc/apiv1/getUserInfo?account=',
	getAdeptioUserInfo: 'https://l2-corona-api.adeptio.cc/apiv1/getAdeptioUserInfo?account=',
	getUserMoneyCount: 'https://l2-corona-api.adeptio.cc/apiv1/getUserMoneyCount?account=',
	getMoneyCount: 'https://l2-corona-api.adeptio.cc/apiv1/getMoneyCount?charId=',
	getAdeptioPrice : 'https://l2-corona-api.adeptio.cc/apiv1/getCryptoPrices'
}

$(document).ajaxError(function myErrorHandler(event, xhr, ajaxOptions, thrownError) {
	//console.log(event.target);
	//console.log(event.target.activeElement);
	$('form').find('button').removeAttr('disabled');
  response(xhr.responseText + ' - ' + btoa(ajaxOptions.url));
});

function adenaToAdeptio(count) {
	return parseFloat(count / 10000).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function adena(count) {
	return parseFloat(count).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}


function adeptioToUSD(id, count) {
	var usd = count / 10000;
	var btc = count / 100000000;
	$.getJSON(link.getAdeptioPrice, function( data ) {
	if(data.data)
		var adeptioPrice = data.data[0];
		var bitcoinPrice = data.data[1];
		total = (adeptioPrice * bitcoinPrice)
		usd = parseFloat(count * total).toFixed(4).replace(/\d(?=(\d{3})+\.)/g, '$&,');
		btc = parseFloat(count *  adeptioPrice).toFixed(8).replace(/\d(?=(\d{3})+\.)/g, '$&,');
		$(id).html('$ ' + usd + ' USD or ' +  '<img src="images/Bitcoin.png" height="24" width="24">' + ' ' + btc + ' BTC');
	});
}

function getPage(el,scroll) 
{
	var link = getLink(el);

	$.get(link, function( data ) {
	  putContent(data);
	  $(el).attr("loading", "false");
	});

	changeUrl(link);

	if(scroll)
		$('html, body').animate({
	        scrollTop: $('#content').offset().top
	    }, 1000);
}

function getLink(el) 
{
	if(!el) return

	if(typeof el === 'object')
		el = $(el).attr('href');

	return el;
}

function putContent(data) 
{
	removeChilds('main.content', ['media-block','feature-block']);
	$('main.content').prepend(data);
	afterUpdate();
}

function removeChilds(el, leave) 
{
	$(el).children().each(function () {
		var attr = $(this).attr('class');
    	if(leave.indexOf(attr) < 0)
    		$(this).remove();
	});
}

function changeUrl(link) 
{
	//window.history.pushState('page2', 'Title', link);
}

function submitForm(el) 
{
	response('Loading, please wait...');

	$(el).find('button').attr('disabled','disabled');

	$.ajax({
		dataType: "json",
	    url: getAction(el),
	    timeout: 120 * 1000,
	    success: function(data)
		{
			$(el).find('button').removeAttr('disabled');

			if ( typeof replaceAccountInfo === 'function' ) { 
				replaceAccountInfo();
			}
			
			if( data.data.SUCCESS ) {
				response("Success: " + data.data.SUCCESS);
				return;
			}

			if(formValue(el, 'account') && data.data.length > 0) {
				logined(formValue(el, 'account'));
				return;
			}

			response("Error: ", data);

			var resFunc = radioAttr(el.action, 'response');

			if( resFunc )
				window[resFunc](data);
		}
	});
}

function getAction(el) 
{
	var action = el.action;

 	if(radioValue(action, 'clicked'))
 		action = radioValue(action, 'clicked');

 	return action + '?' + getActionSerialize(el);
}

function getActionSerialize(el) 
{
	var values, index;

	// Get the parameters as an array
	values = $(el).serializeArray();

	// Find and replace `content` if there
	for (index = 0; index < values.length; ++index) 

	    values[index].value = changeFormValue(values[index].name, values[index].value);

	// Convert to URL-encoded string
	return jQuery.param(values);
}

function changeFormValue(name, value) 
{
	if (name == "account" && !value)
		return Cookies.get('account'); 

	if (name == "token")
		return sha1ToBase64(value);

	return value;
}

function sha1ToBase64(string) 
{
	var hash= sha1(string);

	if (hash.length % 2) 
		hash= "0"+ hash;

	hash = hash.replace(/[a-f0-9][a-f0-9]/g, function (c, i) { return String.fromCharCode(parseInt(c, 16)) });

	return btoa(hash);
}

function depositAdeptioResponse(data) {
	if(typeof data.data !== 'string')
		return;

	var wlt = data.data;

	$("#depositAdeptioWallet").html(wlt);
	$("#depositAdeptioWalletInput").parent().removeClass("d-none");
	$("#depositAdeptioWalletInput").val(wlt);
	$("#depositAdeptioCount").parent().removeClass("d-none");
	$("#depositAdeptiowlt").val(wlt);
	$("#depositAdeptio").addClass("d-none");
	$("#depositAdeptioApproval").removeClass("d-none");

	response("Deposit wallet addr: " + wlt);
}

function withdrawAdeptioResponse(data) {
	if(typeof data.data !== 'string')
		return;

	var tx = data.data;

	response("Your withdrawal is successful. Here is your transaction id: " + tx);
}

function logined(data) 
{
	Cookies.set('account', data);
	getPage('cp.html');
	loginMenu();
}

function response(text, data) {
	$('.page-content .alertResponse').remove();
	$('.page-content').prepend($("#alertResponse").clone());
	$('.page-content .alertResponse').html(text);
	$('.page-content .alertResponse').append(getError(data));
}

function getError(data) 
{
	if(!data)
		return;

	if( data.data ) 
	{
		var error = "Not found";

		if( data.data.ERROR )
			error = data.data.ERROR;
			
		return error;
	}

	if( data.message ) 
		return data.message;
}

function radioValue(radioNodeList, attr) {
	if(typeof radioNodeList === 'string')
		return false;
	for (var i = radioNodeList.length - 1; i > -1; i--) {
		if ($(radioNodeList[i]).attr(attr)) {
			return radioNodeList[i].value;
		}
	}
	return false;
}

function radioAttr(radioNodeList, attr) {
	if(typeof radioNodeList === 'string')
		return false;
	for (var i = radioNodeList.length - 1; i > -1; i--) {
		if ($(radioNodeList[i]).attr(attr)) {
			return $(radioNodeList[i]).attr(attr);
		}
	}
	return false;
}

function formValue(el, name) {
	 return $(el).find('input[name="'+name+'"]').val();
}

function loginMenu() {
	var account = Cookies.get('account');
	$("#login").html("");
	if(account)
		$("#login").html('<a href="/cp.html">'+account+'</a>');
	else
		$("#login").append( $("#loginMenu").clone() );
}

function logout() {
	Cookies.remove('account');
	checkLogin();
}

function checkLogin() {
	if(Cookies.get('account'))
		return true;
	getPage('login.html');
	loginMenu();
}

function makeTable(table, data) {
	$(table).html("");
	$(table).append("<thead></thead>");
	$(table).append("<tbody></tbody>");

    var thead = $(table).find("thead");
	var tbody = $(table).find("tbody");

	var columns = {};

	$.each(data, function(i, row) {
	  var tr = $('<tr>');
	  $.each(row, function(key, value) {
	  	columns[key] = key;
	    $('<td>').html(value).appendTo(tr);
	  });
	  tbody.append(tr);
	});

	  var tr = $('<tr>');
	  $.each(columns, function(key, value) {
	    $('<th>').html(value).appendTo(tr);
	  });
	  thead.append(tr);
}

function changeOnline(el) 
{
	var online = "<span>Online</span>";
	var offline = "<span>Offline</span>";
	var end = " Players";

	//$(el).html(online + '159' + end);
	$(el).html(online + '?' + end);

	$.getJSON(link.online, function( data ) {
		if(data.data)
			$(el).html(online + (data.data.length + 7 + 1) + end);
	});
}

function setAdeptioPrice(el) {
	first = '10 000 Adena = '

	$(el).html(first);

	$.getJSON(link.getAdeptioPrice, function( data ) {
		if(data.data)
			var adeptioPrice = data.data[0];
			var bitcoinPrice = data.data[1];
			total = (adeptioPrice * bitcoinPrice)
			result = '$ ' + parseFloat(total).toFixed(8).replace(/\d(?=(\d{3})+\.)/g, '$&,');
			$(el).html(first + result);
	});
}

function getUserInfo(table) 
{
	if(!Cookies.get('account'))
		return;

	$.getJSON(link.getUserInfo + Cookies.get('account'), function( data ) {
		if(data.data)
			makeTable(table, data.data);
	});
}

function getAdeptioUserInfo(adeptio, usd) {
	if(!Cookies.get('account'))
		return;

	$.getJSON(link.getAdeptioUserInfo + Cookies.get('account'), function( data ) {
		var count = 0;

		if(data.data && data.data[0].balance)
			count = data.data[0].balance;

		changeFormat = parseFloat(count).toFixed(1).replace(/\d(?=(\d{3})+\.)/g, '$&,');

		$(adeptio).html(changeFormat);
		adeptioToUSD(usd, count);
	});
}

function getUserMoneyCount(adena, adeptio) {
	if(!Cookies.get('account'))
		return;

	$.getJSON(link.getUserMoneyCount + Cookies.get('account'), function( data ) {
		var count = 0;
		
		if(data.data)
			count = data.data;
		
		changeFormat = parseFloat(count).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

		$(adena).html(changeFormat);
		$(adeptio).html(adenaToAdeptio(count));
	});
}

function changeSelectAccount(select) 
{
	if(!Cookies.get('account'))
		return;

	$.getJSON(link.getUserInfo + Cookies.get('account'), function( data ) 
	{
		$(select).html("");
		if(data.data)
			$.each(data.data, function(i, row) 
			{
			  $(select).append('<option value="'+row.charId+'">'+row.char_name+'</option>');
			});
	});
}

function sha1(str) {
  //  discuss at: https://locutus.io/php/sha1/
  // original by: Webtoolkit.info (https://www.webtoolkit.info/)
  // improved by: Michael White (https://getsprink.com)
  // improved by: Kevin van Zonneveld (https://kvz.io)
  //    input by: Brett Zamir (https://brett-zamir.me)
  //      note 1: Keep in mind that in accordance with PHP, the whole string is buffered and then
  //      note 1: hashed. If available, we'd recommend using Node's native crypto modules directly
  //      note 1: in a steaming fashion for faster and more efficient hashing
  //   example 1: sha1('Kevin van Zonneveld')
  //   returns 1: '54916d2e62f65b3afa6e192e6a601cdbe5cb5897'

  var hash
  try {
    var crypto = require('crypto')
    var sha1sum = crypto.createHash('sha1')
    sha1sum.update(str)
    hash = sha1sum.digest('hex')
  } catch (e) {
    hash = undefined
  }

  if (hash !== undefined) {
    return hash
  }

  var _rotLeft = function (n, s) {
    var t4 = (n << s) | (n >>> (32 - s))
    return t4
  }

  var _cvtHex = function (val) {
    var str = ''
    var i
    var v

    for (i = 7; i >= 0; i--) {
      v = (val >>> (i * 4)) & 0x0f
      str += v.toString(16)
    }
    return str
  }

  var blockstart
  var i, j
  var W = new Array(80)
  var H0 = 0x67452301
  var H1 = 0xEFCDAB89
  var H2 = 0x98BADCFE
  var H3 = 0x10325476
  var H4 = 0xC3D2E1F0
  var A, B, C, D, E
  var temp

  // utf8_encode
  str = unescape(encodeURIComponent(str))
  var strLen = str.length

  var wordArray = []
  for (i = 0; i < strLen - 3; i += 4) {
    j = str.charCodeAt(i) << 24 |
      str.charCodeAt(i + 1) << 16 |
      str.charCodeAt(i + 2) << 8 |
      str.charCodeAt(i + 3)
    wordArray.push(j)
  }

  switch (strLen % 4) {
    case 0:
      i = 0x080000000
      break
    case 1:
      i = str.charCodeAt(strLen - 1) << 24 | 0x0800000
      break
    case 2:
      i = str.charCodeAt(strLen - 2) << 24 | str.charCodeAt(strLen - 1) << 16 | 0x08000
      break
    case 3:
      i = str.charCodeAt(strLen - 3) << 24 |
        str.charCodeAt(strLen - 2) << 16 |
        str.charCodeAt(strLen - 1) <<
      8 | 0x80
      break
  }

  wordArray.push(i)

  while ((wordArray.length % 16) !== 14) {
    wordArray.push(0)
  }

  wordArray.push(strLen >>> 29)
  wordArray.push((strLen << 3) & 0x0ffffffff)

  for (blockstart = 0; blockstart < wordArray.length; blockstart += 16) {
    for (i = 0; i < 16; i++) {
      W[i] = wordArray[blockstart + i]
    }
    for (i = 16; i <= 79; i++) {
      W[i] = _rotLeft(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1)
    }

    A = H0
    B = H1
    C = H2
    D = H3
    E = H4

    for (i = 0; i <= 19; i++) {
      temp = (_rotLeft(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff
      E = D
      D = C
      C = _rotLeft(B, 30)
      B = A
      A = temp
    }

    for (i = 20; i <= 39; i++) {
      temp = (_rotLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff
      E = D
      D = C
      C = _rotLeft(B, 30)
      B = A
      A = temp
    }

    for (i = 40; i <= 59; i++) {
      temp = (_rotLeft(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff
      E = D
      D = C
      C = _rotLeft(B, 30)
      B = A
      A = temp
    }

    for (i = 60; i <= 79; i++) {
      temp = (_rotLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff
      E = D
      D = C
      C = _rotLeft(B, 30)
      B = A
      A = temp
    }

    H0 = (H0 + A) & 0x0ffffffff
    H1 = (H1 + B) & 0x0ffffffff
    H2 = (H2 + C) & 0x0ffffffff
    H3 = (H3 + D) & 0x0ffffffff
    H4 = (H4 + E) & 0x0ffffffff
  }

  temp = _cvtHex(H0) + _cvtHex(H1) + _cvtHex(H2) + _cvtHex(H3) + _cvtHex(H4)
  return temp.toLowerCase()
}


// Used to show countdown

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function startTime() {
    var today = Math.floor(Date.now() / 1000)
    var destination = 1585332000000
    
	var d = Math.abs(destination - new Date().getTime()) / 1000;                 // delta
	    var r = {};                                                                // result
	    var s = {                                                                  // structure
	        year: 31536000,
	        month: 2592000,
	        week: 604800, // uncomment row to ignore
	        day: 86400,   // feel free to add your own row
	        hour: 3600,
	        minute: 60,
	        second: 1
	    };

	    Object.keys(s).forEach(function(key){
	        r[key] = Math.floor(d / s[key]);
	        d -= r[key] * s[key];
	    });

	d = JSON.stringify(r['day'])
	h = JSON.stringify(r['hour'])
	m = JSON.stringify(r['minute'])
	s = JSON.stringify(r['second'])

	// for example: {year:0,month:0,week:1,day:2,hour:34,minute:56,second:7}

	//if (destination > today) {
	//	document.getElementById('countdown').innerHTML = '<button type="button" class="btn btn-danger">' + '<h2>' +  'Grand opening in: ' + d + ' days : ' + h + 'h : ' + m + 'm : ' + s + 's' + '<h2>' + '</button>'
	//} else	{
		document.getElementById('countdown').innerHTML = '<button type="button" class="btn btn-danger" id="countdownbtn">' + '<h2>' +  'Online since 2020-03-27. Join now!' + '<h2>' + '</button>'
	//}
    

    let t = setTimeout(function() {
    	$("#countdownbtn").click()
        startTime()
    }, 1000);
}