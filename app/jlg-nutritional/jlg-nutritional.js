(function() {
	'use strict';

	var app = angular.module('jlg-nutritional', ['jlg-misc']);

	var object2array = function(object) {
		var result = [];
		for (var key in object) {
			if (object.hasOwnProperty(key)) {
				result.push({'key': key, 'value': object[key]});
			}
		}
		return result.sort(function(a, b) { return a.key > b.key ? -1 : 1; });
	};


	app.run(['$injector', function($injector) {
		var $rootScope = $injector.get('$rootScope');
		var $http = $injector.get('$http');
		var misc = $injector.get('misc');

		console.log('jlg-nutritional: run');
		$rootScope.nu = {};
		$rootScope.nu.aliment = undefined;
		$rootScope.nu.aliments = [];
		$rootScope.nu.alimentURIMap = {};

		$rootScope.nu.getURIFromAliment = function(alimentName) {
			console.log('getURIFromAliment with ', alimentName);
			var result = misc.niceURI(alimentName);
			console.log('returning ', result);
			return result;
		};

		$rootScope.nu.getAlimentFromURI = function(uri) {
			return $rootScope.nu.alimentURIMap[uri];
		};

		$http.get('jlg-nutritional/data.csv').then(function(response) {
			$rootScope.csv = Papa.parse(response.data, {
				header: true,
			});
			$rootScope.csv.data = $rootScope.csv.data.filter(function(n) { return n.ORIGFDNM !== undefined; });

			$rootScope.nu.aliments = $rootScope.csv.data.map(function(n) { return n.ORIGFDNM; }).sort();

			$rootScope.nu.aliments.forEach(function(alimentName) {
				var uri = misc.niceURI(alimentName);
				if ($rootScope.nu.alimentURIMap[uri]) {
					console.warn('collision in alimentURIMap: ', alimentName, $rootScope.nu.alimentURIMap[uri]);
				}
				$rootScope.nu.alimentURIMap[uri] = alimentName;
			});

			$rootScope.$watch('nu.aliment', function() {
				$rootScope.nu.alimentData = $rootScope.csv.data.find(function(n) { return n.ORIGFDNM === $rootScope.nu.aliment; });
				console.log('$rootScope.nu.aliment', $rootScope.nu.aliment);
				console.log('$rootScope.nu.alimentData', $rootScope.nu.alimentData);
				$rootScope.nu.alimentDataTable = object2array($rootScope.nu.alimentData);
			});
		}).catch(function(error) {
			console.error('error', error);
		});


	}]);


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
