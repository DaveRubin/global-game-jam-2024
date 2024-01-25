import * as BABYLON from 'babylonjs'
import {instance} from './audioCheck.js'
import {game_status} from './gameState.js'

export class AppScene {
    engine;
    scene;

    constructor(canvas) {
        this.engine = new BABYLON.Engine(canvas)
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
        this.scene = createScene(this.engine, this.canvas)
    }

    debug(debugOn = true) {
        if (debugOn) {
            this.scene.debugLayer.show({ overlay: true, embedMode: true });
        } else {
            this.scene.debugLayer.hide();
        }
    }

    run() {
        this.debug(false);
        this.engine.runRenderLoop(() => {
            this.scene.render();
			//console.log(instance.pitch);
			game_status.movement = null;
			
			if(instance.pitch >= 100 && instance.pitch <= 200){
	            console.log("down");
				game_status.movement = "down";
			}
			if(instance.pitch >= 201 && instance.pitch <= 300){
	            console.log("left");
				game_status.movement = "left";
			}
			if(instance.pitch >= 301 && instance.pitch <= 400){
	            console.log("right");
				game_status.movement = "right";
			}
			if(instance.pitch >= 401 && instance.pitch <= 500){
	            console.log("up");
				game_status.movement = "up";
			}
			
			console.log(game_status.movement);
        });
    }

}


var createScene = function (engine, canvas) {
    // this is the default code from the playground:

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'sphere' shape.
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;

    // Our built-in 'ground' shape.
    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);

    return scene;
};