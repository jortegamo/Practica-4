/*

  Requisitos:

  El objetivo de este prototipo es que se detecten colisiones entre
  varios tipos de sprites:
  
  - Los misiles tienen ahora una nueva propiedad: el daÒo (damage) que
    infligen a una nave enemiga cuando colisionan con ella. Cuando un
    misil colisione con una nave enemiga le infligir· un daÒo de
    cierta cuantÌa (damage) a la nave enemiga con la que impacta, y
    desaparecer·.

  - Las naves enemigas tienen ahora una nueva propiedad: su salud
    (health).  El daÒo ocasionado a una nave enemiga por un misil har·
    que disminuya la salud de la nave enemiga, y cuando llegue a cero,
    la nave enemiga desaparecer·.

  - cuando una nave enemiga colisione con la nave del jugador, deber·
    desaparecer tanto la nave enemiga como la nave del jugador.



  EspecificaciÛn:

  En el prototipo 07-gameboard se aÒadiÛ el constructor GameBoard. El
  mÈtodo overlap() de los objetos creados con GameBoard() ofrece
  funcionalidad para comprobar si los rect·ngulos que circunscriben a
  los sprites que se le pasan como par·metros tienen intersecciÛn no
  nula. El mÈtodo collide() de GameBoard utiliza overlap() para
  detectar si el objeto que se le pasa como primer par·metro ha
  colisionado con alg˙n objeto del tipo que se le pasa como segundo
  par·metro.

  En este prototipo se utilizar· el mÈtodo collide() para detectar los
  siguientes tipos de colisiones:

    a) detectar si un misil disparado por la nave del jugador
       colisiona con una nave enemiga

    b) detectar si una nave enemiga colisiona con la nave del jugador


  En el mÈtodo step() de los objetos creados con PlayerMissile() y
  Enemy(), tras "moverse" a su nueva posiciÛn calculada, se comprobar·
  si han colisionado con alg˙n objeto del tipo correspondiente. 

  No interesa comprobar si se colisiona con cualquier otro objeto,
  sino sÛlo con los de ciertos tipos. El misil tiene que comprobar si
  colisiona con naves enemigas. Por otro lado, tras moverse una nave
  enemiga, Èsta tiene que comprobar si colisiona con la nave del
  jugador. Para ello cada sprite tiene un tipo y cuando se comprueba
  si un sprite ha colisionado con otros, se pasa como segundo
  argumento a collide() el tipo de sprites con los que se quiere ver
  si ha colisionado el objeto que se pasa como primer argumento.

  Cuando un objeto detecta que ha colisionado con otro, llama al
  mÈtodo hit() del objeto con el que ha colisionado. 


  Efectos de las colisiones de un misil con una nave enemiga:

    Cuando el misil llama al mÈtodo hit() de una nave enemiga, pasa
    como par·metro el daÒo que provoca para que la nave enemiga pueda
    calcular la reducciÛn de salud que conlleva la colisiÛn. Cuando
    una nave enemiga recibe una llamada a su mÈtodo .hit() realizada
    por un misil que ha detectado la colisiÛn, la nave enemiga
    recalcula su salud reduciÈndola en tantas unidades como el daÒo
    del misil indique, y si su salud llega a 0 desaparece del tablero
    de juegos, produciÈndose en su lugar la animaciÛn de una
    explosiÛn.

    El misil, tras informar llamando al mÈtod hit() de la nave enemiga
    con la que ha detectado colisiÛn, desaparece.


  Efectos de las colisiones de una nave enemiga con la nave del jugador:

    Cuando la nave del jugador recibe la llamada .hit() realizada por
    una nave enemiga que ha detectado la colisiÛn, la nave del jugador
    desaparece del tablero.

    La nave enemiga, tras informar llamando a hit() de la nave del
    jugador, desaparece tambiÈn.

*/

describe("Collisions",function(){

	beforeEach(function(){
		oldSpriteSheet = SpriteSheet;
		oldGame = Game;
	});
	afterEach(function(){
		SpriteSheet = oldSpriteSheet;
		Game = oldGame;
	});
	
	it("missil vs enemy (damage > health)",function(){
		SpriteSheet = {map: {
    	missile: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 },
    	enemy_purple: { sx: 37, sy: 0, w: 42, h: 43, frames: 1 },
    	explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 }}
		};
		var board = new GameBoard();
		var misil = new PlayerMissile (0,1);
		var enemy = new Enemy({x:0,y:0,sprite: 'enemy_purple',health: 10});
		misil.vy = 0; //hago que esté quieto.
		board.add(misil);
		board.add(enemy);
		expect(board.objects.length).toBe(2);
		board.step(1);
		expect(board.objects.length).toBe(1); //se ha añadido el sprite explosion como consecuencia de la colisión.
		expect(board.objects[0].sprite).toBe('explosion');
	});
	
	it("missil vs enemy (damage < health)",function(){
		SpriteSheet = {map: {
    	missile: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 },
    	enemy_purple: { sx: 37, sy: 0, w: 42, h: 43, frames: 1 },
    	explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 }}
		};
		var board = new GameBoard();
		var misil = new PlayerMissile (0,1);
		var enemy = new Enemy({x:0,y:0,sprite: 'enemy_purple',health: 20});
		misil.vy = 0; //hago que esté quieto.
		board.add(misil);
		board.add(enemy);
		expect(board.objects.length).toBe(2);
		board.step(1);
		expect(board.objects.length).toBe(1); //sigue existiendo el enemigo.
		expect(board.objects[0].sprite).toBe('enemy_purple');
	});
	
	it("fireball vs enemy",function(){
		SpriteSheet = {map: {
    	enemy_purple: { sx: 37, sy: 0, w: 42, h: 43, frames: 1 },
    	explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 },
    	fireball: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 }}
		};
		var board = new GameBoard();
		var fireball = new FireBall (0,1,'left');
		var enemy = new Enemy({x:0,y:0,sprite: 'enemy_purple',health: 20});
		fireball.vy = 0; //hago que esté quieto.
		fireball.vx = 0;
		board.add(fireball);
		board.add(enemy);
		expect(board.objects.length).toBe(2);
		board.step(1);
		expect(board.objects.length).toBe(2); //sigue existiendo el fireball.
		expect(board.objects[0].sprite).toBe('fireball');
		expect(board.objects[1].sprite).toBe('explosion'); //se añade el sprite explosion como resultado de la colisión.
	});
	
	it("playerShip vs enemy",function(){
		SpriteSheet = {map: {
			ship: { sx: 0, sy: 0, w: 37, h: 42, frames: 1 },
			explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 },
    	enemy_purple: { sx: 37, sy: 0, w: 42, h: 43, frames: 1 }}
		};
		var board = new GameBoard();
		var nave = new PlayerShip ();
		nave.x = 0; //cambio las ubicaciones por defecto.
		nave.y = 0;
		var enemy = new Enemy({x:0,y:1,sprite: 'enemy_purple',health: 10});
		board.add(nave);
		board.add(enemy);
		expect(board.objects.length).toBe(2);
		board.step(1);
		expect(board.objects.length).toBe(1); //Ahora se muestra la explosion.
		
	});
});
