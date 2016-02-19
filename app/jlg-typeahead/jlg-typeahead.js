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
				
				ctrl.$setViewValue('essai');
				ctrl.$commitViewValue();
				
				scope.isInputVisible = true;
				scope.isPopupVisible = false;
				scope.isMouseInPopup = false;
				scope.inputValue = undefined;
				scope.activeItem = undefined;
				scope.list = undefined;
				scope.filteredList = undefined;
				
				var tag = angular.element('<div ng-hide="isInputVisible" class="jlg-typeahead-tag">{{' + attrs.ngModel + '}}</div>');
				var close = angular.element('<span class="remove" ng-click="remove()">x</span>');
				tag.append(close);
				element.append(tag);
				$compile(tag)(scope);
				
				var input = angular.element('<input ng-show="isInputVisible" class="jlg-typeahead-input" ng-model="inputValue"/>');
				input.attr('ng-model-options', attrs.ngModelOptions);
				input.attr('placeholder', attrs.placeholder);
				input.attr('autocomplete', 'off');
				element.append(input);
				$compile(input)(scope);
				
				var popup = angular.element('<div ng-show="isPopupVisible" class="jlg-typeahead-popup"></div>');
				popup.append('<div ng-repeat="item in ' + attrs.source + ' | filter: inputValue track by $index" ng-click="selectItem()" jlg-active>{{item}}</div>');
				popup.append('<div ng-show="noResultFound" class="noResultFound">Aucun résultat trouvé</div>');
				console.log('popup', popup);
				element.append(popup);
				$compile(popup)(scope);
				
				input.on('focus', function() {
					if ($rootScope.cfg.isMobile) {
						console.log('focus isMobile');
						scope.inputValue = '';
					} else {
						console.log('focus isMobile false');
						$(this).select();
					}
					
					if (scope.$eval('inputValue') == undefined) {
						// force the watch the first time by updating the ngModel from undefined to ''.
						scope.$eval('inputValue=""');
					}
					if (scope.activeItem == undefined) {
						// force the watch the first time by updating.
						scope.activeItem = 0;
					}
					scope.isPopupVisible = true;
					scope.$apply();
				});
				
				input.on('blur', function() {
					if (scope.isMouseInPopup) {
						return;
					}
					scope.selectItem();
					scope.$apply();
				});
				
				popup.on('mouseenter', function() {
					scope.isMouseInPopup = true;
					scope.$apply();
				});
				popup.on('mouseleave', function() {
					scope.isMouseInPopup = false;
					scope.$apply();
				});
				
				scope.$watch('activeItem', function(newValue, oldValue) {
					console.log('scope.activeItem', scope.activeItem);
					popup.children().eq(newValue).addClass('active');
					popup.children().eq(oldValue).removeClass('active');
				});
				
				scope.$watch('inputValue', function(newValue, oldValue) {
					console.log('watch inputValue', newValue);
					scope.list = scope.$eval(attrs.source);
					scope.filteredList = filterFilter(scope.list, newValue);
					scope.noResultFound = (scope.filteredList.length == 0);
					
					scope.isLongList = scope.filteredList.length > 8;
					if (scope.isLongList) {
						popup.addClass('longlist');
					} else {
						popup.removeClass('longlist');
					}
				});
				
				scope.selectItem = function() {
					console.log('selectItem', scope, ctrl);
					
					
					console.log('about to set ', scope.activeItem);
					console.log('about to set ', scope.filteredList[scope.activeItem]);
					ctrl.$setViewValue(scope.filteredList[scope.activeItem]);
					ctrl.$commitViewValue();
					scope.isPopupVisible = false;
					scope.isInputVisible = false;
					input.val('');
					input.trigger('input');
				};
				
				scope.remove = function() {
					console.log('close', scope, ctrl);
					ctrl.$setViewValue('');
					ctrl.$commitViewValue();
					scope.isInputVisible = true;
					scope.isPopupVisible = false;
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
