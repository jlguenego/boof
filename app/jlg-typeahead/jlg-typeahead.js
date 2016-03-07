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
		var $templateRequest = $injector.get('$templateRequest');
		
		return {
			require: 'ngModel',
			restrict: 'EAC',
			scope: {
				source: '=source',
				value: '=ngModel'
			},
			link: function(scope, element, attrs, ctrl) {
				console.log('link jlgTypeahead', scope, element, attrs, ctrl);
				
				scope.isInputVisible = true;
				scope.isPopupVisible = false;
				scope.isMouseInPopup = false;
				scope.inputValue = undefined;
				scope.activeItem = undefined;
				scope.filteredList = undefined;
				
				var tag = angular.element('<div ng-hide="isInputVisible" class="jlg-typeahead-tag"></div>');
				var close = angular.element('<span class="remove" ng-click="remove()">&lt; Voir d\'autres aliments</span>');
				tag.prepend(close);
				element.append(tag);
				$compile(tag)(scope);
				
				var input = angular.element('<input ng-show="isInputVisible" class="jlg-typeahead-input" ng-model="inputValue"/>');
				input.attr('ng-model-options', attrs.ngModelOptions);
				input.attr('placeholder', attrs.placeholder);
				input.attr('autocomplete', 'off');
				element.append(input);
				$compile(input)(scope);
				
				var template = (attrs.template) ? attrs.template : 'popup/search.html';
				var popup = angular.element('<div ng-show="isPopupVisible" class="jlg-typeahead-popup"></div>');
				popup.append('<div ng-repeat="$item in source | filter: inputValue track by $index" ng-click="selectItem()" jlg-active><span ng-include="\'' + template + '\'"></span></div>');
				popup.append('<div ng-show="noResultFound" class="noResultFound">Aucun résultat trouvé</div>');
				console.log('popup', popup);
				var host = (attrs.popup) ? $(attrs.popup) : element;
				
				host.append(popup);
				$compile(popup)(scope);
				
				input.on('focus', function() {
					if ($rootScope.cfg.isMobile) {
						console.log('focus isMobile');
						scope.inputValue = '';
					} else {
						console.log('focus isMobile false');
						$(this).select();
					}
					
					if (scope.inputValue == undefined) {
						// force the watch the first time by updating the ngModel from undefined to ''.
						scope.inputValue = '';
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
					//scope.selectItem();
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
				
				popup.on('touchstart', function() {
					$rootScope.debug = 'touchstart';
					input.blur();
					scope.$apply();
				});
				
				scope.$watch('activeItem', function(newValue, oldValue) {
					console.log('scope.activeItem', scope.activeItem);
					popup.children().eq(newValue).addClass('active');
					popup.children().eq(oldValue).removeClass('active');
				});
				
				scope.$watch('inputValue', function(newValue, oldValue) {
					console.log('watch inputValue', newValue);
					scope.filteredList = filterFilter(scope.source, newValue);
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
					element.addClass('tag-visible');
					if (attrs.onSelectItem) {
						scope.$parent.$eval(attrs.onSelectItem);
					}
					
					
				};
				
				scope.remove = function() {
					console.log('close', scope, ctrl);
					ctrl.$setViewValue('');
					ctrl.$commitViewValue();
					scope.isInputVisible = true;
					scope.isPopupVisible = false;
					element.removeClass('tag-visible');
				};
			}
		};
	}]);
	
	app.directive('jlgActive', ['$injector', function($injector) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var selectFn = function() {
					scope.$parent.activeItem = scope.$index;
					scope.$apply();
				}
				
				element.bind('mouseenter', selectFn);
				// for tactile interface
				element.bind('touchstart', selectFn);
				
				
			}
		};
	}]);
	
	
})();
