'use strict';

module.exports = Bus;

var env = {};

function Bus( opts ){
	if (!(this instanceof Bus))
		return new Bus(opts);

	this._handlers = [];
	this._id = (Math.random()+'').substr(-7);
	this._count = 0;
	this._env = (opts && opts.env)
		|| (typeof window !== 'undefined' && window)
		|| env;

	var ns = this._namespace = opts && opts.namespace || '';

	this._localStorageKey = 'domain-bus:'+ns;

	if (!this._env._domainBusses)
		this._env._domainBusses = [ this ];
	else
		this._env._domainBusses.push(this);

	var bus = this;

	if (this._env.addEventListener)
		this._env.addEventListener('storage', function( e ){
			var p = JSON.parse(e.newValue);

			if (p.i === bus._id)
				return;

			if (e.key === bus._localStorageKey)
				emit(bus, p.m);
		});
}

Bus.prototype.write = write;
Bus.prototype.listen = listen;

function write( m ){
	if (this._env.localStorage)
		this._env.localStorage.setItem(this._localStorageKey, JSON.stringify({
			m: m,

			// `i` and `c` are simply here to avoid identical messages or
			// repeated messages from being squashed by the way the `storage`
			// event of localStorage works.

			i: this._id,
			c: this._count++,
		}));

	var self = this;

	this._env._domainBusses.forEach(function( bus ){
		if (bus === self || bus._namespace !== self._namespace)
			return;

		emit(bus, m);
	});

	return this;
}

function listen( fn ){
	this._handlers.push(fn);

	return this;
}

function emit( bus, value ){
	bus._handlers.forEach(function( handler ){
		handler(value);
	});
}
