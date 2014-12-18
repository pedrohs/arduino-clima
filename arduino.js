var five =  require('johnny-five');
var events = require('events'); 
var eventEmitter = new events.EventEmitter();  
var clima = require("./clima.js");

var arduino = five.Board('/dev/ttyACM0');

if(clima.dados()){
	console.log("certo");
}else{
	console.log("Erro");
}

arduino.on('ready', function(){
	console.log("Arduino Pronto");

	lcd = new five.LCD({
		pins: [12, 11, 5, 4, 3, 2],
		rows: 2,
		cols: 20
	});

	lcd.on('ready', function(){
		console.log("LCD Pronto");
		console.log(clima.temperatura());
		if(clima.temperatura() == undefined){
			lcd.cursor(0,0);
			lcd.print("Carregando");
			lcd.cursor(1,0);
			lcd.print("Informacoes");


		}else{
			lcd.print("Temp:" + clima.temperatura());
		}
		
	})
});