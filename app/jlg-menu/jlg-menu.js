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
			this.open(this.initialPage);
		};
		
		this.open = function(templateUrl) {
			var self = this;
			$templateRequest(templateUrl).then(function(response) {
				div.append(response);
				console.log('response', self.element);
				$compile(div.children())($scope);
			}).catch(function(error) {
				console.error('error', error);
			});
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
				ctrl.init();
			}
		};
	}]);

})();
