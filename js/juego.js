var canvas;
var ctx;
var fps = 30;
var canvasX = 500; //ancho
var canvasY = 500; //alto
var tileX, tileY;

//Variables relacionadas con el tablero de juego
var tablero;
var filas = 100;
var columnas = 100;

var blanco = '#FFFFFF';
var negro = '#000000';



function creaArray2D(f,c){
    var obj = new Array(f);
    for (i=0;i<f;i++){
        obj[i] = new Array(c);
    }
    return obj;
}

//celula o turmita
var Celula = function(x,y,estado){
    this.x = x;
    this.y = y;
    this.estado = estado; //vivo = 1, muerto = 2
    this.estadoprox = this.estado; //estado siguiente ciclo
    
    this.vecinos = [];//guardamos el listado de los vecinos

    //metodo que añade los vecinos del objeto actual
    this.addVecinos = function(){
        var xVecino;
        var yVecino;
        //saca la matriz de -1,-1 hasta 1,1 al rededor
        for(i=-1;i<2;i++){
            for(j=-1;j<2;j++){  
                xVecino = (this.x + j + columnas) % columnas;
                yVecino = (this.y + i + filas) % filas;
                //descartar el agente actual o celula actual
                //no puedo ser mi propio vecino
                if(i!=0 || j!=0 ){
                    this.vecinos.push(tablero[yVecino][xVecino]);
                }
            }
        }
        
    }
    this.dibuja = function(){
        var color;

        if(this.estado == 1){
            color=blanco;
        }
        else{
            color = negro;
        }
        ctx.fillStyle = color;
        ctx.fillRect(this.x*tileX, this.y*tileY, tileX, tileY);
    }
    //leyes de conway
    this.nuevoCiclo = function(){
        var suma =0;
        //cantidad de vecinos vivos
        for(i=0; i<this.vecinos.length;i++){
            suma += this.vecinos[i].estado;
        } 
        //Aplicamos normas
        this.estado = this.estado;//se deja igual
        //muerte: tiene menos de 2 o mas de 3 
        if(suma < 2 || suma >3){
            this.estadoprox = 0;
        }
        //vida/reproduccion si tiene 3 vecinos
        if(suma==3){
            this.estadoprox=1;
        }
    }
    this.mutacion = function(){
        this.estado = this.estadoprox;
    }
} 


function inicializaTablero(obj){
    var estado;
    for(y=0;y<filas;y++){
        for(x=0;x<columnas;x++){
            estado = Math.floor(Math.random()*2);
            obj[y][x] = new Celula(x,y,estado);
        }
    }
    for(y=0;y<filas;y++){
        for(x=0;x<columnas;x++){
            obj[y][x].addVecinos();

        }
    }
}


function inicializa(){
    //console.log('Carga');
    //asociamos el canvas
    canvas = document.getElementById('pantalla');
    ctx = canvas.getContext('2d');

    //ajustar el tamaño
    canvas.width = canvasX;
    canvas.height = canvasY;

    //calcular tamaño de los titles
    tileX = Math.floor(canvasX/filas);
    tileY = Math.floor(canvasY/columnas);

    //crear el tablero
    tablero = creaArray2D(filas, columnas);

    //inicializamos 
    inicializaTablero(tablero)

    //ejecutar bucle principal
    setInterval(function(){principal();},1000/fps)
}


function dibujarTablero(obj){
    //dibuja las celulas

    for(y=0;y<filas;y++){
        for(x=0;x<columnas;x++){
            obj[y][x].dibuja();
        }
    }
    //calcula el siguiente ciclo:
    for(y=0;y<filas;y++){
        for(x=0;x<columnas;x++){
            obj[y][x].nuevoCiclo();
        }
    }    


    //aplica mutacion
    for(y=0;y<filas;y++){
        for(x=0;x<columnas;x++){
            obj[y][x].mutacion();
        }
    }

}

function borrarCanvas(){
    canvas.width = canvas.width;
    canvas.height = canvas.height;
}


function principal(){
    borrarCanvas();
    dibujarTablero(tablero);


}





