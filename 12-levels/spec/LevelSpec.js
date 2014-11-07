/*

  Requisitos:

    El objetivo de este prototipo es añadir niveles al juego. En cada
    nivel deberán ir apareciendo baterías de enemigos según avanza el
    tiempo.

    Cada nivel termina cuando no quedan enemigos por crear en ninguno
    de sus niveles, y cuando todos los enemigos del nivel han
    desaparecido del tablero de juegos (eliminados por misiles/bolas
    de fuego o desaparecidos por la parte de abajo de la pantalla).

    Cuando terminan todos los niveles sin que la nave haya colisionado
    termina el juego, ganando el jugador.

    Cuando la nave del jugador colisiona con un enemigo debe terminar
    el juego, perdiendo el jugador.


  Especificación:

    El constructor Level() recibirá como argumentos la definición del
    nivel y la función callback a la que llamar cuando termine el
    nivel.

    La definición del nivel tiene este formato:
      [ 
        [ parametros de bateria de enemigos ] , 
        [ parametros de bateria de enemigos ] , 
        ... 
      ]


      Los parámetros de cada batería de enemigos son estos:
           Comienzo (ms),  Fin (ms),   Frecuencia (ms),  Tipo,    Override
 Ejemplo:
         [ 0,              4000,       500,              'step',  { x: 100 } ]


    Cada vez que se llame al método step() del nivel éste comprobará:

      - si ha llegado ya el momento de añadir nuevos sprites de alguna
        de las baterías de enemigos.
    
      - si hay que eliminar alguna batería del nivel porque ya ha
        pasado la ventana de tiempo durante la que hay tiene que crear
        enemigos

      - si hay que terminar porque no quedan baterías de enemigos en
        el nivel ni enemigos en el tablero de juegos.

*/

describe ("Clase Level",function(){

	beforeEach(function(){
		oldGame = Game;
		oldSpriteSheet = SpriteSheet;
	});
	
	afterEach(function(){
		Game = oldGame;
		SpriteSheet = oldSpriteSheet;
	});
	
	it("Definida la clase",function(){
		expect(Level).toBeDefined();
	});
	
	it("Crear level",function(){
		var levelData = [{a:1},{a:2},{a:3},{a:4}];
		var callback = function(){};
		var level = new Level(levelData,callback);
		expect(level.levelData).not.toBe(levelData); //nos aseguramos de que el levelData de level es una copia.
		expect(level.levelData[0]).toEqual({a:1}); //toEqual porque son objetos distintos.
		expect(level.levelData[1]).toEqual({a:2});
		expect(level.levelData[2]).toEqual({a:3});
		expect(level.levelData[3]).toEqual({a:4});
		expect(level.callback).toBe(callback);
		expect(level.t).toBe(0);
		expect(level.step).toBeDefined();
		expect(level.draw).toBeDefined();
	});
	
	it("Step",function(){
		var levelData = [[ 0, 20, 5, 'step', { x: 100 } ]];
		var level = new Level(levelData,function(){});
		var board = new GameBoard();
		var dt = 6/1000; //escogemos un dt que nos permita crear 4 enemigos.
		board.add(level);
		expect(board.objects.length).toBe(1); //hemos a–adido el nivel.
		board.step(dt);
		expect(board.objects.length).toBe(2);
		board.step(dt);
		expect(board.objects.length).toBe(3);
		board.step(dt);
		expect(board.objects.length).toBe(4);
		board.step(dt);
		expect(level.levelData.length).toBe(0); //no hay mas baterias. Se ha hecho remove de la bateria de enemigos.
		spyOn(level,'callback');
		board.step(400000);
		expect(level.board.cnt[OBJECT_ENEMY]).toBe(0); //los enemigos han desaparecido del tablero se llamar’a a callback.
		expect(board.objects.length).toBe(1); //sigue definido el nivel.
	});
	
	it("level1 + level2 + win",function(){
		Game = {width: 320, height: 480};
		
		var levelData = [[ 0, 20, 5, 'step']];
		var board,nave; 
		
		var foo = {
			playGame: function(){
				board = new GameBoard();
				nave = new PlayerShip();
				board.add(nave);
				board.add(level1);
			},
			playGame2: function(){
				board = new GameBoard();
				nave = new PlayerShip();
				board.add(nave);
				board.add(level2);
			}
		};
		
		var foo2 = {
			change: function(){
				console.log("me han llamado");
				board = new GameBoard();
				board.add(ts2);
			},
			change2: function(){
				board = new GameBoard();
				board.add(ts3);
			}
		}
		
		var ts1 = new TitleScreen("level1","",foo.playGame);
		var ts2 = new TitleScreen("level2","",foo.playGame2);
		var ts3 = new TitleScreen("you win!","",foo.playGame);
		
		var level1 = new Level(levelData,foo2.change);
		var level2 = new Level(levelData,foo2.change2);
		
		board = new GameBoard();
		board.add(ts1); //iniciamos el juego.
		Game.keys = {'fire': false};
		board.step();
		expect(board.objects.length).toBe(1); // el TitleScreen.
		Game.keys = {'fire': true}; //pulsamos espacio. (iniciamos el nivel 1).
		board.step();
		Game.keys = {'fire': false};
		expect(board.objects.length).toBe(2); //el tablero ha cambiado.
		nave.x = Game.width - nave.w; //hacemos que no exista la posibilidad de colision.
		expect(level1.levelData.length).toBe(1);
		board.step(6/1000);
		board.step(6/1000);
		board.step(6/1000);
		board.step(6/1000);
		expect(level1.levelData.length).toBe(0); //ya se han creado todos los enemigos.
		expect(level1.board.objects.length).toBe(5);
		board.step(400000000);
		expect(board.cnt[OBJECT_ENEMY]).toBe(0);
		
		
	});
	
	it("level1 + crash + lose",function(){
		Game = {width: 320, heigth: 480};
	});
	
});