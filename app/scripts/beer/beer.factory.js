;(function (){

	'use strict';

	angular.module('Beers')

	.factory('BeerFactory', ['$http', 'PARSE', '$rootScope', '$location',
		function ($http, PARSE, $rootScope, $location) {

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