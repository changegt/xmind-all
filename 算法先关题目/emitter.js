// 自定义事件

function EventEmitter(){
	this.init();
}

EventEmitter.prototype = {
	init () {
		this.eventObserver = {
			// 'play': [func,func...]
		};
	},

	/**
	 * [on description]
	 * @param  {[type]} event [description]
	 * @param  {[type]} func  [description]
	 * @param  {[type]} 扩展参数 isCover[default=false]是否支持自定义覆盖
	 * @return {[type]}       [description]
	 */
	on (...args) {
		let self = this;
		if(args.length < 2){
			alert('当前绑定必须要两个参数');
			return;
		}

		var event = args[0];
		if(typeof event != 'string'){
			alert('参数类型错误');
			return;
		}

		var func = args[1];
		if(!self._isFunc(func)){
			alert('参数类型错误');
			return;
		}

		//扩展参数
		let isCover = args.length >= 3 ? args[2] : false;

		if(!self.eventObserver[event]){
			self.eventObserver[event] = [];
		}

		if(isCover){
			//执行覆盖
			self.eventObserver[event] = [{
				func: func
			}];
		}else{
			self.eventObserver[event].push(func);
		}
	},

	off (event) {
		let self = this;
		self.eventObserver[event] = [];
	},

	trigger (event, params) {
		let self = this;

		if(!self.eventObserver[event] || !self.eventObserver[event].length){
			alert('不存在该绑定事件');
			return;
		}

		for(let i in self.eventObserver[event]){
			if(!self._isFunc(self.eventObserver[event][i])){
				alert('方法错误');
				break;
			}

			self.eventObserver[event][i](params);
		}
	},

	_isFunc (func) {
		return func instanceof Function;
	}
}