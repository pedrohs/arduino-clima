var five =  require('johnny-five'),
clima = require("./clima.js"),
arduino = five.Board('/dev/ttyACM0'),
dados;

arduino.on('ready', function(){
	console.log("Arduino Pronto");

	lcd = new five.LCD({
		pins: [12, 11, 5, 4, 3, 2],
		rows: 2,
		cols: 20
	});

	lcd.on('ready', function(){
		console.log("LCD Pronto");
		function mostraLcd(){
			//aqui fica o codigo do lcd,
			
		}		
	});
});

exports.pegaDados = function(status, dados){
	if(status){
		dados = this.dados;		
		mostraLcd();	
	}
}