(function (root) {
	"use strict";
	function Observable(obj) {
		if(obj !== undefined && (typeof obj !== 'object' || !obj)) {
			throw new TypeError('Value must be undefined or object');
		}
		this.obj = obj || {};
		this._watchers = [];
	}

	/**
	 * Get an object value based on keyPath
	 * @param {string} keyPath Path to a value i.e. "hello" or "hello.world.mine"
	 * @param {boolean} loose Do not throw errors, return undefined instead
	 * @returns {*}
	 */
	Observable.prototype.get = function (keyPath, loose) {
		if (!keyPath) {
			return this.obj;
		}
		var parts = keyPath.split('.');
		var val = this.obj;
		for (var i = 0; i < parts.length; i++) {
			if (!val) {
				if (loose) {
					return void 0;
				} else {
					throw new Error('Invalid keyPath: ' + keyPath);
				}
			}
			val = val[parts[i]];
		}
		return val;
	};

	/**
	 * Set an object value base on the keyPath
	 * @param {string} keyPath Path to a property i.e. "hello" or "hello.world.mine"
	 * @param {*} value
	 * @param {boolean} [silence] Do not notify subscribers
	 */
	Observable.prototype.set = function (keyPath, value, silence) {
		var i, parts, val;
		if (!keyPath) {
			this.obj = value;
		} else {
			parts = keyPath.split('.');
			val = this.obj;
			for (i = 0; i < parts.length; i++) {
				if (!val) {
					throw new Error('Invalid keyPath: ' + keyPath);
				}
				if (i === parts.length - 1) {
					val[parts[i]] = value;
					break;
				}
				val = val[parts[i]];
			}
		}

		if (!silence) {
			for (i = 0; i < this._watchers.length; i++) {
				if (!this._watchers[i].keyPath ||
					!keyPath ||
					this._watchers[i].keyPath === keyPath ||
					this._watchers[i].keyPath.match(new RegExp('^' + keyPath.replace('.', '\\.') + '\\..*?')) ||
					keyPath.match(new RegExp('^' + this._watchers[i].keyPath.replace('.', '\\.') + '\\..*?'))) {
					this._watchers[i].callback(this.get(this._watchers[i].keyPath, true), this._watchers[i].keyPath);
				}
			}
		}
	};

	/**
	 * Call a callback every time a object property changes
	 * @param {string} keyPath Path to a property i.e. "hello" or "hello.world.mine"
	 * @param {function} callback Callback with signature function(value, keyPath) {}
	 */
	Observable.prototype.subscribe = function (keyPath, callback) {
		this._watchers.push({
			keyPath:  keyPath,
			callback: callback
		});
	};

	/**
	 * Remove a callback at a given keyPath, not specifying callback will remove all callbacks at the keyPath
	 * @param {string} keyPath Path to a property i.e. "hello" or "hello.world.mine"
	 * @param {function} callback
	 */
	Observable.prototype.unsubscribe = function (keyPath, callback) {
		for (var i = this._watchers.length - 1; i >= 0; i--) {
			if (this._watchers[i].keyPath === keyPath && (!callback || this._watchers[i].callback === callback)) {
				this._watchers.splice(i, 1);
			}
		}
	};

	/**
	 * Takes in an array or obj and create an Observable for each property
	 * @param obj
	 * @returns {*}
	 */
	Observable.toObservables = function(obj) {
		if(typeof obj !== 'object' || !obj) {
			throw new TypeError('Value must be an object')
		}
		for(var prop in obj) {
			if(obj.hasOwnProperty(prop)) {
				obj[prop] = new Observable(obj[prop]);
			}
		}
		return obj;
	};

	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(Observable);
	} else if (typeof module !== 'undefined' && typeof module.exports === 'object') {
		// CommonJS
		module.exports = Observable;
	} else {
		// Browser globals
		root.Observable = Observable;
	}

})(this);
