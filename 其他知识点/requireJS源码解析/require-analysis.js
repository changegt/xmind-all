
重点：
	1、构造script标签来加载资源，同时异步回调方案
	2、引入模块的队列

1、主方法
	内部的req对象【requirejs、require】
		req的主方法执行的时候，内部初始化了相关的内部上下文对象contexts
		同时req还暴露了相关的外部调用方法【
			config: 定义相关的配置项
				req.config = function (config) {
			        return req(config);
			    };

			    =>

			    configure: function (cfg) {
	                //判断是否存在baseUrl，同时默认baseUrl后缀/补全
	                if (cfg.baseUrl) {
	                    if (cfg.baseUrl.charAt(cfg.baseUrl.length - 1) !== '/') {
	                        cfg.baseUrl += '/';
	                    }
	                }

	                //Save off the paths since they require special processing,
	                //they are additive.
	                var shim = config.shim,
	                    objs = {
	                        paths: true,
	                        bundles: true,
	                        config: true,
	                        map: true
	                    };

	                eachProp(cfg, function (value, prop) {
	                    if (objs[prop]) {
	                        if (!config[prop]) {
	                            config[prop] = {};
	                        }
	                        mixin(config[prop], value, true, true);
	                    } else {
	                        config[prop] = value;
	                    }
	                });

	                //Reverse map the bundles
	                if (cfg.bundles) {
	                    eachProp(cfg.bundles, function (value, prop) {
	                        each(value, function (v) {
	                            if (v !== prop) {
	                                bundlesMap[v] = prop;
	                            }
	                        });
	                    });
	                }

	                //Merge shim
	                if (cfg.shim) {
	                    eachProp(cfg.shim, function (value, id) {
	                        //Normalize the structure
	                        if (isArray(value)) {
	                            value = {
	                                deps: value
	                            };
	                        }
	                        if ((value.exports || value.init) && !value.exportsFn) {
	                            value.exportsFn = context.makeShimExports(value);
	                        }
	                        shim[id] = value;
	                    });
	                    config.shim = shim;
	                }

	                //Adjust packages if necessary.
	                if (cfg.packages) {
	                    each(cfg.packages, function (pkgObj) {
	                        var location, name;

	                        pkgObj = typeof pkgObj === 'string' ? { name: pkgObj } : pkgObj;

	                        name = pkgObj.name;
	                        location = pkgObj.location;
	                        if (location) {
	                            config.paths[name] = pkgObj.location;
	                        }

	                        //Save pointer to main module ID for pkg name.
	                        //Remove leading dot in main, so main paths are normalized,
	                        //and remove any trailing .js, since different package
	                        //envs have different conventions: some use a module name,
	                        //some use a file name.
	                        config.pkgs[name] = pkgObj.name + '/' + (pkgObj.main || 'main')
	                                     .replace(currDirRegExp, '')
	                                     .replace(jsSuffixRegExp, '');
	                    });
	                }

	                //If there are any "waiting to execute" modules in the registry,
	                //update the maps for them, since their info, like URLs to load,
	                //may have changed.
	                eachProp(registry, function (mod, id) {
	                    //If module already has init called, since it is too
	                    //late to modify them, and ignore unnormalized ones
	                    //since they are transient.
	                    if (!mod.inited && !mod.map.unnormalized) {
	                        mod.map = makeModuleMap(id);
	                    }
	                });

	                //If a deps array or a config callback is specified, then call
	                //require with those args. This is useful when require is defined as a
	                //config object before require.js is loaded.
	                if (cfg.deps || cfg.callback) {
	                    context.require(cfg.deps || [], cfg.callback);
	                }
	            },

	            //Url处理 补全后缀，补全路径等等【注意，默认require引入文件的时候带上首字符带上/或者类似D:这样的路径的话，baseUrl失效】
                url = syms.join('/');
                url += (ext || (/^data\:|\?/.test(url) || skipExt ? '' : '.js'));
                url = (url.charAt(0) === '/' || url.match(/^[\w\+\.\-]+:/) ? '' : config.baseUrl) + url;

			createNode: 创建一个script标签的node节点
				req.createNode = function (config, moduleName, url) {
			        var node = config.xhtml ?
			                document.createElementNS('http://www.w3.org/1999/xhtml', 'html:script') :
			                document.createElement('script');
			        node.type = config.scriptType || 'text/javascript';
			        node.charset = 'utf-8';
			        node.async = true;
			        return node;
			    };

			load: 【重点方法】【用于加载资源】
				req.load = function (context, moduleName, url) {
			        var config = (context && context.config) || {},
			            node;
			        if (isBrowser) {
			            //创建node节点
			            node = req.createNode(config, moduleName, url);

			            //添加相关属性
			            node.setAttribute('data-requirecontext', context.contextName);
			            node.setAttribute('data-requiremodule', moduleName);

			            //为什么要先执行判断是否存在attachEvent，
			            //由于ie9有一个addEventListener 的问题，就是onload的事件必须要等到加载的脚本执行完成之后才会触发onload的监听回调
			            //同时Opera实现附件事件但不遵循脚本
			            if (node.attachEvent &&
			            		//检查attachEvent是否被人为的定义或者浏览器支持
			            		//node.attachEvent.toString().indexOf('[native code') < 0 这个是用来判断是否浏览器支持attachEvent的
			            		//IE8 中node.attachEvent 不存在toString的属性
			                    !(node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code') < 0) &&
			                    !isOpera) {
			                useInteractive = true;

			                node.attachEvent('onreadystatechange', context.onScriptLoad);
			            } else {
			                node.addEventListener('load', context.onScriptLoad, false);
			                node.addEventListener('error', context.onScriptError, false);
			            }
			            node.src = url;

			            //插入节点
			            currentlyAddingScript = node;
			            if (baseElement) {
			                head.insertBefore(node, baseElement);
			            } else {
			                head.appendChild(node);
			            }
			            currentlyAddingScript = null;

			            return node;
			        } else if (isWebWorker) {//web worker
			            try {
			                //In a web worker, use importScripts. This is not a very
			                //efficient use of importScripts, importScripts will block until
			                //its script is downloaded and evaluated. However, if web workers
			                //are in play, the expectation that a build has been done so that
			                //only one script needs to be loaded anyway. This may need to be
			                //reevaluated if other use cases become common.
			                importScripts(url);

			                //Account for anonymous modules
			                context.completeLoad(moduleName);
			            } catch (e) {
			                context.onError(makeError('importscripts',
			                                'importScripts failed for ' +
			                                    moduleName + ' at ' + url,
			                                e,
			                                [moduleName]));
			            }
			        }
			    };

			nexttick：【构造一个延时方案】
				req.nextTick = typeof setTimeout !== 'undefined' ? function (fn) {
			        setTimeout(fn, 4);
			    } : function (fn) { fn(); };

	define方法
		define = function (name, deps, callback) {
	        var node, context;

	        //name可以为空
	        if (typeof name !== 'string') {
	            //Adjust args appropriately
	            callback = deps;
	            deps = name;
	            name = null;
	        }

	        //This module may not have dependencies
	        if (!isArray(deps)) {
	            callback = deps;
	            deps = null;
	        }

	        //deps依赖的模块可以为空
	        if (!deps && isFunction(callback)) {
	            deps = [];
	            //删除注释
	            //从方法中寻找require的依赖，同时将依赖的模块push进入deps中
	            //but only if there are function args.
	            if (callback.length) {
	                callback
	                    .toString()
	                    .replace(commentRegExp, '')
	                    .replace(cjsRequireRegExp, function (match, dep) {
	                        deps.push(dep);
	                    });

	                //适应commonJs使用者，同时默认在deps中添加相关的主要依赖对象
	                deps = (callback.length === 1 ? ['require'] : ['require', 'exports', 'module']).concat(deps);
	            }
	        }

	        //If in IE 6-8 and hit an anonymous define() call, do the interactive
	        //work.
	        if (useInteractive) {
	            node = currentlyAddingScript || getInteractiveScript();
	            if (node) {
	                if (!name) {
	                    name = node.getAttribute('data-requiremodule');
	                }
	                context = contexts[node.getAttribute('data-requirecontext')];
	            }
	        }

	        //将[name, deps, callback]这样的一个代表一个模块的结构组成的数据塞入队列中
	        (context ? context.defQueue : globalDefQueue).push([name, deps, callback]);
	    };

	内部Module构造函数：
		作用：	运行过程中，用于存放加载模块的对象，存放到registry对象中
				如果运行过程中，同一个模块被多次的引用的时候，后面的引用registry仓库里面去找，避免重复加载
