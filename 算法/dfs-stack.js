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

function dfs(tree) {
	console.log('start');

	var stack = [tree];
	while (node = stack.shift()) {
		console.log(node.name);

		if(node.children){
			Array.prototype.unshift.apply(stack, node.children);
		}
	}
	console.log('end');
}