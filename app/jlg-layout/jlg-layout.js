(function() {
	'use strict';

	var app = angular.module('jlg-layout', []);

	app.run(function() {
		
	});
	
	app.directive('jlgLayout', ['$injector', function($injector) {
		var $window = $injector.get('$window');
		return {
			restrict: 'ECA',
			require: 'jlgLayout',
			scope: {},
			link: function(scope, element, attrs, ctrl) {
				console.log('jlgLayout', arguments);
				console.log('containers', ctrl.containers);
				var refresh = function() {
					//console.log('onresize');
					var totalHeight = 0;
					var parentHeight = element.height();
					ctrl.containers.forEach(function(container, i) {
						//console.log('container', container, i);
						if (container.cfg.height != undefined) {
							var height = parseInt(container.cfg.height);
							totalHeight += height;
							container.element.css('height', container.cfg.height);
						}
					});
					ctrl.containers.forEach(function(container, i) {
						//console.log('container', container, i);
						if (container.cfg.height == undefined) {
							var height = (parentHeight - totalHeight) / ctrl.unspecifiedHeightCounter;
							container.element.css('height', height + 'px');
						}
					});
				};
				$window.onresize = refresh;
				refresh();
				
				
			},
			controller: ['$scope', '$injector', function ($scope, $injector) {
				console.log('instanciation of the jlgLayout container. Scope=', $scope);
				this.containers = [];
				this.unspecifiedHeightCounter = 0;
			}]
		};
		
	}]);
	
	app.directive('jlgLayoutContainer', ['$injector', function($injector) {
		return {
			restrict: 'ECA',
			require: '^jlgLayout',
			link: function(scope, element, attrs, ctrl) {
				console.log('jlgLayoutContainer', arguments);
				
				var cfg = {};
				if (attrs.jlgLayoutContainer != '') {
					console.log('attrs.jlgLayoutContainer', attrs.jlgLayoutContainer);
					cfg = scope.$eval(attrs.jlgLayoutContainer);
				}
				if (cfg.height == undefined) {
					ctrl.unspecifiedHeightCounter++;
				}
				var container = {cfg: cfg, element: element};
				ctrl.containers.push(container);
			}
		};
		
	}]);


})();
