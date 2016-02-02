(function() {
	'use strict';

	var app = angular.module('mainApp', ['ui.bootstrap', 'jlg-menu']);
	
	app.run(['$injector', function($injector) {
		var $rootScope = $injector.get('$rootScope');
		
		
		$rootScope.title = 'Boof ! Calorie Citron';
		
		$rootScope.isMobile = ('ontouchstart' in window);

	}]);

})();
