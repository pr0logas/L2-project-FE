$(document).ready(function() 
{ 
	afterUpdate();

	loginMenu();

	getPage('home.html');

	//startTime('#countdown')

});

function afterUpdate() 
{
	$('a').click(function(event){
		var href = $(this).attr('href');
		if(href.indexOf('.html') < 0)
			return;
		event.preventDefault();
		if($(this).attr("loading") === "true")
			return;
		$(this).attr("loading", "true");
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