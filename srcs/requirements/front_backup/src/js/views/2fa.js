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
			<div>
				<button id="EMAILFaBtn">EMAIL</button>
				<button id="SMSFaBtn">SMS</button>
				<button id="OTPFaBtn">OTP</button>
			</div>
		`
	}

	async executeScript() {
		const csrftoken = getCookie('csrftoken');
		const access = localStorage.getItem('access');
		const EMAILBtn = document.getElementById('EMAILFaBtn');
		const SMSBtn = document.getElementById('SMSFaBtn');
		const OTPBtn = document.getElementById('OTPFaBtn');
		EMAILBtn.addEventListener("click", async () => {
			console.log("EMAIL button clicked!");
			const data = await this.postData("https://transcendence.kgnj.kr/api/auth2fa", {'X-CSRFToken' : csrftoken}, { 'access' : access, 'email' : "Y"});
			console.log(data);
		});
		SMSBtn.addEventListener("click", async () => {
			console.log("SMS button clicked!");
			const data = await this.postData("https://transcendence.kgnj.kr/api/auth2fa", {'X-CSRFToken' : csrftoken}, {'access' : access, 'SMS' : "Y"});
			console.log(data);
		});
		OTPBtn.addEventListener("click", async () => {
			console.log("OTP button clicked!");
			const data = await this.postData("https://transcendence.kgnj.kr/api/auth2fa", {'X-CSRFToken' : csrftoken}, {'access' : access, 'OTP' : "Y"});
			console.log(data);
		});
	}
}