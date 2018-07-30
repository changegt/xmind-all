/*
  构建监听机制核心代码 Object.defineProperty
 */
function defineReactive (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  //获取当前obj的访问器属性
  var property = Object.getOwnPropertyDescriptor(obj, key);

  //如果当前存在访问器属性，同时可配置参数设置为false的时候，说明当前对象访问器属性不可被修改，直接返回
  if (property && property.configurable === false) {
    return
  }

  //获取预定义getter和setter的方法属性
  var getter = property && property.get;
  var setter = property && property.set;

  //没有当前这个参数【@TOFIX】的话，则去注册一个当前数据的观察者
  var childOb = !shallow && observe(val);

  // 重新设置getter和setter
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      //判断是否存在原先定义的getter方法，如果存在的话，执行原来的getter方法获取的值赋值给val
      var value = getter ? getter.call(obj) : val;

      //@TODO
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      //同getter里面的处理方法，先判断执行得到val
      var value = getter ? getter.call(obj) : val;

      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }

      /* eslint-enable no-self-compare */
      if ("development" !== 'production' && customSetter) {
        customSetter();
      }

      //存在setter就执行原来的setter，否则就讲数据赋值给val
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal; //由于当前的val是作为参数传入，内部存在这样一个值，所以这一步操作是为了getter的下次执行的时候的赋值处理
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}