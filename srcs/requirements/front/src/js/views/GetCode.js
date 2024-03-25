import AbstractView from "./AbstractView.js"
import getCookie from "../utils/getCookie.js"

export default class GetCode extends AbstractView {
	constructor() {
		super();
		this.setTitle("getCode");
	}

	async getHtml() {
		let code = new URLSearchParams(window.location.search).get('code');
		const csrftoken = getCookie('csrftoken');
		if (code) {
            try {
				    console.log('get!');
                    const response = await fetch('https://transcendence.kgnj.kr/api/auth42?code=' + code, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch access token');
                }

                const data = await response.json();
            } catch (error) {
                console.error('Error fetching access token:', error);
            }
        } else {
            console.error('No code found in URL');
        }
		return "";
	}	
}