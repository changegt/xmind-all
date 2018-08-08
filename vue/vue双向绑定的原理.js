initData()
=> 
obeserve() 
=> 
Observer实例
【Object.keys遍历子属性（所以导致子属性的属性改变无法监听到，所以需要手动forceupdate）都添加上getter和setter】 
=> 
注册getter和setter的方法defineReactive

当事件被修改的时候，会触发setter方法，setter方法内部会更新观察者的数据值，同时触发依赖对象dep的通知机制，通知绑定关系更新dom

数据被修改的时候，执行Observer方法，判断当前是否已经注册了观察者
	存在：