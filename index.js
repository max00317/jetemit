"use strict";

exports.__esModule = true;
/**
 * @description subscribes repo
 * @private
 */
var subscribes = new Map();

/**
 * @description add listener
 * @public
 * @param {string} name name listener
 * @param {function} func function for call
 * @returns {function} unsubscribe function
 */
function on(name, func) {
  if (!subscribes.has(name)) subscribes.set(name, []);
  subscribes.get(name).push(func);
  return function () {
    subscribes.set(
      name,
      subscribes.get(name).filter(function (f) {
        return f !== func;
      })
    );
  };
}

/**
 * @description like "on" but just run once
 * @public
 * @param {string} name name listener
 * @param {function} func function for call
 * @returns {function} unsubscribe function
 */
function once(name, func) {
  var unsubscribe = on(name, function () {
    func.apply(undefined, arguments);
    unsubscribe();
  });
  return unsubscribe;
}

/**
 * @description dispatch all listener
 * @public
 * @param {string} name name listener
 * @param {any} arg argument for send to on(...)
 * @returns {array} refunds all listen can return data
 */
function emit(name, arg) {
  var refunds = [];
  if (subscribes.has(name))
    subscribes.get(name).forEach(function (func) {
      if (func) refunds.push(func(arg));
    });
  return refunds;
}

/**
 * @description unsubscribe listener
 * @public
 * @param {string} name name listener
 * @param {function} func the function that you want to unsubscribe If not defined, all subscriptions will be canceled
 * @returns {undefined} nothing
 */
function unsubscribeOf(name, func) {
  if (func)
    subscribes.set(
      name,
      subscribes.get(name).filter(function (f) {
        return f !== func;
      })
    );
  else subscribes.clear(name);
}

exports.unsubscribeOf = unsubscribeOf;

exports.on = on;

exports.once = once;

exports.emit = emit;
