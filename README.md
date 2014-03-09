observable
==========

Simple observable class (similar to watchjs) for use with rivetsjs and other libraries

[![Build Status](https://travis-ci.org/taylorhakes/observable.png)](https://travis-ci.org/taylorhakes/observable)


####Simple Use

```
// Basic object
var myObj = {
  hello: 'world'
};

// Make the object obserable
var observe = new Observable(myObj);

function callback(value, path) {
  console.log(value, path);
}

// Listen for changes to 'hello' property
observe.subscribe('hello', callback);

// Update the value of the hello property
observe.set('hello', 'newValue'); // 'newValue', 'hello' logged to console because of subscriber

// Stop listening to changes
observe.unsubscribe('hello', callback);
```

####Nested Object listening

```
// Created Object
var nestedObj = {
  hello: {
    nested: {
      fartherNested: {
        num: 1234
      }
    }
  }
}

// Make observable
var observe = new Observable(myObj);

function callback(value, path) {
  console.log(value, path);
}

// Listen for changes to 'num' property
observe.subscribe('hello.nested.fartherNested.num', callback);

// Update the value of the 'num property
observe.set('hello.nested.fartherNested.num', 5678); // 5678, 'hello.nested.fartherNested.num' logged to console because of subscriber

// Stop listening to changes
observe.unsubscribe('hello.nested.fartherNested.num', callback);
```

####Subscribers
- If a subscriber is listening to 'hello.nested.fartherNested.num' and 'hello' is set, the callback will be called
- If a subscriber is listening to 'hello' and 'hello.nested.fartherNested' changes, the callback will be called


#####Unsubscribe from all at keypath
- If you don't specify a callback all subscribers will be removed on that keypath
```
observe.unsubscribe('hello')
```


