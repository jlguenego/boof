(function() {
	'use strict';

	var app = angular.module('mainApp', ['ui.bootstrap', 'jlg-database']);


	app.run(['$injector', function($injector) {
		var $rootScope = $injector.get('$rootScope');
		$rootScope.essai = 'essai truc';

		//db.loadTableFromCsv('csv/Hello.csv');
	}]);

})();
