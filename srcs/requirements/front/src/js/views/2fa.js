import AbstractView from "./AbstractView.js"
import getCookie from "../utils/getCookie.js"

export default class TwoFactor extends AbstractView {
	constructor() {
		super();
		this.setTitle("TwoFactor");
	}

	async getHtml() {
		return `
			<h1>Please select 2fa</h1>
			<p>
				<button id="EmailFaBtn">Email</button>
				<button id="SMSFaBtn">SMS</button>
				<button id="APPFaBtn">AuthAPP</button>
			</p>
		`
	}

	async executeScript() {
		const access = localStorage.getItem('access');
		const csrftoken = getCookie('csrftoken');
		const EmailBtn = document.getElementById("EamilFaBtn");
		const SMSBtn = document.getElementById('SMSFaBtn');
		const APPBtn = document.getElementById('AppFaBtn');
		EmailBtn.addEventListener("click", async () => {
			console.log("Eamil button clicked!");
			const data = await this.getData("https://transcendence.kgnj.kr/api/authEmail", {'X-CSRFToken' : csrftoken, 'access' : access});
		});
		SMSBtn.addEventListener("click", async () => {
			console.log("Eamil button clicked!");
			const data = await this.getData("https://transcendence.kgnj.kr/api/authSMS", {'X-CSRFToken' : csrftoken, 'access' : access});
		});
		APPBtn.addEventListener("click", async () => {
			console.log("Eamil button clicked!");
			const data = await this.getData("https://transcendence.kgnj.kr/api/authAPP", {'X-CSRFToken' : csrftoken, 'access' : access});
		});
	}
}