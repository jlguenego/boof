(function() {
	'use strict';

	var app = angular.module('mainApp', ['jlg-layout']);
	
	app.run(['$injector', function($injector) {
		var $rootScope = $injector.get('$rootScope');
		
		
		
	}]);
	
	app.directive('jlgLayout', ['$injector', function($injector) {
		return {
			restrict: 'ECA',
			require: 'jlgLayout',
			scope: {
				cfg: '=jlgLayout'
			},
			link: function(scope, element, attrs) {
				console.log('jlgLayout', arguments);
				
			},
			controller: ['$scope', '$injector', function ($scope, $injector) {
				console.log('scope', $scope);
				$scope.name = 'jlgLayoutCtrl';
				this.cfg = $scope.cfg;
			}]
		};
		
	}]);
	
	app.directive('jlgLayoutContainer', ['$injector', function($injector) {
		return {
			restrict: 'ECA',
			require: '^jlgLayout',
			link: function(scope, element, attrs, ctrl) {
				console.log('jlgLayoutContainer', arguments);
				console.log('cfg of jlgLayout', ctrl.cfg);
			}
		};
		
	}]);

})();
