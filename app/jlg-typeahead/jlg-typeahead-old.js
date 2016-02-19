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
		var $rootScope = $injector.get('$rootScope');
		
		return {
			require: 'ngModel',
			restrict: 'EAC',
			scope: true,
			link: function(scope, element, attrs, ctrl) {
				console.log('link jlgTypeahead', scope, element, attrs, ctrl);
				
				scope.isPopupVisible = false;
				scope.isMouseInPopup = false;
				scope.activeItem = undefined;
				scope.list = undefined;
				scope.filteredList = undefined;
				scope.inputValue = undefined;
				
				element.on('focus', function() {
					if ($rootScope.cfg.isMobile) {
						console.log('isMobile');
						scope.$eval(attrs.ngModel + '=""');
					} else {
						console.log('isMobile false');
						$(this).select();
					}
					
					if (scope.$eval(attrs.ngModel) == undefined) {
						// force the watch the first time by updating the ngModel from undefined to ''.
						scope.$eval(attrs.ngModel + '=""');
					}
					if (scope.activeItem == undefined) {
						// force the watch the first time by updating.
						scope.activeItem = 0;
					}
					scope.isPopupVisible = true;
					scope.$apply();
				});
				
				element.on('blur', function() {
					if (scope.isMouseInPopup) {
						return;
					}
					scope.selectItem();
					scope.$apply();
				});
				
				scope.togglePopup = function($event) {
					$event.preventDefault();
					scope.isPopupVisible = !scope.isPopupVisible;
				};
				
				scope.selectItem = function() {
					element.val(scope.filteredList[scope.activeItem]);
					element.trigger('input');
					scope.isPopupVisible = false;
				};
				
				
				
				scope.isLongList = false;
			
				var popup = angular.element('<div ng-show="isPopupVisible" class="jlg-typeahead-popup"></div>');
				popup.append('<div ng-repeat="item in ' + attrs.jlgTypeahead + ' | filter: inputValue track by $index" ng-click="selectItem()" jlg-active>{{item}}</div>');
				popup.append('<div ng-show="noResultFound" class="noResultFound">Aucun résultat trouvé</div>');
				console.log('popup', popup);
				element.parent().after(popup);
				$compile(popup)(scope);
				
				popup.on('mouseenter', function() {
					scope.isMouseInPopup = true;
					scope.$apply();
				});
				popup.on('mouseleave', function() {
					scope.isMouseInPopup = false;
					scope.$apply();
				});
				
				scope.$watch('inputValue', function(newValue, oldValue) {
					console.log('watch inputValue', newValue);
					scope.list = scope.$eval(attrs.jlgTypeahead);
					scope.filteredList = filterFilter(scope.list, newValue);
					scope.noResultFound = (scope.filteredList.length == 0);
					
					if (scope.filteredList.length > 8) {
						popup.addClass('longlist');
						scope.isLongList = true;
					} else {
						popup.removeClass('longlist');
						scope.isLongList = false;
					}
				});
				
				scope.$watch('activeItem', function(newValue, oldValue) {
					console.log('scope.activeItem', scope.activeItem);
					popup.children().eq(newValue).addClass('active');
					popup.children().eq(oldValue).removeClass('active');
				});
				
				//validator
				ctrl.$validators.inArray = function(modelValue, viewValue) {
					console.log('validator', viewValue);
					scope.inputValue = viewValue;
					if (ctrl.$isEmpty(modelValue)) {
						// consider empty models to be invalid
						return false;
					}
					return ($.inArray(viewValue, scope.list) >= 0);
				};
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
					scope.$parent.activeItem = scope.$index;
					scope.$apply();
				});
				
				// for tactile interface
				element.bind('touchstart', function(e) {
					scope.$parent.activeItem = scope.$index;
					scope.$apply();
				});
				
				
			}
		};
	}]);
})();
