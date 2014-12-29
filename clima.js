var request = require("request"),
YQL = require('yql'),
fs = require('fs'),
tempGraus,
umidade,
ventoVelocidade,
dados = new Array(),
arduino = require("./arduino.js"),
codeClima = new Array(),
woeid;

function carregarConfigs(){
	var data = fs.readFileSync('./config.json');
	var config = JSON.parse(data);

	console.log("Configs carregadas");
	woeid = config['cidadeId'];
	pegaDados(app);
}

function pegaDados(callback){
	var query = new YQL("select * from weather.forecast where woeid="+ woeid +" and u='c'");
	query.exec(function(erro, data){
		dados['temp'] = data.query.results.channel.item.condition.temp;
		dados['temp'] = dados['temp'] + ":graus:";

		dados['umid'] = data.query.results.channel.atmosphere.humidity;
		dados['umid'] = dados['umid'] + "%";

		dados['vento'] = data.query.results.channel.wind.speed;
		dados['vento'] = dados['vento'] + "Km/h";

		dados['visib'] = data.query.results.channel.atmosphere.visibility;
		dados['visib'] = dados['visib'] + "km";
		
		var dias = data.query.results.channel.item.forecast;
		dados['dias'] = dias;
		dados['code'] = codeClima;

		dados['city'] = data.query.results.channel.location.city;
		dados['estado'] = data.query.results.channel.location.region;

		callback(true);
	});

}

function app(estado){
	if(estado){
		console.log("Dados prontos")
		arduino.pegaDados(true, dados);
	}else{
		console.log("erro nos dados");
		arduino.pegaDados(false);
	}
}

exports.ready = function(){
	carregarConfigs();
}

codeClima[0] = 'tufão';
codeClima[1] = 'tempestade tropical';
codeClima[2] = 'furacão';
codeClima[3] = 'temporais severos';
codeClima[4] = 'temporais';
codeClima[5] = 'chuva mista e neve';
codeClima[6] = 'chuva mista e granizo';
codeClima[7] = 'neve mista e granizo';
codeClima[8] =  'garoa que se congela';
codeClima[9] =  'garoa';
codeClima[10] = 'chuva que se congela';
codeClima[11] = 'chuvas';
codeClima[12] = 'chuvas';
codeClima[13] = 'lufadas de neve';
codeClima[14] = 'chuvas de neve fraca';
codeClima[15] = 'nevasca';
codeClima[16] = 'neve';
codeClima[17] = 'granizo';
codeClima[18] = 'granizo';
codeClima[19] = 'pó';
codeClima[20] = 'nebulosos';
codeClima[21] = 'neblina';
codeClima[22] = 'fumegantes';
codeClima[23] = 'estrondosos';
codeClima[24] = 'ventosos';
codeClima[25] = 'frio';
codeClima[26] = 'nublados';
codeClima[27] = 'pela maior parte nublados (noite)';
codeClima[28] = 'pela maior parte nublados (dia)';
codeClima[29] = 'em parte nublado (noite)';
codeClima[30] = 'em parte nublado (dia)';
codeClima[31] = 'claros (noite)';
codeClima[32] = 'cheios de sol';
codeClima[33] = 'feira (noite)';
codeClima[34] = 'feira (dia)';
codeClima[35] = 'chuva mista e granizo';
codeClima[36] = 'quentes';
codeClima[37] = 'temporais isolados';
codeClima[38] = 'temporais espalhados';
codeClima[39] = 'temporais espalhados';
codeClima[40] = 'chuvas espalhadas';
codeClima[41] = 'neve pesada';
codeClima[42] = 'chuvas de neve espalhadas';
codeClima[43] = 'neve pesada';
codeClima[44] = 'em parte nublado';
codeClima[45] = 'thundershowers';
codeClima[46] = 'chuvas de neve';
codeClima[47] = 'temporais isolados';
codeClima[3200] = 'não disponível';