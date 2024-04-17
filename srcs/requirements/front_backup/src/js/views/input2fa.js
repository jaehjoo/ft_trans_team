import AbstractView from "./AbstractView.js"
import getCookie from "../utils/getCookie.js"

export default class input2fa extends AbstractView {
	constructor() {
		super();
		this.setTitle("TwoFactor");
	}

	async getHtml() {
		return `
			<h1>Please input 2fa code</h1>
			<div>
				<h4>코드 기입란입니다</h4>
				<h4>OTP 사용 희망자는 google authenticator에 qr 코드 내용물로 등록해주세요</h4>
				<img src=https://transcendence.kgnj.kr/media/qr.jpg>
				<input type="text" placeholder="코드를 입력해주세요" id="code2fa">
				<input type="button" value="보내기" id="input2faBtn">
			</div>
		`
	}

	async executeScript() {
		const access = localStorage.getItem('access');
		const input2faBtn = document.getElementById('input2faBtn');
		input2faBtn.addEventListener("click", async () => {
			console.log("2fa code send button clicked!");
			const csrftoken = getCookie('csrftoken')
			const code = document.getElementById('code2fa').value;
			console.log(access);
			const data = await this.postData("https://transcendence.kgnj.kr/api/input2fa", { 'X-CSRFToken' : csrftoken },  { 'access' : access, 'code' : code});
			console.log(data);
		});
	}
}