(function() {
	'use strict';

	var app = angular.module('jlg-nutritional', []);
	
	app.run(['$injector', function($injector) {
		var $rootScope = $injector.get('$rootScope');
		var $http = $injector.get('$http');
		
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
		
		$http.get('jlg-nutritional/data.csv').then(function(response) {
			$rootScope.data = Papa.parse(response.data, {
				delimiter: "",	// auto-detect
				newline: "",	// auto-detect
				header: true,
				dynamicTyping: false,
				preview: 0,
				encoding: "",
				worker: false,
				comments: false,
				step: undefined,
				complete: undefined,
				error: undefined,
				download: false,
				skipEmptyLines: false,
				chunk: undefined,
				fastMode: undefined,
				beforeFirstChunk: undefined,
				withCredentials: undefined
			});
			
			$rootScope.nu.aliments = $rootScope.data.data.map(function(n) { return n.ORIGFDNM; });

			$rootScope.$watch('nu.aliment', function() {
				$rootScope.nu.alimentData = $rootScope.data.data.find(function(n) { return n.ORIGFDNM == $rootScope.nu.aliment; });
			});
		}).catch(function(error) {
			console.error('error', error);
		});
		
		
	}]);
	
	

})();
