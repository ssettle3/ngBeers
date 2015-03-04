;(function (){

	'use strict';

	angular.module('Beers')

	.controller('ProfileController', ['$scope', 'UserFactory', 'BeerFactory', 
		function ($scope, UserFactory, BeerFactory){

			var user = UserFactory.user();
			if(user){
				$scope.userProfile = user.username;
			}


		}

	]);

}());