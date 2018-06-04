#pragma strict

var Salida : GameObject;
var Llegada : GameObject;
var Muro : GameObject;
var Pasillo : GameObject;
var Player : GameObject;

//Variables Maze. Dimensiones y posiciones deben ser impares
//para crear mapas completamente cerrados, y posiciones intermedias(ninguna en algun extremo del mapa)
private var MAZEX : int;
private var MAZEY : int;
private var ENDX  : int;
private var ENDY  : int;

private var START     : int = -1;
private var UNVISITED : int = 0;
private var END       : int = 1;
private var WALL      : int = 2;
private var OPEN      : int = 3;

//Variables Gestion Ventanas
private var mostrarGUI : boolean = true;
private var mostrarAviso : boolean = false;

private var mazeX : String = "15";
private var mazeY : String = "15";

//Dimensiones Ventana Maze
private var labelX : Rect = Rect(50,25,50,20);
private var labelY : Rect = Rect(50,60,50,20);
private var textFieldX : Rect = Rect(120,25,30,20);
private var textFieldY : Rect = Rect(120,60,30,20);
private var dimensionesVentanaMaze : Rect = Rect(Screen.width*0.5-125,Screen.height*0.5-70,250,140);
private var botonAceptar : Rect = Rect(90,95,70,30);

//Dimensiones Ventana Aviso
private var dimensionesVentanaAviso : Rect = Rect(dimensionesVentanaMaze.x+10,dimensionesVentanaMaze.y+10,200,110);
private var labelAviso : Rect = Rect(30,25,140,50);
private var botonOK : Rect = Rect (75,70,50,30);
private var avisoTexto : String;

private var mostrarGUI2 : boolean = false;
private var endX : String = "1";
private var endY : String = "1";

private var texturaFondo : Texture2D;
private var dimensionesTextura : Rect = Rect(0,0,Screen.width,Screen.height);



function Start() {

	texturaFondo = Resources.Load("aqua2",Texture2D);
	
	if(texturaFondo==null) print("textura no encontrada");

}


function create_maze(size_x : int, size_y : int, end_x : int, end_y : int) {

	var no = [[-1, 0],[0,-1],[1,0],[0,1]];	//Norte, Oeste, Sur, Este
	
	var maze : int[,] = new int[size_y,size_x];
	
	var i : int;
	var ii : int;
	var unvisited : int = size_x*size_y; //Zonas sin visitar o mapear
	
	//Amurallamos(WALL) el mapa, de forma cuadriculada	
	for(i=0;i<size_x;i++) { for(ii=0;ii<size_y;ii+=2) { maze[ii,i]=WALL; unvisited--; }	}
	for(ii=1;ii<size_y;ii+=2) { for(i=0;i<size_x;i+=2) { maze[ii,i]=WALL; unvisited--; } }
	
	//Posicion de Llegada. Desde esta posicion empezamos a crear el mapa
	var x : int = end_x;
	var y : int = end_y;
	maze[y,x] = END;
	unvisited--;
	
	var noi : int;
	var nx : int;
	var ny : int;
	var nx2 : int;
	var ny2 : int;	
	var cells_to_end : int = OPEN; //OPEN=3, el maximo valor de los 5 estados: END, START, UNVISITED, WALL, OPEN.
	
	while (unvisited>0) {
	
		noi = (Random.value*4)%4; //Obtener un numero entero entre 0-3
		
		for(i=0;i<4;i++) {
		
			nx = x + no[noi][0] * 2;
			ny = y + no[noi][1] * 2;
			
			if((nx<0)||(nx>=size_x)||(ny<0)||(ny>=size_y)||maze[ny,nx]>UNVISITED) {
			
				noi = (noi+1)%4; //Si no es accesible, cambiamos de posicion
				continue;
				
			}
			
			nx2 = x + no[noi][0]; //Posicion ocupada por WALL(muro)
			ny2 = y + no[noi][1];
			
			maze[ny2,nx2] = OPEN; //Abrimos camino
			maze[ny,nx] = OPEN;
			
			unvisited--; //Hemos localizado una posicion no visitada
			
			x = nx; //Actualizamos posicion actual
			y = ny;
			cells_to_end+=2; //Incrementamos su valor, para saber cual ha sido la ultima posicion utilizada.
							 //Esto nos sirve para localizar la posicion de salida.
			break;
			
		}
		
		if ( i == 4 ) { //Si no hemos encontrado ninguna posicion accesible
		
			maze[y,x]=cells_to_end; //Posible posicion de salida
			cells_to_end-=1; //Reducimos su valor antes de retroceder
			
			for(i=0;i<4;i+=1) { //Retrocedemos
			
				nx = x + no[i][0]; //Posicion adayacente a la actual
				ny = y + no[i][1];
				
				if(maze[ny,nx]!=OPEN) continue; //Si no esta abierto, continuar, buscar otra posicion
				
				maze[ny,nx]=cells_to_end; //Para evitar retroceder por este sitio
				cells_to_end-=1; //Reducimos su valor
				
				x+=no[i][0]*2; //Actualizar posicion actual
				y+=no[i][1]*2;
				break;
				
			}
			
		}
		
	}
	
	//Localizar la posicion de salida. Casilla con mayor valor
	nx = ny = 0;
	
	for(i=0;i<size_x;i++) {
	
		for(ii=0;ii<size_y;ii++) {
		
			if(maze[ii,i]>maze[ny,nx]) {
		
				nx = i;			
        	    ny = ii;
            
        	}
			
		}
		
	}
	
    maze[ny,nx] = START;
    
    draw_maze(maze,size_x,size_y);

}

