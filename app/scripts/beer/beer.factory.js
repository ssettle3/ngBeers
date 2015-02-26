(function (){

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

			return {
				fetch: getAllBeers,
				post: addBeer
			}


		}
	]);

}());