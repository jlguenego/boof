(function() {
	'use strict';

	var app = angular.module('mainApp', ['ui.bootstrap', 'jlg-menu']);
	
	app.run(['$injector', function($injector) {
		var $rootScope = $injector.get('$rootScope');
		
		
		$rootScope.title = 'Boof ! Calorie Citron';
		
		$rootScope.isMobile = ('ontouchstart' in window);

		
		$rootScope.isTop = true;
		$rootScope.$watch('isTop', function() {
			$('div.jlg-navbar').removeClass('bottom top');
			$('jlg-menu').removeClass('bottom top');
			if ($rootScope.isTop) {
				$('div.jlg-navbar').addClass('top');
				$('jlg-menu').addClass('top');
			} else {
				$('div.jlg-navbar').addClass('bottom');
				$('jlg-menu').addClass('bottom');
			}
		});
	}]);

})();
