//深度优先搜索算法【非递归】
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

function dfs(tree, name){
	
	//clone 一个和tree一样的对象,避免修改tree，同时重置visited属性
	var clonetree = JSON.parse(JSON.stringify(tree));

	//建立一个栈，同时将克隆的tree栈顶元素推入栈中，添加visited属性
	var stack = [];
	stack.unshift(clonetree);
	stack[0].visited = 1;

	var returnArr = [] ; //为了避免出现tree中存在相同数据，使用数组可能更好一点

	while (stack.length){
		var x = stack[0]; //推入栈中

		//设置当前节点已读
		x.visited = 1; 
		
		//判断是否name相同
		if(x.name == name){
			returnArr.push(x);
			stack.shift();
			continue;
		}

		//用于下面判断是否当前节点已经没有相连的子节点了
		var flag = false; 

		//循环子节点
		for(var i in stack[0].children){ 

			//判断子节点是否已读
			if(!stack[0].children[i].visited){ 
				//添加已读标志
				stack[0].children[i].visited = 1;

				//子节点未读的话，将节点推入栈顶，下次循环的时候操作当前数据
				stack.unshift(stack[0].children[i]); 
				flag = true;
				break;
			}

		}

		//当前节点没有未读的子节点的时候，推出栈
		if(!flag){
			stack.shift() 
		}
	}

	//去除visited
	var newReturnArr = [];
	returnArr.forEach(function(el){
		el = JSON.stringify(el)
				.replace(/,"visited":1/g, '')
				.replace(/,"visited":1,/g, '')
				.replace(/"visited":1,/g, '');
		newReturnArr.push(JSON.parse(el));
	});

	return newReturnArr.length > 1 ? newReturnArr : newReturnArr[0];
}


dfs(tree, '杭州市')