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
	
	app.directive('jlgMenu', ['$injector', function($injector) {
		var $templateRequest = $injector.get('$templateRequest');
		var $compile = $injector.get('$compile');
		var $window = $injector.get('$window');

		return {
			restrict: 'EAC',
			link: function(scope, element, attrs) {
				var refresh = function() {
					console.log('compute Height', scope, attrs);
					var parentHeight = element.parent().height();
					var height = parentHeight - 50;
					element.css('height', parentHeight + 'px');
				}
				
				angular.element($window).on('resize', refresh);
				refresh();
			}
		};
	}]);

})();
