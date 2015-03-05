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

		.when('/beerlist', {
			controller: 'BeerController',
			templateUrl: 'scripts/beer/beer-list-template.html'
		})

		.when('/addbeer', {
			controller: 'BeerController',
			templateUrl: 'scripts/beer/add-beer-template.html'
		})

		.when('/login', {
			controller: 'UserController',
			templateUrl: 'scripts/user/login-template.html'
		})

		.when('/register', {
			controller: 'UserController',
			templateUrl: 'scripts/user/signup-template.html'
		})

		.when('/profile', {
			controller: 'ProfileController',
			templateUrl: 'scripts/profile/profile-template.html'
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

	.factory('BeerFactory', ['$http', 'PARSE', '$rootScope', '$location', 'UserFactory',
		function ($http, PARSE, $rootScope, $location, UserFactory) {

			var user = UserFactory.user();

			// Fetch Beers
			var getAllBeers = function (){
				return $http({
					headers: PARSE.CONFIG.headers,
					url: PARSE.URL + 'classes/beers',
					method: 'GET',
					params: {
						include: 'user',
					},
				}).success( function (data){
					console.log(data);
				});
			};

			// Add Beer
			var addBeer = function (beerObj){
				
				// Add Beer to User Pointer
				beerObj.user = {
					__type:'Pointer',
					className: '_User',
					objectId: user.objectId
				}

				// Set up Access Control
				var ACLObj = {};
				ACLObj[user.objectId] = {
					'read': true,
					'write': true
				}

				beerObj.ACL = ACLObj;
				$http.post(PARSE.URL + 'classes/beers', beerObj, PARSE.CONFIG)
					.success( function (){
						$rootScope.$broadcast('beer:added');
					}
				);
			};

			// Delete Beer
			var deleteBeer = function (id){
				return $http.delete(PARSE.URL + 'classes/beers/' + id, PARSE.CONFIG);
			};

			// Add Picture of Beer
			var addImage = function (){
				filepicker.pickAndStore({}, {}, function (pic){
					$rootScope.$broadcast('beer:imageUploaded', pic[0]);
				});
			};

			// Like Beer
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

	.controller('BeerController', ['$scope', '$location', 'BeerFactory', '$rootScope', 'UserFactory',
		function ($scope, $location, BeerFactory, $rootScope, UserFactory) {	

			var user = UserFactory.user();

			// Fetch All Beers
			BeerFactory.fetch().success( function (data){
				$scope.beerCol = data.results;
			});

			// Add Beer
			$scope.addBeer = function (beerObj) {
				beerObj.imageURL = $scope.beerImage;

				BeerFactory.post(beerObj);
			},

			// Add Picture of Beer
			$scope.addImage = function (i){
				BeerFactory.attImg(i);
			},

			// Like Beer
			$scope.like = function (id, num) {
				var num = (num + 1);
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
;(function (){

	'use strict';
	
	angular.module('Beers')

	.controller('UserController', ['$scope', 'UserFactory', '$rootScope', '$location',
		function ($scope, UserFactory, $rootScope, $location) {

			var user = UserFactory.user();
			if(user){
				return $location.path('/profile');
			}

			// Register User
			$scope.registerUser = function (userObj) {
				if ($scope.user.password !== $scope.pass){
					alert('Passwords have to match')
				} else {
					UserFactory.register(userObj);
				}
			},

			// Login User
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

	.controller('ProfileController', ['$scope', 'UserFactory', 'BeerFactory', 
		function ($scope, UserFactory, BeerFactory){

			//Display Your Email
			var user = UserFactory.user();
			if(user){
				$scope.userProfile = user.username;
			}

			// Display Your Beers
			BeerFactory.fetch().success( function (data){
				var a = data.results;
				var b = a.filter( function (beer){
					if(beer.user.username === user.username){
						return beer
					}
				});
				$scope.beerCol = b;
			});

			// Delete Your Beers
			$scope.dltThis = function (id){
				BeerFactory.dltBeer(id)
					.success( function (){
						for (var i = 0; i < $scope.beerCol.length; i++){
							if ($scope.beerCol[i].objectId === id){
								$scope.beerCol.splice(i, 1);
								return;
							}
						}
					});
			}

		}

	]);

}());
;(function (){

	'use strict';

	angular.module('Beers')

	.controller('NavController', ['$scope', 'UserFactory', '$rootScope', '$location',
		function ($scope, UserFactory, $rootScope, $location){

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

			$scope.$on('user:loggedout', function (){
				$scope.loggedin = false;
			});

			$scope.$on('user:loggedin', function (){
				$scope.loggedin = true;
			});

		}

	]);

}());