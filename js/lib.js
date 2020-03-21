link = {
	online: 'https://l2-corona-api.adeptio.cc/apiv1/getOnline',
	getUserInfo: 'https://l2-corona-api.adeptio.cc/apiv1/getUserInfo?account=',
	getAdeptioUserInfo: 'https://l2-corona-api.adeptio.cc/apiv1/getAdeptioUserInfo?account=',
	getMoneyCount: 'https://l2-corona-api.adeptio.cc/apiv1/getMoneyCount?charId='
}

$(document).ajaxError(function myErrorHandler(event, xhr, ajaxOptions, thrownError) {
  response(xhr.responseText + ' - ' + ajaxOptions.url);
});

function getPage(el) 
{
	var link = getLink(el);

	$.get(link, function( data ) {
	  putContent(data);
	});

	changeUrl(link);
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
	response('Loading...');

	$.getJSON(getAction(el), function(data)
	{
		if( data.data.SUCCESS ) {
			response("Success: " + data.data.SUCCESS);
			return;
		}

		if(formValue(el, 'account') && data.data.length > 0) {
			logined(formValue(el, 'account'));
			return;
		}

		response("Error: ", data);
	});
}

function getAction(el) 
{
	var action = el.action;

 	if(radioValue(action))
 		action = radioValue(action);

 	return action + '?' + $(el).serialize();
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

function radioValue(radioNodeList) {
	if(typeof radioNodeList === 'string')
		return false;
	for (var i = radioNodeList.length - 1; i > -1; i--) {
		if ($(radioNodeList[i]).attr('clicked')) {
			return radioNodeList[i].value;
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

	$(el).html(online + 0 + end);

	$.getJSON(link.online, function( data ) {
		if(data.data)
			$(el).html(online + data.data.length + end);
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

function getAdeptioUserInfo(adena, adeptio) {
	if(!Cookies.get('account'))
		return;

	$.getJSON(link.getAdeptioUserInfo + Cookies.get('account'), function( data ) {
		var balance = 0;

		if(data.data && data.data[0].balance)
			balance = data.data[0].balance;

		$(adena).html(balance);
		$(adeptio).html(adenaToAdeptio(balance));
	});
}

function getMoneyCount(adeptio, usd) {
	if(!Cookies.get('account'))
		return;

	$.getJSON(link.getMoneyCount + Cookies.get('account'), function( data ) {
		if(!data.data)
			response("Error: ", data)
	});
}

function adenaToAdeptio(count) {
	return count / 1000;
}

function changeSelectAccount(select) 
{
	if(!Cookies.get('account'))
		return;

	$.getJSON(link.getUserInfo + Cookies.get('account'), function( data ) 
	{
		if(data.data)
			$.each(data.data, function(i, row) 
			{
			  $(select).append('<option value="'+row.charId+'">'+row.char_name+'</option>');
			});
	});
}