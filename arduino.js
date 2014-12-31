var five =  require('johnny-five'),
clima = require("./clima.js"),
async = require('async'),
arduino = five.Board('/dev/ttyACM0'),
web = require("./web.js"),
dadosClima = new Array(),
lcd,
tempoFrame,
frame = 1;

async.auto({
	arduino: function(callback){
		arduino.on('ready', function(){
			console.log("Arduino Pronto");
			lcd = new five.LCD({
				pins: [12, 11, 5, 4, 3, 2],
				rows: 2,
				cols: 20
			});
			lcd.on('ready', function(){		
				console.log("LCD Pronto");		
				lcd.createChar("lupa", [31,17,10,4,10,17,31,0]);
				lcd.createChar("graus", [0,14,10,14,0,0,0,0]);
				lcd.clear().cursor(0,0).print("Carregando");
				lcd.cursor(1,1).print("Informacoes :lupa:");
			});
			callback(null);
		});
	},
	get_dados: function(callback){
		clima.get('get');
		exports.getDados = function(data){
			dadosClima = data;
			dadosFrontEnd();
            console.log("Dados do Yahoo pegos");
            callback(null);
		}
	},
	arduino_lcd: ['arduino', 'get_dados', function(callback){
		mostraLcd();
	}]
});

exports.reloadDados = function(data){
	lcd.clear().cursor(0,0).print("Dados");
	lcd.cursor(1,3).print("Recarregados");
	dadosClima = data;
	mostraLcd("stop");
	mostraLcd();
	dadosFrontEnd();
}

function mostraLcd(comando){
	if(dadosClima == 'erro'){
		lcd.clear().print("Erro encontrado :(");
	}else if(comando == "stop"){
		frame = 1;
		clearInterval(tempoFrame);		
	}else{
		frameLcd();
		tempoFrame = setInterval(function(){
			frameLcd();
		}, 4000);
	}
}

function dadosFrontEnd(){
	var cidade = dadosClima['city'] + '/' + dadosClima['estado'];
	var tempo = dadosClima['tempoAtualiza'];
	web.dados(cidade, tempo, dadosClima['woeid']);
}

function frameLcd(){	
	switch(frame){
		case 1:
		lcd.clear().print("Clima:" + dadosClima['city']);
		lcd.cursor(1,0).print("Hoje " + dadosClima['dias'][0].date);
		break;
		case 2:
		lcd.clear().print("Temperatura: " + dadosClima['temp']);
		lcd.cursor(1,0).print("Umidade: " + dadosClima['umid']);
		break;
		case 3:
		lcd.clear().print("Vento: " + dadosClima['vento']);
		lcd.cursor(1,0).print("Visib: " + dadosClima['visib']);
		break;
		case 4:
		lcd.clear().print("Clima:" + dadosClima['city']);
		lcd.cursor(1,0).print("Amanha");
		break;
		case 5: 
		lcd.clear().print("Temp: Max: " + dadosClima['dias'][1].high + ":graus:");
		lcd.cursor(1,6).print("Min: " + dadosClima['dias'][1].low + ":graus:");
		break;
		case 6:
		var code = dadosClima['dias'][1].code;
		var cidade = dadosClima['city'] + "/" + dadosClima['estado'] + ": ";
		var clima = dadosClima['code'][code];
		var textDisplay = cidade + clima;

		var texto1 = textDisplay.substring(0,16);
		var texto2 = textDisplay.substring(16);
		lcd.clear().cursor(0,0).print(texto1);
		lcd.cursor(1,0).print(texto2);
		break;
	}
	if(frame == 6){frame = 0};
	frame++;
}