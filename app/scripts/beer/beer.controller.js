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