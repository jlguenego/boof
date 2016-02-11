(function() {
	'use strict';

	var app = angular.module('jlg-nutritional', []);
	
	app.run(['$injector', function($injector) {
		var $rootScope = $injector.get('$rootScope');
		console.log('jlg-nutritional: run');
		$rootScope.nu = {};
		$rootScope.nu.aliment = undefined;
		$rootScope.nu.aliments = [
			'Citron',
			'Orange',
			'Banane',
			'Mangue',
			'Concombre',
			'Riz',
			'Raisin',
			'Cacao',
			'Fraise',
			'Pomme'
		];
		
		$rootScope.searchForAliment = function() {
			console.log('searchForAliment', $rootScope.nu.aliment);
		};
	}]);
	

})();
