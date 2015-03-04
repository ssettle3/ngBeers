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
			var registerUser = function (userObj){
				$http.post(PARSE.URL + 'users', userObj, PARSE.CONFIG)
					.then( function (response){
						console.log(response);
						$rootScope.$broadcast('user:registered');
					}
				);
			};

			// Login
			var loginUser = function (userObj){
				$http({
					url: PARSE.URL + 'login',
					method: 'GET',
					headers: PARSE.CONFIG.headers,
					params: userObj
				}).then( function (response){
						console.log(response);
						$cookieStore.put('currentUser', response.data);
						$rootScope.$broadcast('user:loggedin');
					});
			};

			// Logout 
			var logoutUser = function (){
			 	$cookieStore.remove('currentUser');
				$rootScope.$broadcast('user:loggedout');
			}

			return{
				register: registerUser,
				login: loginUser,
				user: currentUser,
				status: checkLoginStatus,
				logout: logoutUser
			};

		}

	]);

}());