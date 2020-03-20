$(document).ready(function() { 

	getPage('home.html');

	$('a').click(function(event){
	    getPage(this);
	    event.preventDefault();
	});

	changeOnline('#online');
});