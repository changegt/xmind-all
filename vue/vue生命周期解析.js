vue 在beforeCreate的钩子执行的时候虚拟dom，数据，事件都没有执行绑定，
在created钩子执行的时候，数据和事件都执行了绑定，
在created和beforeMount之间，判断当前是否存在el属性，如果存在的话，在判断是否存在templte，存在的话编译模板到render函数中，否则就将el指向的dom编译放入render函数中【this.$el已经存在，但是是虚拟dom结构】
在mounted钩子执行之前，执行render函数，渲染dom