(function() {
	'use strict';

	var app = angular.module('jlg-database', []);

	app.run(['$injector', function($injector) {
		var $rootScope = $injector.get('$rootScope');
		var $document = $injector.get('$document');
		var $window = $injector.get('$window');
		console.log('running module jlg-database');



	}]);

	var ctrl = ['$scope', '$element', '$attrs', '$injector', function($scope, $element, $attrs, $injector) {
		var $q = $injector.get('$q');
		var $http = $injector.get('$http');

		console.log('starting jlg-schema controller ', arguments);
		indexedDB.deleteDatabase($attrs.jlgSchema);
		var schemaBuilder = lf.schema.create($attrs.jlgSchema, 1);
		var db;
		var promise = $q.when('start');
		var tableMap = {};

		this.declareTable = function(name, element) {
			var csvName = './csv/' + name + '.csv';
			promise = promise.then(function() {
				return $http.get(csvName);
			}).then(function(response) {
				var csv = Papa.parse(response.data, {
					header: true,
					skipEmptyLines: true
				}).data;
				console.log('csv', csv);
				console.log('name', name);
				var table = schemaBuilder.createTable(name);
				for (var key in csv[0]) {
					if (csv[0].hasOwnProperty(key)) {
						console.log('adding column ' + key);
						table = table.addColumn(key, lf.Type.STRING);
					}
				}
				table = table.addPrimaryKey(['id']);
				tableMap[name] = {
					csv: csv,
					element: element
				};
			}).catch(function(error) {
				console.error('error', error);
				return $q.reject(error);
			});
		};

		this.populate = function() {
			promise = promise.then(function() {
				console.log('about to connect');
				return schemaBuilder.connect({});
			}).then(function(myDb) {
				db = myDb;
				console.log('connected!', db);
				for (var tableName in tableMap) {
					if (tableMap.hasOwnProperty(tableName)) {
						(function() {
							console.log('populating ', tableName);
							var table = db.getSchema().table(tableName);
							var rows = tableMap[tableName].csv.map(function(row) {
								console.log('row', row);
								return table.createRow(row);
							});
							var element = tableMap[tableName].element;
							promise = promise.then(function() {
								console.log('about to insert', rows);
								return db.insertOrReplace().into(table).values(rows).exec();
							}).then(function(response) {
								console.log('response', response);
								return db.select().from(table).exec();
							}).then(function(results) {
								results.forEach(function(row) {
									console.log('selected row', row);

								});
								element.text(angular.toJson(results));
								return true;
							});
						})();
					}
				}
				promise = promise.catch(function(error) {
					console.error('error', error);
					return $q.reject(error);
				});
			});




		};



	}];


	app.directive('jlgSchema', ['$injector', function($injector) {
		var $compile = $injector.get('$compile');
		var $q = $injector.get('$q');
		var $http = $injector.get('$http');

		return {
			restrict: 'EAC',
			scope: {},
			controller: ctrl,
			link: function(scope, element, attrs, ctrl) {
				console.log('link jlg-schema', arguments);
				ctrl.populate();
			}
		};
	}]);

	app.directive('jlgTable', ['$injector', function($injector) {
		var $compile = $injector.get('$compile');
		var $q = $injector.get('$q');

		return {
			restrict: 'EAC',
			require: '^jlgSchema',
			scope: {},
			link: function(scope, element, attrs, ctrl) {
				console.log('link jlgTable', arguments);
				console.log('about to create table', attrs.jlgTable);
				ctrl.declareTable(attrs.jlgTable, element);
			}
		};
	}]);

})();
