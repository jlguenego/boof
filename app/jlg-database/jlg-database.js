(function() {
	'use strict';

	var app = angular.module('jlg-database', []);

	app.run(['$injector', function($injector) {
		var $rootScope = $injector.get('$rootScope');
		var $document = $injector.get('$document');
		var $window = $injector.get('$window');
		console.log('running module jlg-database');

		$rootScope.jlgDatabase = {};


	}]);

	var ctrl = function($scope, $element, $attrs, $injector) {
		var $rootScope = $injector.get('$rootScope');
		console.log('starting jlg-schema-scope controller ', arguments);
		this.schema = $rootScope.jlgDatabase[$attrs.jlgSchemaScope];
	};
	ctrl.$inject = ['$scope', '$element', '$attrs', '$injector'];

	app.directive('jlgSchemaScope', ['$injector', function($injector) {
		var $compile = $injector.get('$compile');
		var $q = $injector.get('$q');
		var $http = $injector.get('$http');

		return {
			restrict: 'EAC',
			scope: {},
			controller: ctrl,
			link: function(scope, element, attrs, ctrl) {
				console.log('link jlg-schema-scope', arguments);
			}
		};
	}]);

	app.directive('jlgTable', ['$injector', function($injector) {
		var $compile = $injector.get('$compile');
		var $q = $injector.get('$q');

		return {
			restrict: 'EAC',
			require: '^jlgSchemaScope',
			scope: {},
			link: function(scope, element, attrs, ctrl) {
				console.log('link jlgTable', arguments);
				var tableName = attrs.jlgTable;
				console.log('tableName', tableName);
				scope.schema = ctrl.schema;
				scope.$watch('schema.state', function(newValue, oldValue) {
					console.log('schema.state', newValue, oldValue);
					if (newValue === 'loaded' && oldValue === undefined) {
						scope.schema.promise = scope.schema.promise.then(function() {
							console.log('about to select * from', tableName);
							var table = scope.schema.db.getSchema().table(tableName);
							return scope.schema.db.select().from(table).exec();
						}).then(function(results) {
							results.forEach(function(row) {
								console.log('selected row', row);
							});
							scope.data = {
								fields: ctrl.schema.tableMap[tableName].fields,
								contents: results
							};
						}).catch(function(error) {
							console.error('error', error);
							return $q.reject(error);
						});
					}
				});

				scope.$watch('data', function() {
					console.log('data updated', scope.data);
					element.html('');
					if (scope.data === undefined || scope.data.fields === undefined) {
						return;
					}

					var table = angular.element('<table class="table table-striped table-bordered table-hover"></table>');
					var thead = angular.element('<thead></thead>');
					var tr = angular.element('<tr></tr>');
					for (var i = 0; i < scope.data.fields.length; i++) {
						tr.append('<th>' + scope.data.fields[i] + '</th>');
					}
					thead.append(tr);
					var tbody = angular.element('<tbody></tbody>');
					var row = angular.element('<tr ng-repeat="row in data.contents track by $index"></tr>');
					for (var j = 0; j < scope.data.fields.length; j++) {
						row.append('<td>{{row["' + scope.data.fields[j] + '"]}}</td>');
					}
					tbody.append(row);
					table.append(thead);
					table.append(tbody);
					element.append(table);
					$compile(element.contents())(scope);
				}, true);
			}
		};
	}]);

	var jlgSchemaDirCtrl = function($scope, $element, $attrs, $injector) {
		var $q = $injector.get('$q');
		var $http = $injector.get('$http');
		var $rootScope = $injector.get('$rootScope');

		var schema = {};

		console.log('$scope.options', $scope.options);
		if ($scope.options.rebuild) {
			console.log('rebuild is true. deleting the database.', $attrs.name);
			indexedDB.deleteDatabase($attrs.name);
		}

		schema.builder = lf.schema.create($attrs.name, 1);
		schema.promise = $q.when('start');
		schema.tableMap = {};
		schema.db = undefined;
		schema.state = undefined;
		schema.toBeDeclaredTotal = 0;

		this.schema = schema;
		$scope.schema = schema;
		$rootScope.jlgDatabase[$attrs.name] = schema;

		this.declareTableFromCsv = function(tableName, csvName) {
			schema.toBeDeclaredTotal++;
			schema.promise = schema.promise.then(function() {
				console.log('csvName', csvName);
				return $http.get(csvName);
			}).then(function(response) {
				var p = Papa.parse(response.data, {
					header: true,
					skipEmptyLines: true
				});
				var csv = p.data;
				var fields = p.meta.fields;
				var table = schema.builder.createTable(tableName);
				for (var key in csv[0]) {
					if (csv[0].hasOwnProperty(key)) {
						console.log('adding column ' + key);
						table = table.addColumn(key, lf.Type.STRING);
					}
				}
				table = table.addPrimaryKey(['id']);
				schema.tableMap[tableName] = {
					csv: csv,
					fields: fields
				};
				schema.toBeDeclaredTotal--;
			}).catch(function(error) {
				console.error('error', error);
				return $q.reject(error);
			});
		};


		this.connect = function() {
			schema.promise = schema.promise.then(function() {
				console.log('about to connect');
				return schema.builder.connect({});
			}).then(function(db) {
				schema.db = db;
				console.log('connected!', db);
			}).catch(function(error) {
				console.error('error', error);
				return $q.reject(error);
			});
			this.populateAll();
		};


		this.populateAll = function() {
			console.log('this', this, schema.tableMap);
			for (var tableName in schema.tableMap) {
				console.log('populate tableName ', tableName);
				if (schema.tableMap.hasOwnProperty(tableName)) {
					this.populate(tableName);
				}
			}
			schema.promise = schema.promise.then(function() {
				console.log('all populated');
				schema.state = 'loaded';
			});
		}.bind(this);

		this.populate = function(tableName) {
			console.log('populate ', tableName);
			schema.promise = schema.promise.then(function() {
				console.log('populating ', tableName);
				var table = schema.db.getSchema().table(tableName);
				var rows = schema.tableMap[tableName].csv.map(function(row) {
					console.log('row', row);
					return table.createRow(row);
				});

				console.log('about to insert', rows);
				return schema.db.insertOrReplace().into(table).values(rows).exec();
			}).then(function(response) {
				console.log('insert successfull, response', response);
			}).then(function() {
				var table = schema.db.getSchema().table(tableName);
				return schema.db.select().from(table).exec();
			}).then(function(results) {
				results.forEach(function(row) {
					console.log('selected row', row);
				});
			}).catch(function(error) {
				console.error('error', error);
				return $q.reject(error);
			});

		};

	};

	jlgSchemaDirCtrl.$inject = ['$scope', '$element', '$attrs', '$injector'];

	app.directive('jlgSchema', ['$injector', function($injector) {
		var $compile = $injector.get('$compile');
		var $q = $injector.get('$q');
		var $rootScope = $injector.get('$rootScope');

		return {
			restrict: 'EAC',
			scope: {
				options: '=options'
			},
			controller: jlgSchemaDirCtrl,
			link: function(scope, element, attrs, ctrl) {
				console.log('link jlgSchema', arguments);


				scope.$watch('schema.toBeDeclaredTotal', function(newValue, oldValue) {
					console.log('watch schema.toBeDeclared', arguments);
					if (newValue === 0 && oldValue === 1) {
						console.log('program the connection');
						ctrl.connect();
					}
				});
			}
		};
	}]);

	app.directive('jlgDeclare', ['$injector', function($injector) {
		var $compile = $injector.get('$compile');
		var $q = $injector.get('$q');
		var $http = $injector.get('$http');

		return {
			restrict: 'EAC',
			require: '^jlgSchema',
			scope: {
			},
			link: function(scope, element, attrs, ctrl) {
				console.log('link jlgSchema', arguments);


				if (attrs.type === 'Table' && attrs.srcType === 'csv') {
					ctrl.declareTableFromCsv(attrs.name, attrs.src);
				}
			}
		};
	}]);

})();
