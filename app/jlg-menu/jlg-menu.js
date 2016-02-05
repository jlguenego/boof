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
		var $q = $injector.get('$q');
		
		var frame = angular.element('<div class="jlg-menu-frame"></div>');
		
		var duration = 500;
		
		var animate = function(element, from, to, done) {
			element.css({
				position: 'absolute',
				top: 0,
				left: from,
				display: 'block'
			});

			jQuery(element).velocity({
				left: to
			}, duration, done);
		};
		
		var animateAsync = function(element, from, to) {
			return $q(function(resolve, reject) {
				animate(element, from, to, resolve);
			});
		};
		
		var panels = [];
		var width = 400;
		
		
		this.initMenu = function() {
			console.log('jlg-menu ctrl.initMenu');
			this.element.append(frame);
		};
		
		this.visible = false;
		this.toggle = function(name) {
			console.log('toggle');
			this.visible = !this.visible;
			if (!this.visible) {
				return;
			}
			console.log(this.initialPage);
			this.reset();
		};
		
		this.reset = function() {
			
			this.open(this.initialPage, this.initialTitle);
		};
		
		this.open = function(templateUrl, title) {
			var self = this;
			$templateRequest(templateUrl).then(function(response) {
				var panel = angular.element('<div class="jlg-menu-panel"></div>');
				panel.append(self.makeTitle(title));
				panel.append(response);
				
				
				
				frame.append(panel);
				panels.push({templateUrl: templateUrl, title: title});
				panel = frame.children().eq(panels.length - 1);
				$compile(panel)($scope);
				return animateAsync(panel, width, 0);
			}).then(function() {
				console.log('animation finished.');
			}).catch(function(error) {
				console.error('error', error);
			});
		};
		
		this.makeTitle = function(title) {
			var titleDiv = '<div class="jlg-menu-title">' + title + '</div>';
			var closeDiv = '<div class="jlg-menu-close"><div class="glyphicon glyphicon-remove" ng-click="' + this.name + '.toggle()"></div></div>';
			var backDiv = '<div ng-click="' + this.name + '.back()" class="jlg-menu-back">&lt;Back</div>';
			var result = angular.element('<div class="jlg-menu-title-bar"></div>');
			result.append(backDiv);
			result.append(titleDiv);
			result.append(closeDiv);
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
				ctrl.initMenu();
			}
		};
	}]);

})();
