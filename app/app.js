(function() {
	'use strict';

	var app = angular.module('mainApp', ['ui.bootstrap', 'jlg-menu']);
	
	app.run(['$injector', function($injector) {
		var $rootScope = $injector.get('$rootScope');
		
		
		$rootScope.title = 'Boof ! Calorie Citron';

		$rootScope.cfg = $rootScope.cfg || {};
		$rootScope.cfg.isTop = true;
		
		$rootScope.$watch('cfg.isTop', function() {
			console.log('watch cfg.isTop');
			$('div.jlg-navbar').removeClass('bottom top');
			$('jlg-menu').removeClass('bottom top');
			if ($rootScope.cfg.isTop) {
				$('div.jlg-navbar').addClass('top');
				$('jlg-menu').addClass('top');
			} else {
				$('div.jlg-navbar').addClass('bottom');
				$('jlg-menu').addClass('bottom');
			}
		});
	}]);

})();
