var tree = {
	name: '中国',
	children: [
		{
			name: '北京',
			children: [
				{
					name: '朝阳群众'
				},
				{
					name: '海淀区'
				},
				{
					name: '昌平区'
				}
			]
		},
		{
			name: '浙江省',
			children: [
				{
					name: '杭州市',
					code: '0571'
				},
				{
					name: '嘉兴市',
				},
				{
					name: '绍兴市',
				},
				{
					name: '宁波市',
				}
			]
		}
	]
}

var stack = [];
function dfs(tree, name){
	stack.unshift(tree);
	stack[0].visited = 1;
	while (stack.length){
		var x = stack[0]; //推入栈中
		// console.log(x);
		if(x.name == name){
			console.log(x);
			stack.shift();
			continue;
		}

		x.visited = 1; //设置当前节点已读

		var flag = false; //用于下面判断是否当前节点已经没有相连的子节点了

		for(var i in stack[0].children){ //循环子节点

			if(!stack[0].children[i].visited){ //判断子节点是否已读
				//找到未访问的节点
				stack[0].children[i].visited = 1; //添加已读标志
				stack.unshift(stack[0].children[i]); //子节点未读的话，将节点推入栈顶，下次循环的时候操作当前数据
				flag = true;
				break;
			}
		}

		if(!flag){
			stack.shift() //当前节点没有未读的子节点的时候，推出栈
		}
	}
}


dfs(tree, '杭州市')