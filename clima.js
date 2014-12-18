var request = require("request"),
	tempGraus,
	umidade,
	ventoVelocidade;

var pedaDados = function(){
	var URL = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22marilia%2C%20sp%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
	request(URL, function(error, response, body){
	if (!error && response.statusCode == 200) {
	   var dados = JSON.parse(body);
		tempGraus = dados['query']['results']['channel']['item']['condition']['temp'];
		tempGraus = tempGraus - 32;
		tempGraus = tempGraus / 1.8;
		tempGraus = tempGraus.toFixed(0);

		umidade = dados['query']['results']['channel']['atmosphere']['humidity'];
		ventoVelocidade = dados['query']['results']['channel']['wind']['speed'];
		ventoVelocidade = ventoVelocidade * 1.609344;
		ventoVelocidade = ventoVelocidade.toFixed(1);
		ventoVelocidade = ventoVelocidade + "Km/h";

		return true;

	}else{
			console.log(error);
		}
	});
}


exports.temperatura = function(){
	return tempGraus;
};
exports.umidade = function(){
	return umidade;
};
exports.vento = function(){
	return ventoVelocidade;
};

exports.dados = function(){
	return pedaDados();
}