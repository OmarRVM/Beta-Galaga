var fondoJuego;
var nave;
var cursores;
var balas;
var tiempoBala = 0;
var botonDisparo;

var enemigos;
var enemigos1;

var puntos;
var txtPuntos;
var txtNivel;
var nivel;

var juego = new Phaser.Game(400, 550, Phaser.CANVAS, 'bloque_juego');

var estadoPrincipal = {
  preload: function () {
    //carga todos los recursos
    juego.load.image('fondo', 'img/space.png');
    juego.load.image('personaje', 'img/ship.png');
    juego.load.image('laser', 'img/laser.png');
    juego.load.image('enemigo', 'img/enemy.png');
    juego.load.image('enemigo1', 'img/enemy1.png');
    juego.load.audio('fondo', 'music/fondo.mp3');
    juego.load.audio('disparo', 'music/disparo.wav');
    juego.load.audio('gameOver', 'music/ThisGameIsOver.wav');
  },
  create: function () {
    //mostrar pantalla
    fondoJuego = juego.add.tileSprite(0, 0, 400, 550, 'fondo');

    //asignar el audio de fondo
    bgmusic = juego.add.audio('fondo');
    bgmusic.play('', 0, 0.5, true);

    nave = juego.add.sprite(juego.width / 2, 500, 'personaje');
    nave.anchor.setTo(0.5);

    cursores = juego.input.keyboard.createCursorKeys();
    botonDisparo = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    balas = juego.add.group();
    balas.enableBody = true;
    balas.physicsBodyType = Phaser.Physics.ARCADE;
    balas.createMultiple(20, 'laser');
    balas.setAll('anchor.x', 0.5);
    balas.setAll('anchor.y', 1);
    balas.setAll('outOfBoundsKill', true);
    balas.setAll('checkWorldBounds', true);

    enemigos = juego.add.group();
    enemigos.enableBody = true;
    enemigos.physicsBodyType = Phaser.Physics.ARCADE;

    //Crear enemigos y mostrarlos en pantalla
    for (var y = 0; y < 2; y++) {
      for (var x = 0; x < 5; x++) {
        var enemigo = enemigos.create(x *
          65, y * 55, 'enemigo');
        enemigo.anchor.setTo(0.5);
      }
    }
    enemigos.x = 60;
    enemigos.y = 70;
    var animacion = juego.add.tween(enemigos).to({ x: 100 }, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true);


    //Definiendo el puntaje en pantalla
    puntos = 0;
    juego.add.text(20, 20, "Puntos: ", { font: "14px Arial", fill: "#FFF" });
    txtPuntos = juego.add.text(80, 20, "0", { font: "14px Arial", fill: "#FF0" });

    //Definiendo el nivel en pantalla
    juego.add.text(300, 20, "Nivel: ", { font: "14px Arial", fill: "#FFF" });
    txtNivel = juego.add.text(350, 20, "1", { font: "14px Arial", fill: "#FF0" });

    //declarar los audios 
    disparo = this.sound.add('disparo');
    gameOver = this.sound.add('gameOver');
  },
  update: function () {
    //animamos el juego
    if (cursores.right.isDown) {
      nave.position.x += 3;
    }
    else if (cursores.left.isDown) {
      nave.position.x -= 3;
    }
    var bala;
    if (botonDisparo.isDown) {
      if (juego.time.now > tiempoBala) {
        bala = balas.getFirstExists(false);
      }
      if (bala) {
        disparo.play();
        bala.reset(nave.x, nave.y);
        bala.body.velocity.y = -300;
        tiempoBala = juego.time.now + 100;
      }
    }
    juego.physics.arcade.overlap(balas, enemigos, colision, null, this);

    if (puntos >= 10) {
      alert("GANASTE");
      bgmusic.stop();
      gameOver.play();

    }
  }
};

function colision(bala, enemigo) {
  bala.kill();
  enemigo.kill();
  puntos++;
  txtPuntos.text = puntos;
}


//asignamos el estado que acaba de crear al juego
juego.state.add('principal', estadoPrincipal);
//Iniciar el juego del estado principal por defecto
juego.state.start('principal');