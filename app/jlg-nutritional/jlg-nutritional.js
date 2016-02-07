(function() {
	'use strict';

	var app = angular.module('jlg-nutritional', []);
	
	app.run(['$injector', function($injector) {
		var $rootScope = $injector.get('$rootScope');
		console.log('jlg-nutritional: run');
		$rootScope.aliments = [
			'Citron',
			'Orange',
			'Banane'
		];
		
		$rootScope.searchForAliment = function() {
			console.log('searchForAliment', $rootScope.aliment);
		};
	}]);
	

})();
