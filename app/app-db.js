(function() {
	'use strict';

	var app = angular.module('mainApp', ['ui.bootstrap', 'jlg-database']);


	app.run(['$injector', function($injector) {
		var $rootScope = $injector.get('$rootScope');
		var db = $injector.get('jlg-database.db');

		//db.loadTableFromCsv('csv/Hello.csv');
	}]);

})();
