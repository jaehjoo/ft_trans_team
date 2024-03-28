import AbstractView from "./AbstractView.js"

export default class GetCode extends AbstractView {
	constructor() {
		super();
		this.setTitle("getCode");
	}

	async getHtml() {
		let code = new URLSearchParams(window.location.search).get('code');
		if (code) {
            try {
                    let url = "https://" + "transcendence.kgnj.kr" + "/api/auth42?code=" + code;
                    const response = await fetch(url);

                if (!response.ok) {
                    throw new Error('Failed to fetch access token');
                }

                const data = await response.json();
                if (data.success == "Y") {
                    const str = "csrftoken=" + data.content.csrftoken
                    document.cookie = str
                    localStorage.setItem('access', data.content.access)
                    localStorage.setItem('refresh', data.content.refresh)
                }
            } catch (error) {
                console.error('Error fetching access token:', error);
            }
        } else {
            console.error('No code found in URL');
        }
		return "";
	}	
}