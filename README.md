# Mostrando informações climaticas com Arduino e Node.js

Utilizando os seguintes modulos:

  - [Johnny Five]
  - [Request]

Request busca as informações do serviço da Yahoo Weather Api
### Version
1.0.0

### Instalação

```sh
$ git clone https://github.com/pedrohs/arduino-clima.git 
$ cd arduino-clima
$ npm install
$ node arduino.js
```

Para alterar a cidade  
--
acesse este site: http://woeid.rosselliot.co.nz/ para descobrir o woeid da sua cidade

depois no arquivo: *clima.js* vá ate a linha 10 substitua a linha pelo codigo a baixo, colocando o woeid no local indicado sem espaços e chaves!
```sh
var URL = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%3D [Cole woeid aqui] %20and%20u%3D%22c%22&format=json&diagnostics=true&callback=';
```



[Johnny Five]:https://github.com/rwaldron/johnny-five
[Request]:https://github.com/request/request
