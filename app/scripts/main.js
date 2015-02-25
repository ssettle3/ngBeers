(function (){

	// Set Up Parse Auth Keys

	$.ajaxSetup({
		headers: {
			'X-Parse-Application-Id': '6DUYNUIpGv8KMieDZ3JCY6T49P6CM36rL3M5HYaf', 
	  	'X-Parse-REST-API-Key': 'JIiZJRXMlbchAdW7CnqbDRMFDUND0MiDLYimjS99' 
		}
	});

	// Set up Main Module

	angular.module('Beers', ['ngRoute'])

	.constant ({
		'rootURL' : 'https://api.parse.com/1/classes/beers'
	})

	.config( function ($routeProvider){

		$routeProvider.when('/', {
			controller: 'WelcomeController',
			templateUrl: 'welcome/welcome-template.html'
		});

		$routeProvider.when('/beerlist', {
			controller: 'BeerController',
			templateUrl: 'list/beerlist-template,html'
		});

	});

}());
