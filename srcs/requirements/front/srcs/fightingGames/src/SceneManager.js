export class SceneManager {
	constructor() {
		this.scenes = {};
		this.currentScene = null;
		this.FINAL = true;
	}

	addScene(name, scene) {
		this.scenes[name] = scene;
	}

	setCurrentScene(name) {
		if (this.scenes[name]) {
			this.currentScene = this.scenes[name]
		}
	}

	checkScene(time) {
		if (this.currentScene.FINAL) {
			this.FINAL = true;
			window.addEventListener("click", function() {
				window.location.href = "/login";
			}, {once : true})
			return ;
		}
		if (this.currentScene.START == true
			&& this.currentScene.STOP == false) {
			this.currentScene.load(time)
		}
		if (this.currentScene.STOP == true) {
			this.currentScene.unload();
			this.setCurrentScene(this.currentScene.next);
			this.currentScene.initInfo();
		}
	}
}