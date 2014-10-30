/*

  En el anterior prototipo (06-player), el objeto Game permite
  gestionar una colecci�n de tableros (boards). Los tres campos de
  estrellas, la pantalla de inicio, y el sprite de la nave del
  jugador, se a�aden como tableros independientes para que Game pueda
  ejecutar sus m�todos step() y draw() peri�dicamente desde su m�todo
  loop(). Sin embargo los objetos que muestran los tableros no pueden
  interaccionar entre s�. Aunque se a�adiesen nuevos tableros para los
  misiles y para los enemigos, resulta dif�cil con esta arquitectura
  pensar en c�mo podr�a por ejemplo detectarse la colisi�n de una nave
  enemiga con la nave del jugador, o c�mo podr�a detectarse si un
  misil disparado por la nave del usuario ha colisionado con una nave
  enemiga.


  Requisitos:

  Este es precisamente el requisito que se ha identificado para este
  prototipo: dise�ar e implementar un mecanismo que permita gestionar
  la interacci�n entre los elementos del juego. Para ello se dise�ar�
  la clase GameBoard. Piensa en esta clase como un tablero de un juego
  de mesa, sobre el que se disponen los elementos del juego (fichas,
  cartas, etc.). En Alien Invasion los elementos del juego ser�n las
  naves enemigas, la nave del jugador y los misiles. Para el objeto
  Game, GameBoard ser� un board m�s, por lo que deber� ofrecer los
  m�todos step() y draw(), siendo responsable de mostrar todos los
  objetos que contenga cuando Game llame a estos m�todos.

  Este prototipo no a�ade funcionalidad nueva a la que ofrec�a el
  prototipo 06.


  Especificaci�n: GameBoard debe

  - mantener una colecci�n a la que se pueden a�adir y de la que se
    pueden eliminar sprites como nave enemiga, misil, nave del
    jugador, explosi�n, etc.

  - interacci�n con Game: cuando Game llame a los m�todos step() y
    draw() de un GameBoard que haya sido a�adido como un board a Game,
    GameBoard debe ocuparse de que se ejecuten los m�todos step() y
    draw() de todos los objetos que contenga

  - debe ofrecer la posibilidad de detectar la colisi�n entre
    objetos. Un objeto sprite almacenado en GameBoard debe poder
    detectar si ha colisionado con otro objeto del mismo
    GameBoard. Los misiles disparados por la nave del jugador deber�n
    poder detectar gracias a esta funcionalidad ofrecida por GameBoard
    cu�ndo han colisionado con una nave enemiga; una nave enemiga debe
    poder detectar si ha colisionado con la nave del jugador; un misil
    disparado por la nave enemiga debe poder detectar si ha
    colisionado con la nave del jugador. Para ello es necesario que se
    pueda identificar de qu� tipo es cada objeto sprite almacenado en
    el tablero de juegos, pues cada objeto s�lo quiere comprobar si ha
    colisionado con objetos de cierto tipo, no con todos los objetos.

*/

describe ("Clase GameBoard",function(){

	it ("Definida la clase",function(){
		expect (GameBoard).toBeDefined();
	});
	
	it ("add",function(){
		var board = new GameBoard();
		expect(board.objects.length).toBe(0);
		var obj = {}; //solo queremos saber si a�ade satisfactoramente los objetos.
		board.add(obj);
		expect(board.objects.length).toBe(1);
		expect(obj.board).toBe(board); //el objeto se enlaza al tablero.
	});
	
	it ("remove + resetRemoved + finalizeRemoved",function(){
		var board = new GameBoard();
		var obj = {};
		board.add(obj);
		board.resetRemoved(); //inicializamos el array de objetos marcados para eliminar.
		expect(board.removed.length).toBe(0);
		board.remove(obj); //marcamos el objeto a eliminar.
		//el objeto no se borra de objects.
		expect(board.removed.length).toBe(1);
		expect(board.objects.length).toBe(1);
		board.finalizeRemoved(); //realizamos el borrado.
		//el objeto se borra de objects pero no se desmarca. (Habra que llamar a resetRemoved de nuevo).
		//No hay problema puesto que el borrado se hace sobre todos los elementos de removed.
		//Despues de llamar a finalizeRemoved habra que llamar a inicializeRemoved.
		//En la proxima pasada del loop de Game estar� inicializado y listo para almacenar marcados.
		expect(board.objects.length).toBe(0);
		expect(board.removed.length).toBe(1);
	});
	
	it ("step + iterate",function(){
		var board = new GameBoard();
		var obj1 = {step: function(){}};
		var obj2 = {step: function(){}};
		board.add(obj1);
		board.add(obj2);
		spyOn (obj1,"step");
		spyOn (obj2,"step");
		//al llamar a step de board se llama a iterate()
		//en iterate se llama a la funci�n especificada de cada objeto.
		board.step(1);
		expect(obj1.step).toHaveBeenCalled();
		expect(obj2.step).toHaveBeenCalled();
		expect(obj1.step.calls[0].args[0]).toBe(1);
		expect(obj1.step.calls[0].args[0]).toBe(1);
	});
	
	it ("draw + iterate",function(){
		var board = new GameBoard();
		var obj1 = {draw: function(){}};
		var obj2 = {draw: function(){}};
		board.add(obj1);
		board.add(obj2);
		spyOn (obj1,"draw");
		spyOn (obj2,"draw");
		//al llamar a step de board se llama a iterate()
		//en iterate se llama a la funci�n especificada de cada objeto.
		board.draw();
		expect(obj1.draw).toHaveBeenCalled();
		expect(obj2.draw).toHaveBeenCalled();
	});
	
	it ("detect",function(){
		var board = new GameBoard();
		var obj1 = {type: 'ally'};
		var obj2 = {type: 'enemy'};
		board.add(obj1);
		board.add(obj2);
		//En func creamos una funci�n sencilla que nos devolver� los objetos que sean aliados.
		var objDetected = board.detect (function(){ return this.type === 'ally'});
		//comprobamos que el objeto devuelto es el correcto.
		expect(objDetected).toBe(obj1);
	});
	
	it ("overlap",function(){
		var board = new GameBoard();
		var obj1 = {x: 0,y: 0,h: 2,w: 2};
		var obj2 = {x: 1,y: 1,h: 2,w: 2};
		var obj3 = {x: 2,y: 2,h: 2,w: 2};
		board.add(obj1);
		board.add(obj2);
		board.add(obj3);
		expect(board.overlap(obj1,obj2)).toBe(true);
		expect(board.overlap(obj1,obj3)).toBe(false);
	});
	
	it ("collide",function(){
		var board = new GameBoard();
		var obj1 = {x: 0,y: 0,h: 2,w: 2};
		var obj2 = {x: 1,y: 1,h: 2,w: 2};
		var obj3 = {x: 2,y: 2,h: 2,w: 2};
		board.add(obj1);
		board.add(obj2);
		board.add(obj3);
		expect(board.collide(obj1)).toBe(obj2);
		//el type deber� ser un objeto ya que el comparador binario es clave.
		expect(board.collide(obj1,'missile')).toBe(false);
		expect(board.collide(obj3)).toBe(obj2);
	});
});
