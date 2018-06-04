#pragma strict

@script RequireComponent(CharacterController) //Requiere componente CharacterController: 2 cosas en uno(rigidbody+collider) asigna propiedades fisicas y comportamiento
@script RequireComponent(Animation) //Tambien requiere componente Animation

//Enlaces a animaciones
public var clipInactivo : AnimationClip;
public var clipCaminar : AnimationClip;
public var clipCorrer : AnimationClip;
public var clipSaltar : AnimationClip;

//Velocidad reproduccion animaciones
public var velocidadClipInactivo : float = 1.0;
public var velocidadClipCaminar : float = 1.0;
public var velocidadClipCorrer : float = 1.0;
public var velocidadClipSaltar : float = 1.15;

//Enlaces a componentes
private var _animation : Animation;
private var controller : CharacterController;

var velocidadCaminar : float = 75.0;
var velocidadCorrer : float = 225.0;
var alturaSalto : float = 0.5;
var tiempoSalto : float = 0.4;
var factorSalto : float = 2.5;

private var direccion : Vector3; //Utilizada para calcular la direccion del personaje
private var velocidad : float; //Utilizada para aplicar una velocidad al personaje
private var saltando : boolean = false; //Para controlar el estado de salto
private var tiempoInicioSalto : float; //Para controlar el tiempo de salto
private var corriendo : boolean = false; //Para controlar el estado de correr

function Awake ()
{
	//Enlazar con componente Animation y CharacterController
	_animation = GetComponent(Animation);
	controller = GetComponent(CharacterController);
	
	
	//Evitar errores de programacion al no establecer clip de animacion
	if(!clipInactivo) { //Si no hemos asignado clipInactivo
	
		_animation = null;
		Debug.Log("No se ha asignado animacion inactivo(idle). Animaciones desactivadas.");
	
	} else {

		_animation[clipInactivo.name].speed = velocidadClipInactivo; //Establecer velocidad de reproduccion de animacion
		_animation[clipInactivo.name].wrapMode = WrapMode.Loop;	//Establecer modo de reproduccion. Loop: Repeticion.
	
	
	}
	if(!clipCaminar) {//Si no hemos asignado clipCaminar
	
		_animation = null;
		Debug.Log("No se ha asignado animacion caminar(walk). Animaciones desactivadas.");
	
	} else {
	
		_animation[clipCaminar.name].speed = velocidadClipCaminar;
		_animation[clipCaminar.name].wrapMode = WrapMode.Loop;
	
	}
	if(!clipCorrer) {
	
		_animation = null;
		Debug.Log("No se ha asignado animacion correr(run). Animaciones desactivadas.");
	
	} else {
	
		_animation[clipCorrer.name].speed = velocidadClipCorrer;
		_animation[clipCorrer.name].wrapMode = WrapMode.Loop;
	
	}
	if(!clipSaltar) {
	
		_animation = null;
		Debug.Log("No se ha asignado animacion saltando(jump). Animaciones desactivadas.");
		
	} else {
	
		_animation[clipSaltar.name].speed = velocidadClipSaltar;
		_animation[clipSaltar.name].wrapMode = WrapMode.ClampForever; //Establecer modo de reproduccion ClampForever: Reproducir una vez
	
	}
			
}

function Update() {
		
		transform.eulerAngles.y += Input.GetAxis("Horizontal");

        //Establecer velocidad actual, segun estemos caminando o corriendo
        if (corriendo) velocidad = velocidadCorrer; else velocidad = velocidadCaminar;
        
        //Actualizar vector direccion
        direccion = transform.forward*velocidad*Input.GetAxis("Vertical");
     
        if (controller.isGrounded) { //Si esta en contacto con el suelo    			
			
			//Si pulsamos tecla mayusculas: correr
			if (Input.GetKey (KeyCode.LeftShift) || Input.GetKey (KeyCode.RightShift)) corriendo = true;
				else corriendo = false;
            
            //Si pulsamos tecla de salto barra espacio, saltar
            if (Input.GetButton("Jump")) {
            
            	tiempoInicioSalto = Time.time;//Guardamos incio de salto, para calcular tiempo de salto
            	saltando = true;
            }            
                        
        }
        
        //Si estan asignadas todos los clip de aimaciones, ir a funcion EstablecerAnimaciones
        if (_animation != null) EstablecerAnimaciones();
        
        
        
        if (saltando) {
        
        	direccion *= Time.deltaTime * factorSalto; //Cuando se mueve en el aire, no existe rozamiento y debemos ajustar la velocidad.  
        	direccion += Vector3.up * alturaSalto * Time.deltaTime / tiempoSalto; //Velocidad calculada en base a alturaSalto y tiempoSalto
        	
        	if (Time.time - tiempoInicioSalto > tiempoSalto) { //Si llevamos en el aire un tiempo superior a tiempoSalto establecido
        	
        		saltando = false;        		
        		controller.SimpleMove(direccion); //La funcion SimpleMove aplica gravedad pero ignora eje-Y
        		
        	} else controller.Move(direccion); //La funcion Move no aplica gravedad, pero si se desplaza verticalmente, eje-Y
        	
        } else controller.SimpleMove(direccion); //La funcion SimpleMove aplica gravedad pero ignora eje-Y
				
}

function EstablecerAnimaciones() {

	if (saltando) _animation.CrossFade(clipSaltar.name); //Si se encuentra saltando aplicar animacion de salto clipSaltar
		else if (corriendo) _animation.CrossFade(clipCorrer.name); //Si se encuentra saltando aplicar animacion clipCorrer
			else if (Vector3.Magnitude(direccion) == 0) _animation.CrossFade(clipInactivo.name); //Si no pulsamos ninguna tecla, clipInactivo	
				else _animation.CrossFade(clipCaminar.name); // Por defecto, aplicar clipCaminar

}
