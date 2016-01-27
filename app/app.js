(function() {
	'use strict';

	var app = angular.module('mainApp', ['ui.bootstrap']);
	
	app.run(['$injector', function($injector) {
		var $rootScope = $injector.get('$rootScope');
		
		
		$rootScope.title = 'Boof ! Calorie Citron';

	}]);

})();
