function getPage(el) 
{
	var link = getLink(el);

	$.get(link, function( data ) {
	  putContent(data);
	});
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
	$('#page').html(data);
}