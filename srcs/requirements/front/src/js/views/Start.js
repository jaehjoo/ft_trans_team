import AbstractView from "./AbstractView.js"
import { check_jwt_token } from "../utils/check.js"

export default class Start extends AbstractView {
	constructor() {
		super();
		this.setTitle("Start");
	}

	async getHtml() {
		check_jwt_token();
		return `
			<h1>Welcome back, Dom</h1>
			<p>
				lala
			</p>
			<p>
				<a href="/posts" data-link>View recent</a>
			</p>
		`;
	}
}