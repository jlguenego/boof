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
				popup.append('<div ng-repeat="item in ' + attrs.jlgTypeahead + ' | filter: ' + attrs.ngModel + ' | limitTo: 8 track by $index" ng-click="selectItem(item)" jlg-active>{{item}}</div>');
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
				// Todo: faire un jlgLimitTo qui stocke dans le scope le nbre de valeur dans le tableau
				// si il exceed 8 alors faire un lien sur tous les resultats.
/* 				scope.$watch(attrs.jlgTypeahead + ' | filter: ' + attrs.ngModel, function(newValue, oldValue) {
					if (newValue.length > 7) {
						popup.addClass('scroll');
					} else {
						popup.removeClass('scroll');
					}
				}); */
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
