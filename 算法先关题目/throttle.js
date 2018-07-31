//节流函数
function throttle(func, duration){
	this.lastTime = new Date().getTime();
	var b = function(){

		//限流算法, 有一个问题：就是如果一直滚动的话，方法就直接处于被clear
		// if(this.timer){
		// 	clearTimeout(this.timer);
		// }

		// this.timer = setTimeout(function(){
		// 	func();
		// },duration);


		//通过时间节点来限流
		//当前时间 - 前一次执行定时任务的时间  > duration , 执行定时任务，同时设置时间
		if(new Date().getTime() - this.lastTime > duration){
			this.timer = setTimeout(function(){
				func();
			},duration);
			this.lastTime = new Date();
		}
	}

	return b;
}

function a(){
	console.log(new Date().getTime())
}

window.addEventListener('scroll', throttle(a, 200), false);