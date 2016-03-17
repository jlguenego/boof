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
			scope: {
				cfg: '=jlgLayout'
			},
			link: function(scope, element, attrs, ctrl) {
				console.log('jlgLayout', arguments);
				console.log('containers', ctrl.containers);
				var refresh = function() {
					console.log('refresh');

					// remove unwanted whitespace (for avoiding 4px line in col mode)
					element.contents().filter(function() {
						return this.nodeType == 3;
					}).remove();

					var totalSize = 0;
					var isRow = scope.cfg.flow == 'row';
					var parentSize = isRow ? element.height() : element.width();
					var cssSizeName = isRow ? 'height' : 'width';
					var cssOrthoSizeName = isRow ? 'width' : 'height';
					ctrl.containers.forEach(function(container, i) {
						//console.log('container', container, i);

						container.element.css(cssOrthoSizeName, '100%');
						var display = isRow ? 'block' : 'inline-block';
						container.element.css('display', display);

						if (container.cfg.size !== undefined) {
							var size = parseInt(container.cfg.size);
							totalSize += size;

							container.element.css(cssSizeName, size + 'px');

						}
					});
					ctrl.containers.forEach(function(container, i) {
						//console.log('container', container, i);
						if (container.cfg.size === undefined) {
							var size = (parentSize - totalSize) / ctrl.unspecifiedSizeCounter;
							container.element.css(cssSizeName, size + 'px');
						}
					});
				};
				angular.element($window).on('resize', refresh);
				scope.$watch('cfg', refresh, true);
				refresh();


			},
			controller: ['$scope', '$injector', function($scope, $injector) {
				console.log('instanciation of the jlgLayout container. Scope=', $scope);
				this.containers = [];
				this.unspecifiedSizeCounter = 0;
			}]
		};

	}]);

	app.directive('jlgLayoutContainer', ['$injector', function($injector) {
		return {
			restrict: 'ECA',
			require: '^jlgLayout',
			scope: {
				cfg: '=jlgLayoutContainer'
			},
			link: function(scope, element, attrs, ctrl) {
				console.log('jlgLayoutContainer', arguments);

				var cfg = {};
				console.log('scope.cfg', scope.cfg);
				if (scope.cfg !== undefined) {
					cfg = scope.cfg;
				}
				if (cfg.size === undefined) {
					ctrl.unspecifiedSizeCounter++;
				}
				var container = {cfg: cfg, element: element};
				ctrl.containers.push(container);
			}
		};

	}]);


})();
