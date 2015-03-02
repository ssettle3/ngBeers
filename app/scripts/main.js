;(function (){

	//File Picker Key
	filepicker.setKey("AUqqkJMvRvC6XKQUxPl6Rz");

	// Set up Main Module
	angular.module('Beers', ['ngRoute', 'ngCookies'])

	.constant('PARSE', {
		URL: 'https://api.parse.com/1/',
		CONFIG: {
			headers: {
				'X-Parse-Application-Id': '6DUYNUIpGv8KMieDZ3JCY6T49P6CM36rL3M5HYaf',
  			'X-Parse-REST-API-Key': 'JIiZJRXMlbchAdW7CnqbDRMFDUND0MiDLYimjS99',
  			'Content-Type': 'application/json'
			}
		}
	})

	.config( function ($routeProvider){

		$routeProvider.when('/', {
			templateUrl: 'scripts/welcome/welcome-template.html'
		})

		$routeProvider.when('/beerlist', {
			controller: 'BeerController',
			templateUrl: 'scripts/beer/beer-list-template.html'
		})

		$routeProvider.when('/addbeer', {
			controller: 'BeerController',
			templateUrl: 'scripts/beer/add-beer-template.html'
		})

		$routeProvider.when('/login', {
			controller: 'UserController',
			templateUrl: 'scripts/user/login-template.html'
		})

		$routeProvider.when('/register', {
			controller: 'UserController',
			templateUrl: 'scripts/user/signup-template.html'

		})

		.otherwise({
			redirectTo: '/'
		});

	})

	.run([ '$rootScope', 'UserFactory', 'PARSE',
		function ($rootScope, UserFactory, PARSE){

			$rootScope.$on('$routeChangeStart', function (){

				UserFactory.status();

				var user = UserFactory.user();

			});

		}
	])

}());
