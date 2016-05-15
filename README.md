# Domain bus

Seamless communication between browser tabs/windows on the same domain.

## Examples

```js
var Bus = require('domain-bus');

var bus = new Bus();

bus.listen(function( message ){
	if (message === 'ping')
		bus.write('pong');

	console.log(message);
});

bus.write('ping');
```

Run the above script in a minimum of two tabs simultaneously.

Open `example.html` in multiple tabs to see a very basic chat functionality.

## Interface

```js
var bus = new Bus({
	// defaults
	env: window,
	namespace: '',
});

// write a message to the bus. Any JSON value is supported via JSON.stringify.
bus.write(message);

bus.listen(fn); // `fn(message)` will be called for each received message
```
