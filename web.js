var http = require('http'),
io = require('socket.io').listen(servidor),
fs = require('fs'),
YQL = require('yql'),
port = process.env.PORT || 3000,
arduinoStatus = false,
cidadeAtual,
dados = {};

var servidor = http.createServer(function(req, res){
	if(req.url == '/'){
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(fs.readFileSync('index.html'));		
		res.end();
		enviarSockets();
	}else if(req.url == '/web/css/bootstrap.css'){
		res.writeHead(200, {'Content-Type': 'text/css'});
		res.write(fs.readFileSync('web/css/bootstrap.css'));
		res.end();
	}else if(req.url == '/web/css/style.css'){
		res.writeHead(200, {'Content-Type': 'text/css'});
		res.write(fs.readFileSync('web/css/style.css'));
		res.end();
	}else{
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write("404 Error");
		res.end();
	}
});

exports.cidade = function(city){
	cidadeAtual = city;
}

function enviarSockets(){
	socket.emit('cidade', cidadeAtual);
	
	console.log("Sokets enviados");
}


servidor.listen(port, function(){
	console.log("Servidor HTTP Online");
});
var socket = io.listen(servidor);

io.on('connection', function(socket){
	console.log("Usuario Conectado");

	socket.on('pegaCidade', function(io){
		console.log("emit recebido");
		enviarSockets();
	});

	socket.on('procuraCidade', function(cidade){
		var query = new YQL("select * from geo.placefinder where text='" + cidade + "'");
		query.exec(function(erro, data){
			if(!erro){
				var cityName = dados['cidade'] = data.query.results;
				if(cityName == null){
					dados['cidade'] = 'Cidade não encontrada';
					dados['woeid'] = 'Indisponivel';
					dados['pais'] = 'Indisponivel';
					dados['estado'] = 'Indisponivel';

					socket.emit('resultadoCidade', dados);
				}else{
					dados['cidade'] = data.query.results.Result.city;
					dados['woeid'] = data.query.results.Result.woeid;
					dados['pais'] = data.query.results.Result.country;
					dados['estado'] = data.query.results.Result.statecode;

					socket.emit('resultadoCidade', dados);
				}				
			}else{
				console.log(erro);
			}
		});
	});
});

io.on('disconnect', function(socket){
	console.log("Usuario Desconectado");
});

