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

;(function (){

	'use strict';

	angular.module('Beers')

	.factory('BeerFactory', ['$http', 'PARSE', '$rootScope', '$location',
		function ($http, PARSE, $rootScope, $location) {

			//Fetch Beers
			var getAllBeers = function (){
				return $http.get(PARSE.URL + 'classes/beers', PARSE.CONFIG)
			};

			var addBeer = function (data){
				$http.post(PARSE.URL + 'classes/beers', data, PARSE.CONFIG)
					.success( function (){
						$rootScope.$broadcast('beer:added');
					}
				);
			};

			var deleteBeer = function (id){
				return $http.delete(PARSE.URL + 'classes/beers/' + id, PARSE.CONFIG);
			};

			var addImage = function (){
				filepicker.pickAndStore({}, {}, function (pic){
					$rootScope.$broadcast('beer:imageUploaded', pic[0]);
				});
			};

			var like = function (id, num){
				return $http.put(PARSE.URL + 'classes/beers/' + id, num, PARSE.CONFIG);
			}

			return {
				fetch: getAllBeers,
				post: addBeer,
				attImg: addImage,
				dltBeer: deleteBeer,
				like: like
			}


		}
	]);

}());
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
				return $cookieStore.remove('currentUser');
				$location.path('/login');
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
;(function (){

	'use strict';

	angular.module('Beers')

	.controller('BeerController', ['$scope', '$location', 'BeerFactory', '$rootScope',
		function ($scope, $location, BeerFactory, $rootScope) {	

			BeerFactory.fetch().success( function (data){
				$scope.beerCol = data.results;
			});

			$scope.addBeer = function (w) {
				w.imageURL = $scope.beerImage;
				BeerFactory.post(w);
			},

			$scope.addImage = function (i){
				BeerFactory.attImg(i);
			},

			$scope.deleteBeer = function (id) {
				BeerFactory.dltBeer(id)
					.success( function (){
						for (var i = 0; i < $scope.beerCol.length; i++){
							if ($scope.beerCol[i].objectId === id){
								$scope.beerCol.splice(i, 1);
								return;
							}
						}
					});
			},

			$scope.like = function (id, num) {
				num = (num + 1);
				BeerFactory.like(id, { 'likes': num })
					.success( function(){
						for (var i = 0; i < $scope.beerCol.length; i++){
							if ($scope.beerCol[i].objectId === id){
								$scope.beerCol[i].likes += 1;
								return;
							}
						}
					});
			},

			$rootScope.$on('beer:added', function (){
				$location.path('/beerlist')
			});

			$rootScope.$on('beer:imageUploaded', function (event, img) {
				$scope.beerImage = img.url;
				$scope.$apply();
			});

		}
	]);

}());
;(function (){

	'use strict';
	
	angular.module('Beers')

	.controller('UserController', ['$scope', 'UserFactory', '$rootScope', '$location',
		function ($scope, UserFactory, $rootScope, $location) {

			var user = UserFactory.user();
			if(user){
				return $location.path('/');
			}

			$scope.registerUser = function (userObj) {
				if ($scope.user.password !== $scope.pass){
					alert('Passwords have to match')
				}
				UserFactory.register(userObj);
			},

			$scope.loginUser = function (userObj) {
				UserFactory.login(userObj);
			},

			$rootScope.$on('user:loggedin', function (){
				$location.path('/beerlist')
			});

			$rootScope.$on('user:registered', function (){
				$location.path('/beerlist')
			});

			$rootScope.$on('user:loggedout', function (){
				$location.path('/')
			});

		}

	]);

}());
;(function (){

	'use strict';

	angular.module('Beers')

	.controller('NavController', ['$scope', 'UserFactory',
		function ($scope, UserFactory){

			var user = UserFactory.user();

			if(user){
				$scope.loggedin = true;
				$scope.user = user;
			} else {
				$scope.loggedin = false;
			}

			$scope.logout = function (){
				UserFactory.logout();
			}
		}

	]);

}());