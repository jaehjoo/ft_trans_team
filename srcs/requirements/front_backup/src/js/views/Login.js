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
			<a href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-3f97e5a7884daa587a8fbdcab6bbc5e1c4ff366e0858e0e46097ed9abd24fef7&redirect_uri=https%3A%2F%2Ftranscendence.kgnj.kr%2Fshallwe&response_type=code">42Auth</button>
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