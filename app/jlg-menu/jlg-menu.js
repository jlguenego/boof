(function() {
	'use strict';

	var app = angular.module('jlg-menu', ['jlg-responsive']);
	
	app.run(['$injector', function($injector) {
		var $rootScope = $injector.get('$rootScope');
		console.log('jlg-menu: run');

	}]);
	
	app.controller('jlg-menu.Ctrl', ['$injector', '$scope', function($injector, $scope) {
		var $templateRequest = $injector.get('$templateRequest');
		var $compile = $injector.get('$compile');
		
		var div = angular.element('<div class="jlg-menu-frame"></div>');
		
		this.init = function() {
			console.log('jlg-menu ctrl.init');
			this.element.append(div);
		};
		
		this.visible = false;
		this.toggle = function(name) {
			console.log('toggle');
			this.visible = !this.visible;
			if (!this.visible) {
				return;
			}
			console.log(this.initialPage);
			this.open(this.initialPage, this.initialTitle);
		};
		
		this.open = function(templateUrl, title) {
			var self = this;
			$templateRequest(templateUrl).then(function(response) {
				var total = angular.element('<div class="jlg-menu-panel"></div>');
				total.append(self.makeTitle(title));
				total.append(response);
				
				
				div.append(total);
				$compile(div.children())($scope);
			}).catch(function(error) {
				console.error('error', error);
			});
		};
		
		this.makeTitle = function(title) {
			var titleDiv = '<div class="jlg-menu-title">' + title + '</div>';
			var close = '<div class="jlg-menu-close"><div class="glyphicon glyphicon-remove" ng-click="' + this.name + '.toggle()"></div></div>';
			var backDiv = '<div ng-click="' + this.name + '.back()" class="jlg-menu-back">&lt;Back</div>';
			var result = angular.element('<div class="jlg-menu-title-bar"></div>');
			result.append(backDiv);
			result.append(titleDiv);
			result.append(close);
			return result;
			
		};
		
		this.back = function() {
			console.log('back');
		};
		
		
		
	}]);
	
	app.directive('jlgMenu', ['$injector', function($injector) {
		var $templateRequest = $injector.get('$templateRequest');
		var $compile = $injector.get('$compile');

		return {
			restrict: 'EAC',
			link: function(scope, element, attrs) {
				console.log('link jlgMenuLayer', scope, attrs);
				var ctrl = scope[attrs.ctrl];
				ctrl.element = element;
				ctrl.initialPage = attrs.init;
				ctrl.initialTitle = attrs.title;
				ctrl.name = attrs.ctrl;
				ctrl.init();
			}
		};
	}]);

})();
