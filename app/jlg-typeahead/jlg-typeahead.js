(function() {
	'use strict';

	var app = angular.module('jlg-typeahead', ['jlg-responsive']);
	
	app.run(['$injector', function($injector) {
		var $rootScope = $injector.get('$rootScope');
		
	}]);

	
	app.directive('jlgTypeahead', ['$injector', function($injector) {
		var $compile = $injector.get('$compile');
		var $q = $injector.get('$q');
		
		return {
			restrict: 'EAC',
			scope: true,
			link: function(scope, element, attrs) {
				console.log('link jlgTypeahead', scope, element, attrs);
				var spec = scope.$eval(attrs.jlgTypeahead);
				console.log('spec', spec);
				scope.isPopupVisible = true;
				scope.togglePopup = function($event) {
					console.log('togglePopup');
					$event.preventDefault();
					scope.isPopupVisible = !scope.isPopupVisible;
				};
				var popup = angular.element('<div class="jlg-typeahead-popup"><button ng-click="togglePopup($event);">coucou</button></div>');
				popup.append('<div ng-show="isPopupVisible" ng-repeat="' + spec.select + '" jlg-active>{{' + spec.title + '}}</div>');
				console.log('popup', popup);
				element.after(popup);
				$compile(popup)(scope);
			}
		};
	}]);
	
	app.directive('jlgActive', ['$injector', function($injector) {
		var $compile = $injector.get('$compile');
		var $q = $injector.get('$q');
		
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				element.bind('mouseenter', function(e) {
					element.addClass('active');
				});
				element.bind('mouseleave', function(e) {
					element.removeClass('active');
				});
			}
		};
	}]);

})();
