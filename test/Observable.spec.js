describe('Observable', function() {
	describe('base', function() {
		it('Undefined', function() {
			var observe = new Observable();
			expect(observe.obj).toEqual({});
		});
		it('Plain Object', function() {
			var testObj = {
				hello: 'world'
			};
			var observe = new Observable(testObj);
			expect(observe.obj).toBe(testObj);
		});
		it('Custom Object', function() {
			var testObj = ['hello', 'world'];
			var observe = new Observable(testObj);
			expect(observe.obj).toBe(testObj);
		});
	});
	describe('get', function() {
		it('empty', function() {
			var testObj = {
				hello: 'world'
			};
			var observe = new Observable(testObj);
			expect(observe.get()).toBe(testObj);
		});
		it('single key', function() {
			var testObj = {
				nice: 'fun',
				hello: 'world',
				good: 123
			};
			var observe = new Observable(testObj);
			expect(observe.get('hello')).toBe('world');
		});
		it('single key undefined', function() {
			var testObj = {
				nice: undefined,
				hello: 'world',
				good: 123
			};
			var observe = new Observable(testObj);
			expect(observe.get('nice')).toBe(undefined);
		});
		it('2 keys', function() {
			var testObj = {
				nice: undefined,
				hello: 'world',
				good:  {
					   one: 'yep',
					   hate: 'it',
					   not: 234324
				}
			};
			var observe = new Observable(testObj);
			expect(observe.get('good.hate')).toBe('it');
		});
		it('4 keys', function() {
			var testObj = {
				nice: undefined,
				hello: 'world',
				good:  {
					one: 'yep',
					hate: 'it',
					not: {
						 yes: {
							  nope: true,
							  none: 123
						 },
						 mine: {
							   yours: 343,
							   maybe: 'hello'
						 }
					}
				}
			};
			var observe = new Observable(testObj);
			expect(observe.get('good.not.yes.nope')).toBe(true);
		});
		it('Last Key missing', function() {
			var testObj = {
				nice: undefined,
				hello: 'world',
				good:  {
					one: 'yep',
					hate: 'it',
					not: {
						yes: {
							none: 123
						},
						mine: {
							yours: 343,
							maybe: 'hello'
						}
					}
				}
			};
			var observe = new Observable(testObj);
			expect(observe.get('good.not.yes.nope')).toBe(undefined);
		});
		it('Invalid path', function() {
			var testObj = {
				nice: undefined,
				hello: 'world',
				good:  {
					one: 'yep',
					hate: 'it',
					not: {
						yes: {
							nope: true,
							none: 123
						},
						mine: {
							yours: 343,
							maybe: 'hello'
						}
					}
				}
			};
			var observe = new Observable(testObj);
			expect(function() {
				observe.get('good.not.ye.nope')
			}).toThrow('Invalid keyPath');
		});

	});
	describe('set', function() {
		it('empty', function() {
			var testObj = {
				hello: 'world'
			};
			var setObj = {
				mine: 123
			};
			var observe = new Observable(testObj);
			observe.set('',setObj);
			expect(observe.obj).toBe(setObj);
		});
		it('single key', function() {
			var testObj = {
				hello: 'world'
			};
			var val = 555;
			var observe = new Observable(testObj);
			observe.set('hello',val);
			expect(observe.obj.hello).toBe(val);
		});
		it('2 keys', function() {
			var testObj = {
				hello:  {
						world: 'minse',
						yes: 'no'
				},
				cool: {
					  good: 'bad'
				},
				beans: {
					   now: 'then'
				}
			};
			var val = 555;
			var observe = new Observable(testObj);
			observe.set('cool.good',val);
			expect(observe.obj.cool.good).toBe(val);
		});
		it('4 keys', function() {
			var testObj = {
				hello:  {
					world: 'minse',
					yes: 'no'
				},
				cool: {
					good: {
						  more: 'now',
						  might: {
								 need: 'one'
						  },
						  have : 'some'
					}
				},
				beans: {
					now: 'then'
				}
			};
			var val = 555;
			var observe = new Observable(testObj);
			observe.set('cool.good.might.need',val);
			expect(observe.obj.cool.good.might.need).toBe(val);
		});
		it('4 keys', function() {
			var testObj = {
				hello:  {
					world: 'minse',
					yes: 'no'
				},
				cool: {
					good: {
						more: 'now',
						might: {
							need: 'one'
						},
						have : 'some'
					}
				},
				beans: {
					now: 'then'
				}
			};
			var val = 555;
			var observe = new Observable(testObj);
			observe.set('cool.good.might.not',val);
			expect(observe.obj.cool.good.might.not).toBe(val);
		});
		it('Invalid path', function() {
			var testObj = {
				hello:  {
					world: 'minse',
					yes: 'no'
				},
				cool: {
					good: {
						more: 'now',
						might: {
							need: 'one'
						},
						have : 'some'
					}
				},
				beans: {
					now: 'then'
				}
			};
			var val = 555;
			var observe = new Observable(testObj);
			expect(function() {
				observe.set('cool.good.mit.need',val)
			}).toThrow('Invalid keyPath');
		});
	});
	describe('subscribe', function() {
		var testObj
		beforeEach(function() {
			testObj = {
				nice: undefined,
				hello: 'world',
				good:  {
					one: 'yep',
					hate: 'it',
					not: {
						yes: {
							nope: true,
							none: 123
						},
						mine: {
							yours: 343,
							maybe: 'hello'
						}
					}
				}
			};
		});
		it('4 keys', function() {
			var observe = new Observable(testObj);
			var spy = jasmine.createSpy('Callback Spy');
			observe.subscribe('good.not.yes.nope', spy);
			observe.set('good.not.yes.nope', 77)
			expect(spy).toHaveBeenCalledWith(77, 'good.not.yes.nope');
		});
		it('4 keys 2 subscribers', function() {
			var observe = new Observable(testObj);
			var spy = jasmine.createSpy('Callback Spy');
			var spy2 = jasmine.createSpy('Callback Spy');
			observe.subscribe('good.not.yes.nope', spy);
			observe.subscribe('good.not.yes.nope', spy2);
			observe.set('good.not.yes.nope', 77)
			expect(spy).toHaveBeenCalledWith(77, 'good.not.yes.nope');
			expect(spy2).toHaveBeenCalledWith(77, 'good.not.yes.nope');
		});
		it('4 keys no call', function() {
			var observe = new Observable(testObj);
			var spy = jasmine.createSpy('Callback Spy');
			observe.subscribe('good.not.yes.no', spy);
			observe.set('good.not.yes.nope', 77)
			expect(spy).not.toHaveBeenCalled();
		});
		it('Empty string gets called always', function() {
			var observe = new Observable(testObj);
			var spy = jasmine.createSpy('Callback Spy');
			observe.subscribe('', spy);
			observe.set('good.not.yes.nope', 77);
			expect(spy).toHaveBeenCalledWith(observe.obj, '');
		});
		it('Empty keyPath calls all subscribers', function() {
			var observe = new Observable(testObj);
			var spy = jasmine.createSpy('Callback Spy');
			var spy2 = jasmine.createSpy('Callback Spy 2');
			var spy3 = jasmine.createSpy('Callback Spy 3');
			observe.subscribe('', spy);
			observe.subscribe('good.not.yes.nope', spy2);
			observe.subscribe('good.not', spy3);
			observe.set('', {});
			expect(spy).toHaveBeenCalledWith(observe.obj, '');
			expect(spy2).toHaveBeenCalledWith(undefined, 'good.not.yes.nope');
			expect(spy3).toHaveBeenCalledWith(undefined, 'good.not');
		});
		it('deeper key calls shallow subscriber', function() {
			var observe = new Observable(testObj);
			var spy = jasmine.createSpy('Callback Spy');
			observe.subscribe('good.not', spy);
			observe.set('good.not.yes.nope', 77);
			expect(spy).toHaveBeenCalledWith(observe.obj.good.not, 'good.not');
		});
		it('shallow key calls deeper subscriber', function() {
			var observe = new Observable(testObj);
			var spy = jasmine.createSpy('Callback Spy');
			observe.subscribe('good.not.yes.nope', spy);
			observe.set('good.not', {
				yes: {
					nope: 123
				}
			});
			expect(spy).toHaveBeenCalledWith(123, 'good.not.yes.nope');
		});
		it('missing key returns undefined', function() {
			var observe = new Observable(testObj);
			var spy = jasmine.createSpy('Callback Spy');
			observe.subscribe('good.not.yes.nope', spy);
			observe.set('good.not', {});
			expect(spy).toHaveBeenCalledWith(undefined, 'good.not.yes.nope');
		});
	});
	describe('unsubscribe', function() {
		var testObj
		beforeEach(function() {
			testObj = {
				nice: undefined,
				hello: 'world',
				good:  {
					one: 'yep',
					hate: 'it',
					not: {
						yes: {
							nope: true,
							none: 123
						},
						mine: {
							yours: 343,
							maybe: 'hello'
						}
					}
				}
			};
		});
		it('general', function() {
			var observe = new Observable(testObj);
			var spy = jasmine.createSpy('Callback Spy');
			observe.subscribe('good.not.yes.nope', spy);
			observe.subscribe('good.no', spy);
			observe.unsubscribe('good.not.yes.nope', spy);
			observe.set('good.not.yes.nope', 77)
			expect(spy).not.toHaveBeenCalled();
		});
		it('2 unsubscribes', function() {
			var observe = new Observable(testObj);
			var spy = jasmine.createSpy('Callback Spy');
			observe.subscribe('good.not.yes.nope', spy);
			observe.subscribe('good.not', spy);
			observe.unsubscribe('good.not.yes.nope', spy);
			observe.unsubscribe('good.not', spy);
			observe.set('good.not', 77)
			expect(spy).not.toHaveBeenCalled();
		});
		it('Unsubscribe all', function() {
			var observe = new Observable(testObj);
			var spy = jasmine.createSpy('Callback Spy');
			var spy2 = jasmine.createSpy('Callback Spy');
			var spy3 = jasmine.createSpy('Callback Spy');
			observe.subscribe('good.not.yes.nope', spy);
			observe.subscribe('good.not.yes.nope', spy2);
			observe.subscribe('good.not', spy3);
			observe.unsubscribe('good.not.yes.nope');
			observe.set('good.not', 77)
			expect(spy).not.toHaveBeenCalled();
			expect(spy2).not.toHaveBeenCalled();
			expect(spy3).toHaveBeenCalled();
		});
	});
})