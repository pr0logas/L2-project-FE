$(document).ready(function() 
{ 
	afterUpdate();

	loginMenu();

	getPage('home.html');

	changeOnline('#online');
});

function afterUpdate() 
{
	$('a').click(function(event){
		var href = $(this).attr('href');
		if(href.indexOf('.html') < 0)
			return;
		event.preventDefault();
	    getPage(this);
	});

	$('form').submit(function(event){
		event.preventDefault();
	    submitForm(this);
	});
}