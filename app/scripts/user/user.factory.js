;(function (){

	angular.module('Beers')

	.factory('UserFactory', ['$http', 'PARSE', '$rootScope',
		function ($http, PARSE, $rootScope) {

			// Register
			var register = function (x){
				return $http.post(PARSE.URL + 'users', x, PARSE.CONFIG)
			};

			// Login
			var login = function (x){
				return $http.get(PARSE.URL + 'users', x, PARSE.CONFIG)
			};

			return{
				register: register,
				login: login
			}

		}

	]);

}());