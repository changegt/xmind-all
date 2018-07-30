/**
 * Observer观察者注册防范
 * @param {[type]} value [description]
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;

  //定义一个__ob__的属性，同时设置他的访问器属性
  def(value, '__ob__', this);

  //当前value是一个数组的时候
  if (Array.isArray(value)) {
    var augment = hasProto // hasProto = '__proto__' in {} //判断对象是否存在__proto__属性，浏览器是否支持原型链
      ? protoAugment
      : copyAugment; //最后得到的aument是一个函数，用来

      /**
       *
       * function protoAugment (target, src, keys) {
            target.__proto__ = src;
          }

       * var arrayProto = Array.prototype;
       * var arrayMethods = Object.create(arrayProto);[
          'push',
          'pop',
          'shift',
          'unshift',
          'splice',
          'sort',
          'reverse'
        ]

        var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

        最后实现对value的__proto__指针指向数组的原型
       */

    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    //当前元素不是数组元素的时候，执行访问器设置处理，设置当前对象的getter和setter操作
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i], obj[keys[i]]);
  }
};

/**
 * 将数组每一个元素都塞入做观察处理
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};





/**
 * 观察者序列
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};