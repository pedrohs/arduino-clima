var five =  require('johnny-five'),
clima = require("./clima.js"),
arduino = five.Board('/dev/ttyACM0'),
web = require("./web.js"),
dadosClima = new Array(),
lcd,
tempoLcd,
frame;

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
		clima.ready();
	});
});

exports.pegaDados = function(status, dados){
	if(status){
		dadosClima = dados;		
		mostraLcd(true);
		var cidade = dadosClima['city'] + "/" + dadosClima['estado'];
		web.cidade(cidade);	
	}else{
		mostraLcd(false);
	}
}

exports.recarregar = function(){
	clearInterval(tempoLcd);
	lcd.clear().print("Configurações");
	lcd.cursor(1,0).print("Alteradas");
	clima.ready();
	frame = 1;
}

function mostraLcd(status){
	if(status){		
		frameLcd();
		tempoLcd = setInterval(function(){
			frameLcd();
		}, 5000);
	}else{
		lcd.clear().print("Erro Encontrado");
	}
}

frame = 1;
function frameLcd(){	
	switch(frame){
		case 1:
			lcd.clear().print("Dados Climaticos");
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
			lcd.clear().print("Dados Climaticos");
			lcd.cursor(1,0).print(dadosClima['dias'][1].date + " -->");
			break;
		case 5: 
			lcd.clear().print("Temp: Max: " + dadosClima['dias'][1].high + ":graus:");
			lcd.cursor(1,6).print("Min: " + dadosClima['dias'][1].low + ":graus:");
			break;
		case 6:
			var code = dadosClima['dias'][1].code;
			lcd.clear().print(dadosClima['city'] + "/" + dadosClima['estado']);
			lcd.cursor(1,0).print(dadosClima['code'][code]);
			break;
	}
	if(frame == 6){frame = 0};
	frame++;
}
