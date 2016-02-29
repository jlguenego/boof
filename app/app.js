(function() {
	'use strict';

	var app = angular.module('mainApp', ['ui.bootstrap',
		'jsonFormatter', 'jlg-menu', 'jlg-nutritional', 'jlg-typeahead', 'jlg-checkbox', 'jlg-layout']);
	
	app.run(['$injector', function($injector) {
		var $rootScope = $injector.get('$rootScope');
		
		
		$rootScope.title = 'Boof ! Calorie Citron';

		$rootScope.cfg = $rootScope.cfg || {};
		$rootScope.cfg.isTop = ! $rootScope.cfg.isMobile;
		
		$rootScope.$watch('cfg.isTop', function() {
			console.log('watch cfg.isTop');
			$('div.jlg-searchbar').removeClass('bottom top');
			$('div.jlg-navbar').removeClass('bottom top');
			$('jlg-menu').removeClass('bottom top');
			if ($rootScope.cfg.isTop) {
				$('div.jlg-navbar').addClass('top');
				$('div.jlg-searchbar').addClass('top');
				$('jlg-menu').addClass('top');
				var navbar = $('#jlg-navbar').detach();
				$('#layout1').prepend(navbar);
			} else {
				$('div.jlg-navbar').addClass('bottom');
				$('div.jlg-searchbar').addClass('bottom');
				$('jlg-menu').addClass('bottom');
				var navbar = $('#jlg-navbar').detach();
				$('#layout1').append(navbar);
			}
		});
		
		$rootScope.moreResults = function(aliment) {
			console.log('$rootScope.moreResults', aliment);
		}
	}]);

})();
