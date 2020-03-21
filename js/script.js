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
		event.preventDefault();
		if($(this).attr("loading") === "true")
			return;
		var href = $(this).attr('href');
		$(this).attr("loading", "true");
		if(href.indexOf('.html') < 0)
			return;
	    getPage(this,true);
	});

	$('form').submit(function(event){
		event.preventDefault();
	    submitForm(this);
	});

 	$("form input[type=submit]").click(function() {
        $("input[type=submit]", $(this).parents("form")).removeAttr("clicked");
        $(this).attr("clicked", "true");
    });

 	$("form button[type=submit]").click(function() {
        $("button[type=submit]", $(this).parents("form")).removeAttr("clicked");
        $(this).attr("clicked", "true");
    });
}