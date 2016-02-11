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
				
				scope.isPopupVisible = false;
				scope.isMouseInPopup = false;
				
				element.on('focus', function() {
					scope.isPopupVisible = true;
					scope.$apply();
				});
				
				element.on('blur', function() {
					scope.isPopupVisible = scope.isMouseInPopup;
					scope.$apply();
				});
				
				scope.togglePopup = function($event) {
					$event.preventDefault();
					scope.isPopupVisible = !scope.isPopupVisible;
				};
				
				scope.selectItem = function(item) {
					element.val(item);
					element.trigger('input');
					
					scope.isPopupVisible = false;
				};
				
				var popup = angular.element('<div ng-show="isPopupVisible" class="jlg-typeahead-popup"></div>');
				popup.append('<div ng-repeat="' + spec.select + '" ng-click="selectItem(' + spec.object + ')" jlg-active>{{' + spec.object + '}}</div>');
				console.log('popup', popup);
				element.after(popup);
				$compile(popup)(scope);
				
				popup.on('mouseenter', function() {
					scope.isMouseInPopup = true;
					scope.$apply();
				});
				popup.on('mouseleave', function() {
					scope.isMouseInPopup = false;
					scope.$apply();
				});
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
				
				// for tactile interface
				element.bind('touchstart', function(e) {
					element.addClass('active');
				});
				
				element.bind('touchend', function(e) {
					element.removeClass('active');
				});
			}
		};
	}]);

})();
