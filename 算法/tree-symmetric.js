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

//递归实现
function symmetric(tree,newTree = {}){
	newTree.name = tree.name
	
	if(!tree.children){
		return newTree;
	}

	newTree.children = [];
	tree.children.forEach(function(el){
		var obj = symmetric(el);
		newTree.children.unshift(obj);
	});

	return newTree;
}

symmetric(a)