link = {
	online: 'https://l2-corona-api.adeptio.cc/apiv1/getOnline',
}

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

function submitForm(el) 
{
	response('Loading...');

	$.getJSON(el.action + '?' + $(el).serialize(), function(data)
	{
		if(data.data.length > 0)
			logined(formValue(el, 'account'));

		response("Not found");
	});
}

function logined(data) 
{
	Cookies.set('account', data);
	getPage('cp.html');
	loginMenu();
}

function response(data) {
	$('.page-content .alertResponse').remove();
	$('.page-content').prepend($("#alertResponse").clone());
	$('.page-content .alertResponse').html(data);
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
	getPage('home.html');
	loginMenu();
}