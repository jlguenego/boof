(function() {
	'use strict';

	var app = angular.module('jlg-typeahead', ['jlg-responsive']);
	

	
	app.directive('jlgTypeahead', ['$injector', function($injector) {
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
				ctrl.initMenu();
			}
		};
	}]);
})();
