;(function (){

	'use strict';

	angular.module('Beers')

	.controller('BeerController', ['$scope', '$location', 'BeerFactory', '$rootScope', 'UserFactory', '$http', 'PARSE',
		function ($scope, $location, BeerFactory, $rootScope, UserFactory, $http, PARSE) {	

			var user = UserFactory.user();

			// Fetch All Beers
			BeerFactory.fetch().success( function (data){
				$scope.beerCol = data.results;
			});

			// Add Beer
			$scope.addBeer = function (beerObj) {
				beerObj.imageURL = $scope.beerImage;

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
				$http.post(PARSE.URL + 'classes/beers', beerObj, PARSE.CONFIG);


				// BeerFactory.post(beerObj);
			},

			// Add Picture of Beer
			$scope.addImage = function (i){
				BeerFactory.attImg(i);
			},

			// Delete Beer
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

			// Like Beer
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