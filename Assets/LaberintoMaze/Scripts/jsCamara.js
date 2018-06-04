#pragma strict

var altura : float = 0.2;
var distancia : float = 1;

private var posCamara : Vector3;
private var hit : RaycastHit;


function Update () {

	posCamara = transform.position;
	posCamara.y += altura;
	
	if(Physics.Linecast(posCamara,posCamara-transform.forward*distancia,hit)) {
	
		posCamara = Vector3.Lerp(posCamara,hit.point,0.9);
	
	} else posCamara = Vector3.Lerp(posCamara,posCamara-transform.forward*distancia,0.9);
	
	Camera.main.transform.position = posCamara;
	Camera.main.transform.LookAt(transform.position);	

}