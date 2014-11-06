/* 
	Probaremos la refactorización de los objetos de este juego mediante su prototipo Sprite.
*/

describe ("Clase Sprite",function(){

	beforeEach(function(){
		oldSpriteSheet = SpriteSheet;
		oldGame = Game;
	});
	
	afterEach(function(){
		SpriteSheet = oldSpriteSheet;
		Game = oldGame;
	});
	
	it("La clase esta definida",function(){
		expect(Sprite).toBeDefined();
	});
	
	it("setup",function(){
		SpriteSheet = {map: {
				ship: { w: 37, h: 42 }
		}};
		var props = {};
		var miSprite = new Sprite();
		spyOn(miSprite, 'merge');
		miSprite.setup('ship',props); //nos aseguramos de que llama a merge.
		expect(miSprite.merge).toHaveBeenCalledWith(props);
		expect(miSprite.w).toBe(37);
		expect(miSprite.h).toBe(42);
		expect(miSprite.sprite).toBe('ship');
		expect(miSprite.frame).toBe(0);
	});
	
	it("merge",function(){
		SpriteSheet = {map: {
				ship: { w: 37, h: 42 }
		}};
		var props = {w: 40, h: 55};
		var miSprite = new Sprite();
		miSprite.setup('ship',props);
		expect(miSprite.w).toBe(37);
		expect(miSprite.h).toBe(42);
		miSprite.merge(props); //nos aseguramos de que se sobrescriben las propiedades.
		expect(miSprite.w).toBe(40);
		expect(miSprite.h).toBe(55);
	});
	
	it("draw",function(){
		SpriteSheet = {map: {
				ship: { x: 0, y: 0, w: 37, h: 42 }
		}};
		SpriteSheet.draw = function(){};
		
		var ctx = {};
		var props = {}; //no necesitamos dar propiedades.
		var miSprite = new Sprite();
		miSprite.setup('ship',props);
		
		spyOn(SpriteSheet, 'draw');
		miSprite.draw(ctx);//nos aseguramos del correcto paso de parametros
		expect(SpriteSheet.draw).toHaveBeenCalledWith(ctx,
																									miSprite.sprite,
																									miSprite.x,
																									miSprite.y,
																									miSprite.w,
																									miSprite.h,0);
	});
});	