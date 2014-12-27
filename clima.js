var request = require("request"),
tempGraus,
umidade,
ventoVelocidade,
dados = new Array(),
arduino = require("./arduino.js");

function pegaDados(callback){
	var URL = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22marilia%2C%20sp%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
	request(URL, function(error, response, body){
		if (!error && response.statusCode == 200) {
			var body = JSON.parse(body);
			tempGraus = body['query']['results']['channel']['item']['condition']['temp'];
			tempGraus = tempGraus - 32;
			tempGraus = tempGraus / 1.8;
			tempGraus = tempGraus.toFixed(0);

			umidade = body['query']['results']['channel']['atmosphere']['humidity'];
			ventoVelocidade = body['query']['results']['channel']['wind']['speed'];
			ventoVelocidade = ventoVelocidade * 1.609344;
			ventoVelocidade = ventoVelocidade.toFixed(1);
			ventoVelocidade = ventoVelocidade + "Km/h";

			dados['temp'] = tempGraus;
			dados['umid'] = umidade;
			dados['vento'] = ventoVelocidade;

			callback(true);

		}else{
			console.log(error);
			callback(false);
		}
	});
}

pegaDados(app);

function app(estado){
	if(estado){
		console.log("dados pegos")
		arduino.pegaDados(true, dados);
	}else{
		console.log("erro nos dados");
	}
}