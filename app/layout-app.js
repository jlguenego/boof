(function() {
	'use strict';

	var app = angular.module('mainApp', ['jlg-layout']);
	
	app.run(['$injector', function($injector) {
		var $rootScope = $injector.get('$rootScope');
		
		$rootScope.jlgLayout = {flow : 'row', dividerSize: 0};
		$rootScope.jlgLayoutContainer = {size: 100};
		$rootScope.switchFlow = function() {
			$rootScope.jlgLayout.flow = ($rootScope.jlgLayout.flow == 'row') ? 'col': 'row';
		};
	}]);
	


})();
