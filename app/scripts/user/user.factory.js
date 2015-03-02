;(function (){

	'use strict';

	angular.module('Beers')

	.factory('UserFactory', ['$http', 'PARSE', '$rootScope', '$cookieStore', '$location',
		function ($http, PARSE, $rootScope, $cookieStore, $location) {

			// Get current User
			var currentUser = function (){
				return $cookieStore.get('currentUser');
			};

			// Check Status of User
			var checkLoginStatus = function  () {
				var user = currentUser();
				if(user){
					PARSE.CONFIG.headers['X-Parse-Session-Token'] = user.sessionToken;
				}
			};

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

			// Logout User
			var logoutUser = function (){
				return $cookieStore.destroy('currentUser');
				$location.path('/');
			}

			return{
				register: register,
				login: login,
				user: currentUser,
				status: checkLoginStatus,
				logout: logoutUser
			};

		}

	]);

}());