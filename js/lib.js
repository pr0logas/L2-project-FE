link = {
	online: 'https://l2-corona-api.adeptio.cc/apiv1/getOnline',
	getUserInfo: 'https://l2-corona-api.adeptio.cc/apiv1/getUserInfo?account=',
	getAdeptioUserInfo: 'https://l2-corona-api.adeptio.cc/apiv1/getAdeptioUserInfo?account=',
	getUserMoneyCount: 'https://l2-corona-api.adeptio.cc/apiv1/getUserMoneyCount?account=',
	getMoneyCount: 'https://l2-corona-api.adeptio.cc/apiv1/getMoneyCount?charId=',
	getAdeptioPrice : 'https://l2-corona-api.adeptio.cc/apiv1/getCryptoPrices',
	getPlayersInfo: 'https://l2-api.adeptio.cc/apiv1/getInfo',
	getWealth: 'https://l2-api.adeptio.cc/apiv1/getWealth',
	getClansInfo: 'https://l2-api.adeptio.cc/apiv1/getClans'
}

$(document).ajaxError(function myErrorHandler(event, xhr, ajaxOptions, thrownError) {
	//console.log(event.target);
	//console.log(event.target.activeElement);
	if( $('body').attr('loading-page') === 'true' ) 
	{
		getPage('home.html');
		return true;
	}
	$('form').find('button').removeAttr('disabled');
  response(xhr.responseText + ' - ' + btoa(ajaxOptions.url));
});

function adeRatio() {
	return 10000;
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
			//$('.modal').modal('hide');

			$(el).find('button').removeAttr('disabled');

			if ( typeof replaceAccountInfo === 'function' ) { 
				replaceAccountInfo();
			}
			
			if( data.data && data.data.SUCCESS ) {
				response("Success: " + data.data.SUCCESS);
				return;
			}

			//if( getAction(el).indexOf("getUserInfo") >= 0 && data.data )

			if(formValue(el, 'account') && ((data.data && data.data.length >= 0) || data.WARN)) {
				logined(formValue(el, 'account'), data.WARN);
				return;
			}

			response("Error: ", data);

			var resFunc = radioAttr(el.action, 'response');

			if( resFunc )
				window[resFunc](data);
		}
	});
}

function withdrawAdeptioResponse(data) {
	if(typeof data.data !== 'string')
		return;

	var tx = data.data;

	response("Your withdrawal is successful. Here is your transaction id: " + tx);
}

function changeOnline(el) 
{
	var online = '<i class="fas fa-circle text-success"></i> <span class=" font-weight-bold"> Online</span> <span class="text-brown">(Since 2020 03 27)</span></div><div class="col-4 text-right">';
	var start = '<div class="row"><div class="col-8 ">';
	var end = " Players</div></div>";

	//$(el).html(online + '159' + end);
	$(el).html(start + online + '?' + end);

	$.getJSON(link.online, function( data ) {
		if(data.data)
			$(el).html(start + online + (data.data.length) + end);
	});
}

function depositAdeptioResponse(data) {
	if(typeof data.data !== 'string')
		return;

	var wlt = data.data;

	//$("#depositAdeptioWallet").html(wlt);
	$("#depositAdeptioWalletInput").parent().removeClass("d-none");
	$("#depositAdeptioWalletInput").val(wlt);
	$("#depositAdeptioCount").parent().removeClass("d-none");
	$("#depositAdeptiowlt").val(wlt);
	$("#depositAdeptio").addClass("d-none");
	$("#depositAdeptioApproval").removeClass("d-none");

	response("Deposit wallet addr: " + wlt);
}

function replaceTableTh(value) 
{
	if(value==='account_name')
		return 'Account Name';

	if(value==='charId')
		return 'ID';

	if(value==='char_name')
		return 'Name';

	if(value==='level')
		return 'Level';

	if(value==='onlinetime')
		return 'Online Time';

	if(value==='pvpkills')
		return 'Kills';

	if(value==='clan_name')
		return 'Clan';

	if(value==='classid')
		return 'Profession';

	if(value==='hasCastle')
		return 'Has Castle';

	if(value==='leader_id')
		return 'Leader';

	if(value==='reputation_score')
		return 'Reputation';

	if(value==='ally_name')
		return 'Ally Name';

	return value;
}

