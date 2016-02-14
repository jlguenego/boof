(function() {
	'use strict';

	var app = angular.module('jlg-typeahead', ['jlg-responsive']);
	
	app.run(['$injector', function($injector) {
		var $rootScope = $injector.get('$rootScope');
		
	}]);

	
	app.directive('jlgTypeahead', ['$injector', function($injector) {
		var $compile = $injector.get('$compile');
		var $q = $injector.get('$q');
		var filterFilter = $injector.get('filterFilter');
		
		return {
			restrict: 'EAC',
			scope: true,
			link: function(scope, element, attrs) {
				console.log('link jlgTypeahead', scope, element, attrs);
				
				scope.isPopupVisible = false;
				scope.isMouseInPopup = false;
				
				element.on('focus', function() {
					if (scope.$eval(attrs.ngModel) == undefined) {
						// force the watch the first time by updating the ngModel from undefined to ''.
						scope.$eval(attrs.ngModel + '=""');
					}
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
				
				scope.isLongList = false;
			
				var popup = angular.element('<div ng-show="isPopupVisible" class="jlg-typeahead-popup"></div>');
				popup.append('<div ng-repeat="item in ' + attrs.jlgTypeahead + ' | filter: ' + attrs.ngModel + ' | limitTo: 8 track by $index" ng-click="selectItem(item)" jlg-active>{{item}}</div>');
				popup.append('<div ng-show="isLongList" class="moreResults">More results</div>');
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
				
				scope.$watch(attrs.ngModel, function(newValue, oldValue) {
					var list = scope.$eval(attrs.jlgTypeahead);
					var filteredList = filterFilter(scope.$eval(attrs.jlgTypeahead), newValue);
					if (filteredList.length > 7) {
						popup.addClass('longlist');
						scope.isLongList = true;
					} else {
						popup.removeClass('longlist');
						scope.isLongList = false;
					}
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
