var a = {
	name: 'a',
	children: [
		{
			name: 'b',
			children: [
				{
					name: 'c',
				},
				{
					name: 'd',
				}
			]
		},
		{
			name: 'e',
			children: [
				{
					name: 'f',
					children: [
						{
							name: 'g'
						}
					]
				},
				{
					name: 'h'
				}
			]
		}
	]
}

function dfs (tree){
	var treeArr1 = [tree];
	(function(treeArr){
		for(var i in treeArr){
			console.log(treeArr[i].name);
			console.log(this);
			if(treeArr[i].children){
				arguments.callee.call(this,treeArr[i].children); //保持当前的域一直处于window域下
				// arguments.callee(treeArr[i].children); //执行后this指向了上一次调用函数的arguments对象
			}
		}
	})(treeArr1)
}