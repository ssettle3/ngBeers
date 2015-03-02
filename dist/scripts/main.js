(function (){

	//File Picker Key
	filepicker.setKey("AUqqkJMvRvC6XKQUxPl6Rz");

	// Set up Main Module
	angular.module('Beers', ['ngRoute'])

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

		.otherwise({
			redirectTo: '/'
		});

	});

}());

;(function (){

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
;(function (){

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

	angular.module('Beers')

	.controller('UserController', ['$scope', 'UserFactory', '$rootScope', '$location',
		function ($scope, UserFactory, $rootScope, $location) {

			$scope.register = function () {
				if ($scope.user.password !== $scope.pass){
					alert('Passwords have to match')
				}
				UserFactory.register($scope.user);
			},

			$scope.login = function () {
				UserFactory.login($scope.user);
			},

			$rootScope.$on('user:loggedin', function (){
				$location.path('/beerlist')
			});

			$rootScope.$on('user:registered', function (){
				$location.path('/beerlist')
			});

		}

	]);

}());