export default class AbstractView {
	constructor() {
	}

	setTitle(title) {
		document.title = title;
	}

	async postData(url = "", header = {}, data = {}) {
		const response = await fetch(url, {
			method: "POST",
			mode: "cors",
			cache: "no-cache",
			credentials: "same-origin",
			headers: header,
			redirect: "follow", // manual, *follow, error
			referrerPolicy: "same-origin", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
			body: JSON.stringify(data), // body의 데이터 유형은 반드시 "Content-Type" 헤더와 일치해야 함
		});
		return response.json(); // JSON 응답을 네이티브 JavaScript 객체로 파싱
	}

	async getData(url = "", value = {}) {
		try {
			const response = await fetch(url, value);
			if (response.ok) {
				return response.json();
			}
		} catch (error) {
			return null
		}
		return null
	}

	async getHtml() {
		return "";
	}
}