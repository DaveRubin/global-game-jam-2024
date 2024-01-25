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

            this.scene.debugLayer.show({
                embedMode: true,
            });

            const startFrame = 0;
            const endFrame = 10;
            const frameRate = 10;

            new BABYLON.Animation("moveCamera", "position.x", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
>>>>>>> 0d7b17c3130f8c2305883dd7fc8d7e9338c67e88
        });
    }

}

var createScene = function (engine, canvas) {
    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 8, BABYLON.Vector3.Zero());
    //camera.attachControl(canvas, true);
    const light = new BABYLON.PointLight("Point", new BABYLON.Vector3(5, 10, 5));
    
    // Load the spritesheet (with appropriate settings) associated with the JSON Atlas.
    let spriteSheet = new BABYLON.Texture("textures/spriteMap/none_trimmed/Legends_Level_A.png", scene,
        false, //NoMipMaps
        false, //InvertY usually false if exported from TexturePacker
        BABYLON.Texture.NEAREST_NEAREST, //Sampling Mode
        null, //Onload, you could spin up the sprite map in a function nested here
        null, //OnError
        null, //CustomBuffer
        false, //DeleteBuffer
        BABYLON.Engine.TEXTURETYPE_RGBA //ImageFormageType RGBA
    );
    

    // Create an assets manager to load the JSON file 
    const assetsManager = new BABYLON.AssetsManager(scene);
    const textTask = assetsManager.addTextFileTask("text task", "textures/spriteMap/none_trimmed/Legends_Level_A.json");
    
    //Create the sprite map on succeful loading
    textTask.onSuccess = (task) => {        
        const atlasJSON = JSON.parse(task.text)
        let backgroundSize = new BABYLON.Vector2(7, 10);
    
        let background = new BABYLON.SpriteMap('background', atlasJSON, spriteSheet,
        {
            stageSize: backgroundSize,
            maxAnimationFrames:8,
            flipU: true,
        },
        scene);  
        background.position = new BABYLON.Vector2(0.1, 0.1);
    
        background.changeTiles(0, new BABYLON.Vector2(0, 0), 24);

        let eighth = 1 / 8
        let speed = 0.005
        background.addAnimationToTile(24, 0, 25, eighth * 1, speed);
        background.addAnimationToTile(24, 1, 26, eighth * 2, speed);
        background.addAnimationToTile(24, 2, 27, eighth * 3, speed);
        background.addAnimationToTile(24, 3, 28, eighth * 4, speed);
        background.addAnimationToTile(24, 4, 29, eighth * 5, speed);
        background.addAnimationToTile(24, 5, 30, eighth * 6, speed);
        background.addAnimationToTile(24, 6, 31, eighth * 7, speed);
        background.addAnimationToTile(24, 7, 24, 1, 	 	 speed);
    };

    //load the assets manager
    assetsManager.load();
       
    return scene;
};
