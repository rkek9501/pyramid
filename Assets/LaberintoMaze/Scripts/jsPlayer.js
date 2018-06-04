#pragma strict

private var numeroSenyalizadores : int = 3;
private var senyalizador : GameObject;

function Start() {

	senyalizador = Resources.Load("senyalizador",GameObject);

}

function Update () {

	if(Input.GetKeyDown(KeyCode.Return)||Input.GetKeyDown(KeyCode.KeypadEnter)) CrearSenyalizador();	

}

function CrearSenyalizador(){

	var senyalizadores : GameObject[] = GameObject.FindGameObjectsWithTag("Finish");
	var obj : GameObject;
	var crear : boolean = true;
	
	if(senyalizadores!=null) {
		
		for(obj in senyalizadores) {
		
			if(Vector3.Distance(transform.position,obj.transform.position)<0.35) {				

				Destroy(obj);
				numeroSenyalizadores++;
				crear = false;				
			
			}
			
		}
	
	}
		
	if(crear && numeroSenyalizadores>0) {
	
		var hit : RaycastHit;
			
		Physics.Linecast(transform.position,transform.position-Vector3.up,hit);
		Instantiate(senyalizador,hit.point,senyalizador.transform.rotation);
		numeroSenyalizadores--;				 
			
	}
	
}

function OnGUI() {

	GUILayout.Label("  "+numeroSenyalizadores.ToString());

}