function draw_maze(maze : int[,], size_x : int, size_y : int) {

	var i : int;
	var ii : int;

	for(ii=0;ii<size_y;ii++) {
	
		for(i=0;i<size_x;i++) {	
	
			switch (maze[ii,i]) {
		
            	case WALL:
            
 		           	Instantiate(Muro,Vector3(i,0,ii),Muro.transform.rotation);
            		break;
            	
        	    case END:
            
             		Instantiate(Llegada,Vector3(i,0,ii),Llegada.transform.rotation);
            		break;
            		            	
            	case START:
            
             		Instantiate(Salida,Vector3(i,0,ii),Salida.transform.rotation);
             		Instantiate(Player,Vector3(i,0,ii),Player.transform.rotation);

            		break;
            		
          	  	default:
            
            		Instantiate(Pasillo,Vector3(i,0,ii),Pasillo.transform.rotation);
           		 	break;            		
            			
			}
        
        }	
	
	}

}



//VENTANAS

function OnGUI() {

	if(mostrarAviso||mostrarGUI||mostrarGUI2) {
	
		//Fondo GUI
		GUI.DrawTexture(dimensionesTextura,texturaFondo,ScaleMode.StretchToFill);
		
		//Introducir numeros impares
		GUILayout.Label("Introducir numeros impares");
	
		//Ventanas
		if(mostrarAviso) GUI.Window(2,dimensionesVentanaAviso,ventanaAviso,"Aviso");
			else if(mostrarGUI) GUI.Window(0,dimensionesVentanaMaze,ventanaMaze,"Maze");
				else if(mostrarGUI2) GUI.Window(1,dimensionesVentanaMaze,ventanaPosicionLlegada,"Meta");
				
		
	}

}

function ventanaMaze(idWindow : int) {

	GUI.Label(labelX,"Ancho");
	GUI.Label(labelY,"Alto");	
	mazeX = GUI.TextField (textFieldX, mazeX, 3);
	mazeY = GUI.TextField (textFieldY, mazeY, 3);
	if(GUI.Button(botonAceptar,"Aceptar")) {
	
		var x = int.Parse(mazeX);
		var y = int.Parse(mazeY);		
	
		if(x<15 || y<15) {
		
			x = Mathf.Max(x,15);
			y = Mathf.Max(y,15);
			
			mazeX = x.ToString();
			mazeY = y.ToString();
		
			avisoTexto="Dimensiones minimas de 15x15";
			mostrarAviso = true;
			
		} else {
		
			MAZEX = x;
			MAZEY = y;
			//Convertir a impares
			if(MAZEX%2==0) MAZEX++;
			if(MAZEY%2==0) MAZEY++;			
				
			mostrarGUI = false;
			mostrarGUI2 = true;
			
		}
	
	}

}

function ventanaPosicionLlegada(idWindow : int) {

	GUI.Label(labelX,"Fila");
	GUI.Label(labelY,"Columna");
	endX = GUI.TextField (textFieldX, endX, 3);
	endY = GUI.TextField (textFieldY, endY, 3);
	if(GUI.Button(botonAceptar,"Aceptar")) {
	
		var x = int.Parse(endX);
		var y = int.Parse(endY);		
	
		if(x<1 || y<1 || x>MAZEX-2 || y>MAZEY-2) {
		
			x = Mathf.Clamp(x,1,MAZEX-2);
			y = Mathf.Clamp(y,1,MAZEY-2);
			
			endX = x.ToString();
			endY = y.ToString();
		
			avisoTexto="Filas entre (1-"+(MAZEY-2).ToString()+") Columnas entre (1-"+(MAZEX-2).ToString()+")";
			mostrarAviso = true;
			
		} else {
		
			ENDX = x;
			ENDY = y;
			//Convertir a impares
			if(ENDX%2==0) ENDX++;
			if(ENDY%2==0) ENDY++;			
				
			create_maze(MAZEX,MAZEY,ENDX,ENDY);
			
			mostrarGUI2 = false;
			
		}

	}
	
}


function ventanaAviso(idWindow : int) {

	GUI.Label(labelAviso,avisoTexto);
	if(GUI.Button(botonOK,"OK")) mostrarAviso = false;

}