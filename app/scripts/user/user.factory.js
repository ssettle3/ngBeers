;(function (){

	angular.module('Beers')

	.factory('UserFactory', ['$http', 'PARSE', '$rootScope',
		function ($http, PARSE, $rootScope) {

			// Register
			var register = function (x){
				return $http.post(PARSE.URL + 'users', x, PARSE.CONFIG)
					.success( function (){
						$rootScope.$broadcast('user:registered');
					}
				);
			};

			// Login
			var login = function (x){
				return $http.get(PARSE.URL + 'login', x, PARSE.CONFIG)
					.success( function (){
						$rootScope.$broadcast('user:loggedin');
					}
				);
			};

			return{
				register: register,
				login: login
			}

		}

	]);

}());