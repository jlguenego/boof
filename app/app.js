(function() {
	'use strict';

	var app = angular.module('mainApp', ['ui.bootstrap', 'ui.router',
		'jsonFormatter', 'jlg-menu', 'jlg-nutritional', 'jlg-typeahead', 'jlg-checkbox', 'jlg-layout', 'templates']);
	
	angular.module('templates', []);
	
	app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
		$stateProvider
			.state('home', {
				url: "/",
				templateUrl: "route/home.html",
				controller: ['$rootScope', function($rootScope) {
					console.log('instantiate home ctrl');
					$rootScope.nu.aliment = undefined;
				}]
			})
			.state('aliment', {
				url: "/aliment/:alimentName",
				templateUrl: "route/aliment.html"
			});
	}]);
	
	app.run(['$injector', function($injector) {
		var $rootScope = $injector.get('$rootScope');
		var $state = $injector.get('$state');
		
		
		$rootScope.title = 'Boof !';
		$rootScope.debug = 'none';

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
		};
		
		var niceUri = function(uri) {
			var result = removeDiacritics(uri).replace(/[^a-zA-Z0-9]+/g, '-');
			return encodeURI(result);
		};
		
		$rootScope.viewAliment = function() {
			console.log('viewAliment');
			$state.go('aliment', { alimentName: niceUri($rootScope.nu.aliment)});
			$('#body').scrollTop(0);
		};
		
		
	}]);
	
	app.directive('jlgMenu', ['$injector', function($injector) {
		var $window = $injector.get('$window');
		return {
			restrict: 'EAC',
			link: function(scope, element, attrs) {
				var refresh = function() {
					console.log('compute Height', scope, attrs);
					var parentHeight = element.parent().height();
					var height = parentHeight - 50;
					element.css('height', height + 'px');
				}
				
				angular.element($window).on('resize', refresh);
				refresh();
			}
		};
	}]);

	app.directive('jlgAutosize', ['$injector', function($injector) {
		var $rootScope = $injector.get('$rootScope');
		return {
			restrict: 'EAC',
			link: function(scope, element, attrs) {
				
				scope.$watch('item', function() {
					var nbr = element.text().length;
					var size = 16;
					if ($rootScope.cfg.isMobile) {
						if (nbr > 40) {
							size = 13;
						}
					}
					
					element.css('font-size', size + 'px');
				});
				
			}
		};
	}]);
})();
