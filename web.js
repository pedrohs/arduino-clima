var http = require('http'),
io = require('socket.io').listen(servidor),
fs = require('fs'),
YQL = require('yql'),
clima = require('./clima.js'),
port = process.env.PORT || 3000,
dados = {};

var servidor = http.createServer(function(req, res){
	if(req.url == '/'){
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(fs.readFileSync('web/index.html'));		
		res.end();
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

servidor.listen(port, function(){
	console.log("Servidor HTTP Online");
});
var socket = io.listen(servidor);

//inicia a conexão com o socket
io.on('connection', function(socket){ 
	console.log("Usuario Conectado");

	getDadosFront();
	
	socket.on('procuraCidade', function(cidade){
		var query = new YQL("select * from geo.placefinder where text='" + cidade + "'");
		query.exec(function(erro, data){
			var dados = {};
			if(!erro){
				if(data.query.results == null){
					dados['cidade'] = 'Não encontrada';
					dados['woeid'] = 'Indisponivel';
					dados['pais'] = 'Indisponivel';
					dados['estado'] = 'Indisponivel';

					socket.emit('resultadoCidade', dados);
				}else{
					var Result = data.query.results.Result;
					if(Result.length == undefined){
						dados['cidade'] = Result.city;
						dados['woeid'] = Result.woeid;
						dados['pais'] = Result.country;
						dados['estado'] = Result.statecode;
						
						socket.emit('resultadoCidade', dados);
					}else{
						for (var i = 0; i < Result.length; i++) {
							if(Result[i].city !== null){
								dados['cidade'] = data.query.results.Result[i].city;
								dados['woeid'] = data.query.results.Result[i].woeid;
								dados['pais'] = data.query.results.Result[i].country;
								dados['estado'] = data.query.results.Result[i].statecode;

								socket.emit('resultadoCidade', dados);
								console.log("Enviado" + dados['cidade']);
							}							
						};	
					}

				}				
			}else{
				console.log(erro);
			}
		});
	}); //Procura Cidade

socket.on('alterarConfigs', function(data){
	salveConfig(data);		
});
});

exports.dados = function(cidade, tempo, woeid){	
	dados['cidade'] = cidade;
    dados['woeid'] = woeid;
	var mili = tempo;
	var seg = mili / 1000;
	var min = seg / 60;
	var horas = Math.floor(min / 60);
	min = min % 60;
	dados['tempoMin'] = min;
	dados['tempoHoras'] = horas;
	getDadosFront();
}

function getDadosFront(){
	socket.emit('dados', dados);
}

function salveConfig(data){
	var horas = data['horas'] * 3600000;
	var minutos = data['minutos'] * 60000;
	var tempo = horas + minutos;
	var config = {
		cidadeId: data['woeid'],
		atualização: tempo
	};

	var data = JSON.stringify(config);

	fs.writeFile('./config.json', data, function(err){
		if(err){
			console.log(err.message);
			return;
		}
		console.log("Configurações Salvas");
		clima.get('reload');
	});
}