/*

  Requisitos: 

  La nave del usuario disparará 2 misiles si está pulsada la tecla de
  espacio y ha pasado el tiempo de recarga del arma.

  El arma tendrá un tiempo de recarga de 0,25s, no pudiéndose enviar
  dos nuevos misiles antes de que pasen 0,25s desde que se enviaron
  los anteriores



  Especificación:

  - Hay que añadir a la variable sprites la especificación del sprite
    missile

  - Cada vez que el usuario presione la tecla de espacio se añadirán
    misiles al tablero de juego en la posición en la que esté la nave
    del usuario. En el código de la clase PlayerSip es donde tienen
    que añadirse los misiles

  - La clase PlayerMissile es la que implementa los misiles. Es
    importante que la creación de los misiles sea poco costosa pues va
    a haber muchos disparos, para lo cual se declararán los métodos de
    la clase en el prototipo

*/

describe ("Clase PlayerMissile",function(){

	beforeEach (function(){
		loadFixtures('index.html');
		canvas = $('#game')[0];
		expect(canvas).toExist();
	
		ctx = canvas.getContext('2d'); // necesario para los mŽtodos draw
		expect(ctx).toBeDefined();
		oldSpriteSheet = SpriteSheet;
		oldGame = Game;
	});
	
	afterEach (function(){
		SpriteSheet = oldSpriteSheet;
		Game = oldGame;
	});
	
	it("Definida la clase",function(){
		expect(PlayerMissile).toBeDefined();
	});
	
	it("Creando un misil",function(){
		SpriteSheet = { // creamos un objeto dummy SpriteSheet y que en su map tiene almacenado un sprite missile.
  			map : {missile: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 }},
		};
		Game = {width: 320, height: 480};
		var missile = new PlayerMissile(Game.width/2,Game.height);
		expect(missile.x).toBe(159);
		expect(missile.y).toBe(470);
		expect(missile.w).toBe(2);
		expect(missile.h).toBe(10);
		expect(missile.vy).toBe(-700);
	});
	
	it("step",function(){
		SpriteSheet = { // creamos un objeto dummy SpriteSheet y que en su map tiene almacenado un sprite missile.
  			map : {missile: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 }},
		};
		var miboard = new GameBoard();
		var miMissile1 = new PlayerMissile (5,5);
		var miMissile2 = new PlayerMissile (130,400);
		// a–adimos miMissile a board para que miMissile pueda referenciar a board.
		miboard.add (miMissile1); 
		miboard.add (miMissile2);
		spyOn(miboard, "remove");
		spyOn(miMissile1,"step").andCallThrough();
		spyOn(miMissile2,"step").andCallThrough();
		var dt = 0.5;
		miboard.step(dt);
		runs(function(){
			expect (miboard.remove).toHaveBeenCalled(); // se deber’a haber llamado a remove
			expect (miMissile1.step).toHaveBeenCalled(); //se deben haber llamado a los mŽtodos step de cada misil.
			expect (miMissile2.step).toHaveBeenCalled();
			expect (miboard.remove.calls[0].args[0]).toBe (miMissile1); // me aseguro de que el missile para borrar es el 1 y no el 2.
			expect (miboard.remove.length).toBe(0); //me aseguro de que se ha llamado a finalizeRemoved().
			expect (miMissile2.y).toBe(40); //El missile2 sigue existiendo en el canvas.
		});
	});
	
	it("draw",function(){
		SpriteSheet = { // creamos un objeto dummy SpriteSheet y que en su map tiene almacenado un sprite missile.
  			map : {missile: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 }},
  			draw: function() {}
		};
		var miMissile = new PlayerMissile (5,5); // creamos un nuevo objeto missile.
		var miboard = new GameBoard();
		miboard.add(miMissile);
		spyOn (SpriteSheet, "draw");
		miboard.draw(ctx);
		runs(function(){
			expect (SpriteSheet.draw).toHaveBeenCalled(); // deber‡ llamar a SpriteSheet.draw
			expect (SpriteSheet.draw.calls[0].args[0]).toBe (ctx); // comprobamos que el orden de argumentos es el correcto.
			expect (SpriteSheet.draw.calls[0].args[1]).toBe ('missile');
			expect (SpriteSheet.draw.calls[0].args[2]).toBe (miMissile.x);
			expect (SpriteSheet.draw.calls[0].args[3]).toBe (miMissile.y);
		});
	});
	
	
	it ("No hay disparos con tecla pulsada",function(){
		// creamos un objeto dummy SpriteSheet y que en su map tiene almacenado un sprite missile y el sprite de nuestra nave.
		SpriteSheet = { 
  			map : {ship: { sx: 0, sy: 0, w: 37, h: 42, frames: 1 },
  						 missile: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 }}
		};
		var miBoard = new GameBoard();
		var miNave = new PlayerShip();
		miBoard.add(miNave);
		Game.keys = {'fire': false};
		miBoard.step(0.5); //ahora iniciamos con la tecla sin pulsar.
		expect(miBoard.objects.length).toBe(1);
		Game.keys = {'fire': true};
		miBoard.step(1); //nos aseguramos de que se ha cumplido el tiempo de recarga.
		expect(miBoard.objects.length).toBe(3);
		miBoard.step(0.30); //los misiles no han desaparecido, pero el tiempo de recarga si que ha expirado.
		//no se deben poder disparar puesto que la tecla de disparo esta pulsada.
		expect(miBoard.objects.length).toBe(3);
		//ahora despulsamos y volvemos a disparar.
		Game.keys = {'fire': false};
		miBoard.step(0); //no ha pasado tiempo.
		Game.keys = {'fire': true};
		miBoard.step(0); //el tiempo de recarga ha expirado y no se ha reseteado todavia.
		expect(miBoard.objects.length).toBe(5); //se suman los nuevos disparos.
	});
	
	
});