'use strict';

var test = require('tape');

var Bus = require('./');

test('No echo', function( t ){
	var a = Bus({ env: {} });

	a.listen(function( m ){
		t.fail('Should not receive own message');
	});

	a.write('Own test');

	t.end();
});

test('Internal messaging', function( t ){
	t.plan(1);

	var env = {};

	Bus({ env: env }).listen(function( m ){
		t.ok('Received internal message');
	});

	Bus({ env: env }).write('Internal messaging');
});

test('Namespaces', function( t ){
	var env = {};

	Bus({ env: env, namespace: 'other' }).listen(function( m ){
		console.log(m)
		t.fail('Receives nothing on different namespace');
	});

	Bus({ env: env }).write('namespace test');

	t.end();
});

if (typeof window !== 'undefined'){
	test('`window` as environment', function( t ){
		t.plan(1);

		Bus().listen(function( m ){
			if (m === 'window environment');
				t.ok('Received message');
		});

		Bus().write('window environment');
	});
}
