﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Player : MonoBehaviour {
    //GameObject boor;
	// Use this for initialization
	void Start () {

	}
	
	// Update is called once per frame
	void Update () {
		
	}
    private void OnCollisionEnter(Collision collision)
    {
        if (collision.gameObject.tag == "DOOR")
        {
            Debug.Log("충돌");
        }
    }
    private void OnTriggerEnter(Collider other)
    {
        if (other.gameObject.tag == "DOOR")
        {
            Debug.Log("충돌");
        }
    }
}