function getError(data) 
{
	if(!data)
		return;

	if( data.message ) 
		return data.message;

	var error = "";

	if( data.WARN ) 
		error = data.WARN;

	if( data.ERROR ) 
		error = data.ERROR;

	if( data.data && data.data.ERROR )
		error = data.data.ERROR;

	if( error ) 
		return error;

	if( data.data ) 
		return "Not found";
}

function USDandBTCformat(usd, btc) {
	//return '$ ' + usd + ' USD or ' +  '<img src="/images/Bitcoin.png" height="24" width="24">' + ' ' + btc + ' BTC';
	return btc + ' BTC';
}

function replaceTableTd(key, value) 
{
	if(key==='onlinetime')
		return secondsToHms(value,true);

	if(key==='classid')
		return setProff(value);

	if(key==='castleid')
		return setCastle(value);

	if(key==='clan_name' && !value)
		return '-';

	return value;
}

function adenaToAdeptio(count) {
	return numberWithSpaces(round(count / adeRatio(), 0));
}

function adena(count) {
	return round(count, 2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function loginMenu() {
	var account = Cookies.get('account');
	var login = $("#login");
	var login_menu = $("#loginMenu").clone();
	var account_menu = $("#accountMenu").clone();

	login.html("");
	account_menu.find('a').html(account);

	if(account)
		login.html( account_menu );
	else
		login.append( login_menu );
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

function isLogged() {
	if(Cookies.get('account'))
		return true;
	return false;
}

function adeptioToUSD(id, count) {
	var usd = count / 10000;
	var btc = count / 100000000;
	$.getJSON(link.getAdeptioPrice, function( data ) {
	if(data.data)
		var adeptioPrice = data.data[0];
		var bitcoinPrice = data.data[1];
		total = (adeptioPrice * bitcoinPrice)
		usd = round(count * total, 4).replace(/\d(?=(\d{3})+\.)/g, '$&,');
		btc = round(count *  adeptioPrice, 8).replace(/\d(?=(\d{3})+\.)/g, '$&,');
		$(id).html(USDandBTCformat(usd, btc));
	});
}

function changeFormValue(name, value) 
{
	if (name == "account" && !value)
		return Cookies.get('account'); 

	if (name == "token")
		return sha1ToBase64(value);

	return value;
}

function logined(data, newone) 
{
	Cookies.set('account', data)
	Cookies.set('newone', newone);
	getPage('cp.html');
	loginMenu();
}

function response(text, data) {
	$('#alert-message .alertResponse').remove();
	$('#alert-message').prepend($("#alertResponse").clone());
	$('#alert-message .alertResponse').html(text);
	$('#alert-message .alertResponse').append(getError(data));
	$('#alert-message').removeClass('d-none');
}

function getPage(el,scroll) 
{
	var link = getLink(el);

	$('body').attr("loading-page", "true");

	$.get(link, function( data ) {
	  putContent(data);
	  changeBackground(link);
	  $(el).attr("loading", "false");
	  $('body').attr("loading-page", "false");
	});

	changeUrl(link);

	if(!isHome(link)) 
	{
		$("#header-menu").remove();
		$(".f-menu").remove();
	}

	$('#alert-message').addClass('d-none');

	/*if(scroll)
		$('html, body').animate({
	        scrollTop: $('#content').offset().top
	    }, 1000);*/
}

function putContent(data) 
{
	removeChilds('main.content', ['media-block']);
	$('main.content').prepend(data);
	afterUpdate();
}

function isHome(link) {
	return link === 'home.html' || link === '/home.html' || link === '' || link === '/';
}

function changeBackground(link) 
{
	var main = $("main#content").parent();
	if( isHome(link) ) 
	{
		$("body").removeClass("body-dark").removeClass("body-started");
		$("body").addClass("body-general");
		main.removeClass("wrapper");
		return;
	}
	 if( !main.hasClass("wrapper") ){
	    main.addClass("wrapper");
	 }
	if( link === '/getstarted.html' || link === 'getstarted.html' ) 
	{
		$("body").removeClass("body-dark").removeClass("body-general");
		$("body").addClass("body-started");
		return;
	}
	$("body").removeClass("body-general").removeClass("body-started");
	$("body").addClass("body-dark");
}

function currentPath() 
{
	return window.location.pathname;
}

function getLink(el) 
{
	if(!el) 
	{
		var path = currentPath();

		if( path.indexOf("/page/") < 0 ) 

			return '/home.html';

		path = path.replace("/page/", "");
		el = '/'+path+'.html';
	}

	if(typeof el === 'object')
		el = $(el).attr('href');

	if( el.indexOf("/") < 0 )
		el = '/' + el;

	if( el.indexOf("/cp.html") >= 0 && !isLogged() )
		el = '/login.html';

	return el;
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
	link = link.replace("/", "");
	link = link.replace(".html", "");
	link = '/page/' + link;
	window.history.pushState({urlPath:link},"",link);
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

function checkNewOne() {
	if(Cookies.get('newone')!=='undefined')
		return true;
	return false;
}

function makeTable(table, data, settings) {
	settings = toObject(settings);

	$(table).html("");
	$(table).append("<thead></thead>");
	$(table).append("<tbody></tbody>");

    var thead = $(table).find("thead");
	var tbody = $(table).find("tbody");

	var columns = {};

	var removeCol = toArray(settings.removeCol);

	$.each(data, function(i, row) {
	  if(settings.limit)
	  	if(i>settings.limit)
	  		return;
	  var tr = $('<tr>');
	  if(settings.numeration) {
	  	columns['--numeration--'] = '';
	  	$('<td>').html(i+1).appendTo(tr);
	  }
	  $.each(row, function(key, value) {
	  	if(inArray(key,removeCol))
	  		return;
	  	columns[key] = key;
	    $('<td>').html(replaceTableTd(key, value)).appendTo(tr);
	  });
	  tbody.append(tr);
	});

	  var tr = $('<tr class="text-muted">');
	  $.each(columns, function(key, value) {
	    $('<th class="border-0">').html(replaceTableTh(value)).appendTo(tr);
	  });
	  thead.append(tr);
}

function makeModal(el, button) {
	var modal_id = uniqID();
	var modal = $("#modal").clone();
	var modal_title = modal.find('.modal-title');
	var modal_body = modal.find('.modal-body');
	var title = $(el).find('[type="modal-title"]').html();
	var body = $(el).find('[type="modal-body"]');

	modal.attr('id', modal_id);
	modal.attr('aria-labelledby', modal_id+'label');

	modal_title.attr('id', modal_id+'label');
	modal_title.html(title);

	modal_body.html(makeAccordion(body));

	$('body').append(modal);

	$(button).attr('data-toggle', 'modal');
	$(button).attr('data-target', '#'+modal_id);
	$(button).removeAttr('onclick');

	$(el).remove();

	afterUpdate();

	return modal_id;
}

function makeAccordion(el) 
{
	var accordion_id = uniqID();
	var accordion = $("<div>");
 	var accordions = $(el).find('[type="accordion"]');

 	if(accordions.length <= 0)
 		return el;

	accordion.attr('class', 'accordion');
	accordion.attr('id', accordion_id);

	$(accordions).each(function(i,card) 
	{
		accordion.append(makeAccordionCard(card, accordion_id));
	});

	return accordion;
}

function makeAccordionCard(el, accordion_id) 
{
	var card_id = uniqID();
	var card = $("#accordion-card").clone();
	var card_collapse = card.find('.collapse');
	var card_header = card.find('.card-header');
	var card_title = card.find('.card-title');
	var card_body = card.find('.card-body');
	var title = $(el).find('[type="accordion-title"]').html();
	var body = $(el).find('[type="accordion-body"]').html();

	card.removeAttr('id');

	card_header.attr('id', card_id+'label');

	card_collapse.attr('id', card_id);
	card_collapse.attr('data-parent', '#'+accordion_id);
	card_collapse.attr('aria-labelledby', card_id+'label');

	card_title.attr('data-target', '#'+card_id);
	card_title.attr('aria-controls', card_id);

	card_title.html(title);
	card_body.html(body);

	return card;
}

function getAdeptioPriceCall(callback) 
{
	$.getJSON(link.getAdeptioPrice, function( data ) {
		if(data.data)
			var adeptioPrice = data.data[0];
			var bitcoinPrice = data.data[1];
			callback(adeptioPrice, bitcoinPrice);
	});
}

function getUserInfo(table) 
{
	if(!Cookies.get('account'))
		return;

	$.getJSON(link.getUserInfo + Cookies.get('account'), function( data ) {
		if(!data.data)
			return;

		makeTable(table, data.data, {
			removeCol: ['clanid']
		});
	});
}

function makePlayersWealthModal(table, modal, data) 
{
	var modal_table = $(modal).find('table');
	var modal_button = $(table).parent().find('a');

	makeTable(
		modal_table, 
		data, 
		{
			numeration: true,
			removeCol: ['clanid', 'count']
		}
	);

	modal_table.removeClass('d-none');

	var modal_id = makeModal(modal, modal_button);
	$('#'+modal_id).find('.modal-dialog').addClass('modal-lg');
}

function getPlayersWealth(table, modal) 
{
	$.getJSON(link.getWealth, function( data ) 
	{
		if(!data.data)
			return;

		data = sortBy(data.data, 'count');

		makeTable(
			table, 
			data, 
			{
				limit: 6,
				numeration: true,
				removeCol: ['clanid', 'count']
			}
		);

		$(table).removeClass('d-none');

		makePlayersWealthModal(table, modal, data);
	});
}

function makePlayersPVPModal(table, modal, data) 
{
	var modal_table = $(modal).find('table');
	var modal_button = $(table).parent().find('a');

	makeTable(
		modal_table, 
		data, 
		{
			numeration: true,
			removeCol: ['account_name', 'charId', 'onlinetime']
		}
	);

	modal_table.removeClass('d-none');

	var modal_id = makeModal(modal, modal_button);
	$('#'+modal_id).find('.modal-dialog').addClass('modal-lg');
}

function getPlayersPVP(table, modal) 
{
	$.getJSON(link.getPlayersInfo, function( data ) 
	{
		if(!data.data)
			return;

		data = sortBy(data.data, 'pvpkills');

		makeTable(
			table, 
			data, 
			{
				limit: 6,
				numeration: true,
				removeCol: ['account_name', 'charId', 'onlinetime']
			}
		);

		$(table).removeClass('d-none');

		makePlayersPVPModal(table, modal, data);
	});
}

function makeClansModal(table, modal, data) 
{
	var modal_table = $(modal).find('table');
	var modal_button = $(table).parent().find('a');

	makeTable(
		modal_table, 
		data, 
		{
			numeration: true,
			removeCol: ['leader_id']
		}
	);

	modal_table.removeClass('d-none');

	var modal_id = makeModal(modal, modal_button);
	$('#'+modal_id).find('.modal-dialog').addClass('modal-lg');
}

function getClansInfo(table, modal) 
{
	$.getJSON(link.getClansInfo, function( data ) {
		if(!data.data)
			return;

		data = sortBy(data.data, 'reputation_score');

		makeTable(
			table, 
			data,
			{
				limit: 7,
				numeration: true,
				removeCol: ['leader_id']
			}
		);

		$(table).removeClass('d-none');

		makeClansModal(table, modal, data);
	});
}

function getAdeptioUserInfo(adeptio, usd) {
	if(!Cookies.get('account'))
		return;

	$.getJSON(link.getAdeptioUserInfo + Cookies.get('account'), function( data ) {
		var count = 0;

		if(data.data && data.data[0].balance)
			count = data.data[0].balance;

		changeFormat = numberWithSpaces(round(count, 0));

		$(adeptio).html(changeFormat);
		//adeptioToUSD(usd, count);
	});
}

function getUserMoneyCount(adena, adeptio) {
	if(!Cookies.get('account'))
		return;

	$.getJSON(link.getUserMoneyCount + Cookies.get('account'), function( data ) {
		var count = 0;
		
		if(data.data)
			count = data.data;
		
		changeFormat = numberWithSpaces(round(count, 0));

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
		$(select).html("<option></option>");
		if(data.data)
			$.each(data.data, function(i, row) 
			{
			  $(select).append('<option value="'+row.charId+'">'+row.char_name+'</option>');
			});
	});
}

function selectedCharacter(el) 
{
	var selected_option = $(el).find('option:selected');

	if( selected_option.attr('count') > 0 )
		return;

	$.getJSON(link.getMoneyCount + $(el).val(), function( data ) 
	{
		var count = 0;
		if(data.data)
			$.each(data.data, function(i, row) 
			{
			  count += row.count;
			});

		selected_option.attr('count', count);

		formAdenaAdeptio(el);
	});
}

function formAdenaAdeptio(el) 
{
	var form = $(el).parent().parent();
	var count = form.find('select option:selected').attr('count');
	var input = form.find('input').first();
	var input_val = input.val();

	var min = adeRatio();
	var max = count;
	var adeptio = parseFloat($('#getAdeptioUserInfo').text());

	if( form.attr('data-type') === 'buy' ) 
	{
		min = 1;
		max = adeptio;

		form.find('.loseAdena').html(numberWithSpaces(input_val / adeRatio()) + ' Adeptio');
		form.find('.getAdeptio').html(numberWithSpaces(input_val) + ' Adena');
		form.find('.minAdena').html(numberWithSpaces(min) * adeRatio() + ' Adena');
		form.find('.maxAdena').html(numberWithSpaces(max) * adeRatio() + ' Adena');

		return;
	}

	input.attr('min', min);
	input.attr('max', max);

	form.find('.loseAdena').html(numberWithSpaces(input_val) + ' Adena');
	form.find('.getAdeptio').html(numberWithSpaces(input_val / adeRatio()) + ' Adeptio');
	form.find('.minAdena').html(numberWithSpaces(min) + ' Adena');
	form.find('.maxAdena').html(numberWithSpaces(max) + ' Adena');
}

function formContinueButton(el) 
{
	var form = $(el).parent();

	if( !form.find('select').val() )
		return;

	var first_input = form.find('input').first();

	if( !first_input.parent().hasClass('d-none') ) 
	{
		var count = parseFloat(first_input.val());
		var min = parseFloat(first_input.attr('min'));
		var max = parseFloat(first_input.attr('max'));

		if( !count || (count < min) || (count > max) )

			return;
	}

	var el_hide = form.find('.form-group.d-none');

	if( el_hide.length > 0 ) 
	{
		el_hide.first().removeClass('d-none');

		if( el_hide.length > 1 )
			return;
	}

	$(el).parent().find('button.d-none').removeClass('d-none');
	$(el).addClass('d-none');
}

function numberWithSpaces(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
}

function sha1ToBase64(string) 
{
	var hash= sha1(string);

	if (hash.length % 2) 
		hash= "0"+ hash;

	hash = hash.replace(/[a-f0-9][a-f0-9]/g, function (c, i) { return String.fromCharCode(parseInt(c, 16)) });

	return btoa(hash);
}

function round(numb, count) {
	return parseFloat(numb).toFixed(count);
}

function toArray(el) {
	return ( typeof el != 'undefined' && el instanceof Array ) ? el : [];
}

function toObject(el) {
	return ( typeof el != 'undefined' && el instanceof Object ) ? el : [];
}

function inArray(needle,haystack)
{
    var count=haystack.length;
    for(var i=0;i<count;i++)
    {
        if(haystack[i]===needle){return true;}
    }
    return false;
}

function scrollDown(el) {
	$('html, body').animate({
        scrollTop: $(el).offset().top
    }, 1000);
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

function secondsToHms(d,no_seconds) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
     if(no_seconds)
     	sDisplay = '';
    return hDisplay + mDisplay + sDisplay; 
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
		//document.getElementById('countdown').innerHTML = '<button type="button" class="btn btn-danger" id="countdownbtn">' + '<h2>' +  'Online since 2020-03-27. Join now!' + '<h2>' + '</button>'
	//}
    

  /*  let t = setTimeout(function() {
    	$("#countdownbtn").click()
        startTime()
    }, 1000);*/
}

function uniqID() {
  return Math.round(new Date().getTime() + (Math.random() * 100));
}

function sortBy(data, key) 
{
	data.sort(function(a, b) {
	    var x = a[key], y = b[key];
	    return x < y ? 1 : x > y ? -1 : 0;
	});
	return data;
}

function setProff(x) {
var proff = '';
switch(x) {
    case 0:
        proff = "Fighter";
        break;
    case 1:
        proff = "Warrior";
        break;
    case 2:
        proff = "Gladiator";
        break;
    case 3:
        proff = "Warlord";
        break;
    case 4:
        proff = "Knight";
        break;
    case 5:
        proff = "Paladin";
        break;
    case 6:
        proff = "DarkAvenger";
        break;
    case 7:
        proff = "Rogue";
        break;
    case 8:
        proff = "TreasureHunter";
        break;
    case 9:
        proff = "Hawkeye";
        break;
    case 10:
        proff = "Mage";
        break;
    case 11:
        proff = "Wizard";
        break;
    case 12:
        proff = "Sorceror";
        break;
    case 13:
        proff = "Necromancer";
        break;
    case 14:
        proff = "Warlock";
        break;
    case 15:
        proff = "Cleric";
        break;
    case 16:
        proff = "Bishop";
        break;
    case 17:
        proff = "Prophet";
        break;
    case 18:
        proff = "ElvenFighter";
        break;
    case 19:
        proff = "ElvenKnight";
        break;
    case 20:
        proff = "TempleKnight";
        break;
    case 21:
        proff = "SwordSinger";
        break;
    case 22:
        proff = "ElvenScout";
        break;
    case 23:
        proff = "PlainsWalker";
        break;
    case 24:
        proff = "SilverRanger";
        break;
    case 25:
        proff = "ElvenMage";
        break;
    case 26:
        proff = "ElvenWizard";
        break;
    case 27:
        proff = "Spellsinger";
        break;
    case 28:
        proff = "ElementalSummoner";
        break;
    case 29:
        proff = "Oracle";
        break;
    case 30:
        proff = "Elder";
        break;
    case 31:
        proff = "DarkFighter";
        break;
    case 32:
        proff = "PalusKnight";
        break;
    case 33:
        proff = "ShillienKnight";
        break;
    case 34:
        proff = "Bladedancer";
        break;
    case 35:
        proff = "Assassin";
        break;
    case 36:
        proff = "AbyssWalker";
        break;
    case 37:
        proff = "PhantomRanger";
        break;
    case 38:
        proff = "DarkMage";
        break;
    case 39:
        proff = "DarkWizard";
        break;
    case 40:
        proff = "Spellhowler";
        break;
    case 41:
        proff = "PhantomSummoner";
        break;
    case 42:
        proff = "ShillienOracle";
        break;
    case 43:
        proff = "ShillenElder";
        break;
    case 44:
        proff = "OrcFighter";
        break;
    case 45:
        proff = "OrcRaider";
        break;
    case 46:
        proff = "Destroyer";
        break;
    case 47:
        proff = "OrcMonk";
        break;
    case 48:
        proff = "Tyrant";
        break;
    case 49:
        proff = "OrcMage";
        break;
    case 50:
        proff = "OrcShaman";
        break;
    case 51:
        proff = "Overlord";
        break;
    case 52:
        proff = "Warcryer";
        break;
    case 53:
        proff = "DwarvenFighter";
        break;
    case 54:
        proff = "Scavenger";
        break;
    case 55:
        proff = "BountyHunter";
        break;
    case 56:
        proff = "Artisan";
        break;
    case 57:
        proff = "Warsmith";
        break;
    case 88:
        proff = "Duelist";
        break;
    case 89:
        proff = "Dreadnought";
        break;
    case 90:
        proff = "PhoenixKnight";
        break;
    case 91:
        proff = "HellKnight";
        break;
    case 92:
        proff = "Sagittarius";
        break;
    case 93:
        proff = "Adventurer";
        break;
    case 94:
        proff = "Archmage";
        break;
    case 95:
        proff = "Soultaker";
        break;
    case 96:
        proff = "ArcanaLord";
        break;
    case 97:
        proff = "Cardinal";
        break;
    case 98:
        proff = "Hierophant";
        break;
    case 99:
        proff = "EvaTemplar";
        break;
    case 100:
        proff = "SwordMuse";
        break;
    case 101:
        proff = "WindRider";
        break;
    case 102:
        proff = "MoonlightSentinel";
        break;
    case 103:
        proff = "MysticMuse";
        break;
    case 104:
        proff = "ElementalMaster";
        break;
    case 105:
        proff = "EvaSaint";
        break;
    case 106:
        proff = "ShillienTemplar";
        break;
    case 107:
        proff = "SpectralDancer";
        break;
    case 108:
        proff = "GhostHunter";
        break;
    case 109:
        proff = "GhostSentinel";
        break;
    case 110:
        proff = "StormScreamer";
        break;
    case 111:
        proff = "SpectralMaster";
        break;
    case 112:
        proff = "ShillienSaint";
        break;
    case 113:
        proff = "Titan";
        break;
    case 114:
        proff = "GrandKhavatari";
        break;
    case 115:
        proff = "Dominator";
        break;
    case 116:
        proff = "Doomcryer";
        break;
    case 117:
        proff = "FortuneSeeker";
        break;
    case 118:
        proff = "Maestro";
        break;
    case 123:
        proff = "MaleSoldier";
        break;
    case 124:
        proff = "FemaleSoldier";
        break;
    case 125:
        proff = "Trooper";
        break;
    case 126:
        proff = "Warder";
        break;
    case 127:
        proff = "Berserker";
        break;
    case 128:
        proff = "MaleSoulbreaker";
        break;
    case 129:
        proff = "FemaleSoulbreaker";
        break;
    case 130:
        proff = "Arbalester";
        break;
    case 131:
        proff = "Doombringer";
        break;
    case 132:
        proff = "MaleSoulhound";
        break;
    case 133:
        proff = "FemaleSoulhound";
        break;
    case 134:
        proff = "Trickster";
        break;
    case 135:
        proff = "Inspector";
        break;
    case 136:
        proff = "Judicator";
        break;
}
	return proff;
}
 
function setCastle(x) {
var castle = '';
switch(x) {
    case 22:
        castle = "Moonstone Hall - Gludio";
        break;
    case 23:
        castle = "Onyx Hall - Gludio";
        break;
    case 24:
        castle = "Topaz Hall - Gludio";
        break;
    case 25:
        castle = "Ruby Hall - Gludio";
        break;
    case 26:
        castle = "Crystal Hall - Gludin";
        break;
    case 27:
        castle = "Onyx Hall - Gludin";
        break;
    case 28:
        castle = "Sapphire Hall - Gludin";
        break;
    case 29:
        castle = "Moonstone Hall - Gludin";
        break;
    case 30:
        castle = "Emerald Hall - Gludin";
        break;
    case 31:
        castle = "The Atramental Barracks - Dion";
        break;
    case 32:
        castle = "The Scarlet Barracks Hall - Dion";
        break;
    case 33:
        castle = "The Viridian Barracks - Dion";
        break;
    case 36:
        castle = "The Golden Chamber - Aden";
        break;
    case 37:
        castle = "The Silver Chamber - Aden";
        break;
    case 38:
        castle = "The Mithril Chamber - Aden";
        break;
    case 39:
        castle = "Silver Manor - Aden";
        break;
    case 40:
        castle = "Gold Manor - Aden";
        break;
    case 41:
        castle = "The Bronze Chamber - Aden";
        break;
    case 42:
        castle = "The Golden Chamber - Giran";
        break;
    case 43:
        castle = "The Silver Chamber - Giran";
        break;
    case 44:
        castle = "The Mithril Chamber - Giran";
        break;
    case 45:
        castle = "The Bronze Chamber - Giran";
        break;
    case 46:
        castle = "Silver Manor - Giran";
        break;
    case 47:
        castle = "Moonstone Hall - Goddard";
        break;
    case 48:
        castle = "Onyx Hall - Goddard";
        break;
    case 49:
        castle = "Emerald Hall - Goddard";
        break;
    case 50:
        castle = "Sapphire Hall - Goddard";
        break;
    case 51:
        castle = "Mont Chamber - Rune";
        break;
    case 52:
        castle = "Astaire Chamber - Rune";
        break;
    case 53:
        castle = "Aria Chamber - Rune";
        break;
    case 54:
        castle = "Yiana Chamber - Rune";
        break;
    case 55:
        castle = "Roien Chamber - Rune";
        break;
    case 56:
        castle = "Luna Chamber - Rune";
        break;
    case 57:
        castle = "Traban Chamber - Rune";
        break;
    case 58:
        castle = "Eisen Hall - Schuttgart";
        break;
    case 59:
        castle = "Heavy Metal Hall - Schuttgart";
        break;
    case 60:
        castle = "Molten Ore Hall - Schuttgart";
        break;
    case 61:
        castle = "Titan Hall - Schuttgart";
        break;
}
   return castle;
}