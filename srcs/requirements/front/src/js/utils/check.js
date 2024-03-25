export function check_jwt_token() {
	let access_token = localStorage.getItem('access');
	let refresh_token = localStorage.getItem('refresh');
	let data;
	if (access_token) {
		data = this.getData("https://transcendence.kgnj.kr/api/index", {"access" : access_token, "refresh" : refresh_token});
	}
	else {
		data = this.getData("https://transcendence.kgnj.kr/api/index", {});
	}
	return data;
}