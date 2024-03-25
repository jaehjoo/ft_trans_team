import AbstractView from "./AbstractView.js"

export default class Settings extends AbstractView {
	constructor() {
		super();
		this.setTitle("Settings");
	}

	async getHtml() {
		return `
			<h1>Settings</h1>
			<p>Manage your privacy and configuration.</p>
			<a href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-d69879cc4fdcaed4bfcb7657ffe1835e3018b3d6a40bb05950d8abc18f0b2735&redirect_uri=https%3A%2F%2Ftranscendence.kgnj.kr%2Fshallwe&response_type=code">42Auth</button>
		`;
	}
}

// export default class Settings extends AbstractView {
// 	constructor() {
// 		super();
// 		this.setTitle("Settings");
// 	}

// 	async getHtml() {
// 		return `
// 			<h1>Settings</h1>
// 			<p>Manage your privacy and configuration.</p>
// 			<button id="auth42Btn">42Auth</button>
// 		`;
// 	}

// 	async executeScript() {
// 		const csrftoken = getCookie('csrftoken');
// 		const auth42Btn = document.getElementById("auth42Btn");
// 		auth42Btn.addEventListener("click", async () => {
// 			console.log("42Auth button clicked!");
// 			try {
// 				const response = await fetch('https://transcendence.kgnj.kr/api/auth42', {
// 					headers: {
// 						'X-CSRFToken' : csrftoken,
// 						'order' : 'yes'
// 					}
// 				});
// 				if (!response.ok) {
// 					throw new Error('Network response was not ok');
// 				}
// 				const data = await response.json();
// 				console.log(data);
// 			} catch (error) {
// 				console.error('Error:', error);
// 			}
// 		});
// 	}
// }