(function() {
	'use strict';

	var app = angular.module('jlg-nutritional', []);
	
	app.run(['$injector', function($injector) {
		var $rootScope = $injector.get('$rootScope');
		var $http = $injector.get('$http');
		
		console.log('jlg-nutritional: run');
		$rootScope.nu = {};
		$rootScope.nu.aliment = undefined;
		$rootScope.nu.aliments = [];
		
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
			$rootScope.data.data = $rootScope.data.data.filter(function(n) { return n.ORIGFDNM != undefined });
			
			$rootScope.nu.aliments = $rootScope.data.data.map(function(n) { return n.ORIGFDNM; }).sort();

			$rootScope.$watch('nu.aliment', function() {
				$rootScope.nu.alimentData = $rootScope.data.data.find(function(n) { return n.ORIGFDNM === $rootScope.nu.aliment; });
				console.log('$rootScope.nu.aliment', $rootScope.nu.aliment);
				console.log('$rootScope.nu.alimentData', $rootScope.nu.alimentData);
				$rootScope.nu.alimentDataTable = object2array($rootScope.nu.alimentData);
			});
		}).catch(function(error) {
			console.error('error', error);
		});
		
		
	}]);
	
	var object2array = function(object) {
		var result = [];
		for (var key in object) { 
			result.push({'key': key, 'value': object[key]});	
		}
		return result.sort(function(a, b) { return a.key > b.key ? -1 : 1; });
	};
	
	app.directive('jlgNutritionalTable', ['$injector', function($injector) {
		var $compile = $injector.get('$compile');
		var $q = $injector.get('$q');
		console.log('jlgNutritionalTable start');
		return {
			restrict: 'EAC',
			scope: true,
			template: '<table ng-show="nu.alimentDataTable.length > 0" class="table-hover table-striped"><tr><th>Nutriment</th><th>Value</th></tr>' + 
				'<tr ng-repeat="a in nu.alimentDataTable"><td>{{a.key}}</td><td>{{a.value}}</td></tr></table>'
		};
	}]);
	
	

})();
