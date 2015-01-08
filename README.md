# arduino-clima
Pequeno módulo que utiliza as informações fornecidas pelo Yahoo via YQL para trazer algumas informações do clima da cidade configurada no painel de controle.

### Instalação

```bash
$ git clone https://github.com/pedrohs/arduino-clima.git 
$ cd arduino-clima
$ npm install
$ node arduino.js
```

### Configuração do arduino

- Abra a IDE do Arduino, selecione: File > Examples > Firmata > StandardFirmata.
- Clique no botão Upload.

### Dependências utilizadas
* [Johnny Five](https://github.com/rwaldron/johnny-five)
* [YQL](https://github.com/derek/node-yql)
* [async](https://github.com/caolan/async)
* [socket.io](https://github.com/Automattic/socket.io)

### Imagens
![Painel de Controle](http://i61.tinypic.com/2hqaru9.png)
![LED do Arduino](http://i59.tinypic.com/5d2gw4.jpg)

### FAQ
* Para alterar a cidade
  Depois de iniciar o servidor acesse pelo navegador: http://localhost:3000/

### Contribuidores
* [gpedro](https://github.com/gpedro)
