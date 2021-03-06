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