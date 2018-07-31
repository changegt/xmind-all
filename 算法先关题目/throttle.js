//节流函数

function throttle(func, duration){
	//方法间隔固定执行
	var obj = func;
	if(obj.timer){
		clearTimeout(obj.timer);
	}

	obj.timer = setTimeout(function(){
		func.call(obj);
	},duration);

	//方法执行结束后，间隔固定时间执行
}