// on
// off
// trigger

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
	 * @param  {[type]} 扩展参数 isCover[default=false]
	 * @return {[type]}       [description]
	 */
	on (...args) {
		let self = this;
		if(args.length < 2){
			alert('当前绑定必须要两个参数');
			return;
		}

		if(typeof args[0] != 'string'){
			alert('参数类型错误');
			return;
		}

		if(!self._isFunc(args[1])){
			alert('参数类型错误');
			return;
		}

		//扩展参数
		let isCover = args.length >= 3 ? args[2] : false;

		if(!self.eventObserver[args[0]]){
			self.eventObserver[args[0]] = [];
		}

		if(isCover){
			//执行覆盖
			self.eventObserver[args[0]]	= [{
				func: args[1]
			}];
		}else{
			self.eventObserver[args[0]].push(args[1]);
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