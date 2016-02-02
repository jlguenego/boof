(function() {
	'use strict';

	var app = angular.module('jlg-menu', []);
	
	app.run(['$injector', function($injector) {
		var $rootScope = $injector.get('$rootScope');
		console.log('jlg-menu: run');

	}]);
	
	app.controller('jlg-menu.Ctrl', ['$injector', function($injector) {
		
		this.visible = false;
		this.toggle = function(name) {
			console.log('toggle');
			this.visible = !this.visible;
		};
		
	}]);
	
	app.directive('jlgMenu', ['$injector', function($injector) {
		var $templateRequest = $injector.get('$templateRequest');
		var $compile = $injector.get('$compile');

		return {
			restrict: 'EAC',
			link: function(scope, element, attrs, ctrl) {
				console.log('link jlgMenuLayer', ctrl);
			}
		};
	}]);

})();
