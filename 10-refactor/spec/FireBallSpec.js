describe ("Clase Fireball",function(){

	beforeEach(function(){
		loadFixtures('index.html');

    canvas = $('#game')[0];
    expect(canvas).toExist();

    ctx = canvas.getContext('2d');
    expect(ctx).toBeDefined();
    
		oldSpriteSheet = SpriteSheet;
		oldGame = Game;
	});
	
	afterEach(function(){
		SpriteSheet = oldSpriteSheet;
		Game = oldGame;
	});
	
	
	it("Definida la clase",function(){
		expect(FireBall).toBeDefined();
	});
	
	it("Crear Fireball",function(){
		SpriteSheet = {
			map: {fireball: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 }}
		};
		var lFB = new FireBall(10,10,'left');
		var rFB = new FireBall(10,10,'right');
		expect (lFB.w).toBe(32);
		expect (lFB.h).toBe(32);
		expect (lFB.x).toBe(-6);
		expect (lFB.y).toBe(-22);
		expect (lFB.vx).toBe(-200);
		expect (lFB.vy).toBe(-750);
		expect (rFB.vx).toBe(200);
	});
	
	it("step FB left",function(){
		SpriteSheet = {
			map: {fireball: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 }}
		};
		var board = {remove: function(){}};
		var FB = new FireBall(160,480,'left');
		FB.board = board;
		FB.step(0.5);
		expect(FB.x).toBe(44);
		expect(FB.y).toBe(73);
		spyOn(board, 'remove');
		FB.step(1);
		expect(board.remove).toHaveBeenCalled(); //ya ha desaparecido de la pantalla.
	});
	
	it("step FB right",function(){
		SpriteSheet = {
			map: {fireball: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 }}
		};
		var board = {remove: function(){}};
		var FB = new FireBall(160,480,'right');
		FB.board = board;
		FB.step(0.5);
		expect(FB.x).toBe(244);
		expect(FB.y).toBe(73);
		spyOn(board, 'remove');
		FB.step(1);
		expect(board.remove).toHaveBeenCalled(); //ya ha desaparecido de la pantalla.
	});
	
	it("draw",function(){
		SpriteSheet = {
			map: {fireball: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 }},
			draw: function(){}
		};
		var FB = new FireBall(10,10);
		spyOn(SpriteSheet,'draw');
		FB.draw(ctx);
		//Nos aseguramos de que el paso de parametros es el correcto.
		expect (SpriteSheet.draw).toHaveBeenCalledWith(ctx,'fireball',FB.x,FB.y,0,FB.w,FB.h);
	});
	
	it ("No hay disparos con tecla pulsada",function(){
		// creamos un objeto dummy SpriteSheet y que en su map tiene almacenado un sprite explosion y el sprite de nuestra nave.
		SpriteSheet = { 
  			map : {ship: { sx: 0, sy: 0, w: 37, h: 42, frames: 1 },
  						 fireball: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 }}
		};
		var miBoard = new GameBoard();
		var miNave = new PlayerShip();
		miBoard.add(miNave);
		Game.keys = {'leftFB': false};
		miBoard.step(0.5); //ahora iniciamos con la tecla sin pulsar.
		expect(miBoard.objects.length).toBe(1);
		Game.keys = {'leftFB': true};
		miBoard.step(1); //nos aseguramos de que se ha cumplido el tiempo de recarga.
		expect(miBoard.objects.length).toBe(2);
		miBoard.step(0.30); //el FB no ha desaparecido, pero el tiempo de recarga si que ha expirado.
		//no se debe poder disparar puesto que la tecla de disparo esta pulsada.
		expect(miBoard.objects.length).toBe(2);
		//ahora despulsamos y volvemos a disparar.
		Game.keys = {'leftFB': false};
		miBoard.step(0); //no ha pasado tiempo.
		Game.keys = {'leftFB': true};
		miBoard.step(0); //el tiempo de recarga ha expirado y no se ha reseteado todavia.
		expect(miBoard.objects.length).toBe(3); //se suma el nuevo disparo.
	});
	
	
	
});