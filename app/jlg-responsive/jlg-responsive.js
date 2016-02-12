(function() {
	'use strict';

	var app = angular.module('jlg-responsive', []);
	
	app.run(['$injector', function($injector) {
		var $rootScope = $injector.get('$rootScope');
		var $document = $injector.get('$document');
		var $window = $injector.get('$window');
		
		console.log('jlg-responsive: run');
		$rootScope.cfg = $rootScope.cfg || {};
		$rootScope.cfg.isMobile = ('ontouchstart' in window);
		$rootScope.cfg.screen = window.screen;
		$rootScope.cfg.window = { width: $(window).width(), height: $(window).height() };
		$(window).on('resize', function() {
			$rootScope.cfg.window.width = $(window).width();
			$rootScope.cfg.window.height = $(window).height();
			$rootScope.$apply();
		});
		$(window).on('resize', function() {
			$rootScope.cfg.window.width = $(window).width();
			$rootScope.cfg.window.height = $(window).height();
			$rootScope.$apply();
		});
		
		var body = angular.element($document[0].body);
		$rootScope.$watch('cfg.isMobile', function() {
			body.removeClass('jlg-mobile jlg-desktop');
			if ($rootScope.cfg.isMobile) {
				body.addClass('jlg-mobile');
			} else {
				body.addClass('jlg-desktop');
			}
		});
		
	}]);
	
	app.controller('jlg-menu.Ctrl', ['$injector', function($injector) {
		
		this.visible = false;
		this.toggle = function(name) {
			console.log('toggle');
			this.visible = !this.visible;
		};
		
	}]);
	
	app.directive('jlgMenu', ['$injector', function($injector) {
		var $templateRequest = $injector.get('$templateRequest');
		var $compile = $injector.get('$compile');

		return {
			restrict: 'EAC',
			link: function(scope, element, attrs, ctrl) {
				console.log('link jlgMenuLayer', ctrl);
			}
		};
	}]);

})();
