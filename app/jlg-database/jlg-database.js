(function() {
	'use strict';

	var app = angular.module('jlg-database', []);

	app.run(['$injector', function($injector) {
		var $rootScope = $injector.get('$rootScope');
		var $document = $injector.get('$document');
		var $window = $injector.get('$window');
		console.log('loading jlg-database');


	}]);

	app.factory('jlg-database.db', ['$injector', function($injector) {
		var $http = $injector.get('$http');

		console.log('instanciating the service kiki');

		var schema = lf.schema.create('jlg-schema', 1);


		var tableMap = {};

		var loadTableFromCsv = function(tableName) {
			var csvFilename = 'csv/' + tableName + '.csv';
			console.log('loading table from csv file: ', csvFilename);
			$http.get(csvFilename).then(function(response) {
				var csv = Papa.parse(response.data, {
					header: true,
					skipEmptyLines: true
				});
				console.log('csv', csv);

				var table = schema.createTable(tableName);
				console.log('table created', tableName);
				for (var key in csv.data[0]) {
					console.log('key', key);
					table.addColumn(key, lf.Type.STRING);
				}
				table.addPrimaryKey(['id']);
				console.log('columns added');

				var db;
				schema.connect().then(function(myDb) {
					db = myDb;
					console.log('connected, get table ', tableName);
					var table = db.getSchema().table(tableName);
					var rows = csv.data.map(function(record) {
						console.log(record);
						return table.createRow(record);
					});
					console.log('rows prepared');
					return db.insertOrReplace().into(table).values(rows).exec();
				}).then(function() {
					console.log('rows inserted');
				}).catch(function(error) {
					console.error('db error', error);
				}).then(function() {
					db.close();
				});

				tableMap[tableName] = tableName;
			}).catch(function(error) {
				console.error('error', error);
			});
		};

		var isTableExists = function(tableName) {
			return tableMap[tableName] !== undefined;
		};

		return {
			loadTableFromCsv:loadTableFromCsv,
			isTableExists: isTableExists,
			tableMap: tableMap
		};
	}]);

	app.directive('jlgTable', ['$injector', function($injector) {
		var $compile = $injector.get('$compile');
		var $q = $injector.get('$q');
		var db = $injector.get('jlg-database.db');

		return {
			restrict: 'EAC',
			link: function(scope, element, attrs, ctrl) {
				console.log('link jlgTable', attrs.jlgTable);
				var request = attrs.jlgTable;
				var tableName = request;
				if (!db.isTableExists(tableName)) {
					db.loadTableFromCsv(tableName);
				}
			}
		};
	}]);

})();
