var n = 3;
function a(fn){
    var args = Array.prototype.slice.call(arguments, 1);
    var x = function(){
        var innerargs = Array.prototype.slice.call(arguments);
        var totalargs = args.concat(innerargs);
        return fn.apply(null, totalargs);
    }

    return x;
}

var b = function(m){
	console.log(arguments)
}

c = a(b,1)
d = a(c,2)
e = a(d,3)

function A(a){console.log(arguments[0])}
function B(b){console.log(arguments[0])}
function C(c){console.log(arguments[0])}

function x(){//fnArr, argArr
	var fn = arguments[0][0];
	
	if(!fn || typeof fn != 'function' || !arguments[1] || !arguments[1][0]){
		return ;
	}

	fn(arguments[1][0]);
	return arguments.callee.call(null, arguments[0].slice(1), arguments[1].slice(1));
}
x([A,B,C], [1,2,3])