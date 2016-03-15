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
				url: "/aliment/:alimentURI",
				templateUrl: "route/aliment.html",
				controller: ['$injector', function($injector) {
					var $rootScope = $injector.get('$rootScope');
					var $stateParams = $injector.get('$stateParams');
					var $state = $injector.get('$state');
					console.log('instantiate aliment ctrl', $stateParams);
					console.log('$stateParams.alimentURI', $stateParams.alimentURI);
					if ($stateParams.alimentURI === '') {
						console.log('exit from aliment ctrl');
						return;
					}
					$rootScope.nu.aliment = $rootScope.nu.getAlimentFromURI($stateParams.alimentURI);
					if ($rootScope.nu.aliment === undefined) {
						$state.go('home', {});
					}
					console.log('$rootScope.nu.aliment', $rootScope.nu.aliment);
				}]
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
		
		$rootScope.home = function(aliment) {
			$('#body').scrollTop(0);
			$state.go('home', {});
		};
		
		$rootScope.$watch('nu.aliment', function(newValue) {
			console.log('watch nu.aliment', newValue);
			$('#body').scrollTop(0);
			if (newValue !== undefined) {
				var uri = $rootScope.nu.getURIFromAliment($rootScope.nu.aliment);
				$state.go('aliment', { alimentURI: uri});
			} else {
				$state.go('home', {});
			}
			$('#body').scrollTop(0);
			
		});
		
		
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
				};
				
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
