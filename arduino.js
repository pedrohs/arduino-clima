var five =  require('johnny-five'),
clima = require("./clima.js"),
arduino = five.Board('/dev/ttyACM0'),
dadosClima,
lcd;

arduino.on('ready', function(){
	console.log("Arduino Pronto");

	lcd = new five.LCD({
		pins: [12, 11, 5, 4, 3, 2],
		rows: 2,
		cols: 20
	});

	lcd.on('ready', function(){
		console.log("LCD Pronto");		
		lcd.clear().cursor(0,0).print("Carregando");
	});
});

exports.pegaDados = function(status, dados){
	if(status){
		dadosClima = dados;		
		mostraLcd(true);	
	}
}

function mostraLcd(status){
	lcd.print(dadosClima['temp']);
}