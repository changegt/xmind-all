const http = require('http');
const fs = require('fs');
const path = require('path');

const httpObj = http.createServer((req, res) => {
	let filepath = path.join(path.resolve(), req.url);

	try{
		let txt = fs.readFileSync(filepath, {encoding: 'utf8'});
		res.setHeader('Content-Type', getType(filepath));
		res.end(txt);
	}catch(e){
		res.end('error');
	}

});

function getType (url) {
	if(url.indexOf('html') > -1){
		return 'text/html';
	}else if(url.indexOf('js') > -1){
		return 'application/javascript';
	}
}

httpObj.listen(8081);
