export async function check_jwt_token() {
	let access_token = localStorage.getItem('access');
	let refresh_token = localStorage.getItem('refresh');
	let url = "https://transcendence.kgnj.kr/api/main"
	if (access_token) {
		url = url + "?access=" + access_token + "&refresh=" + refresh_token
		response = await fetch(url, {
			method : 'GET'
		});
	}
	else {
		url = url + "?access=null&refresh=null"
		const response = await fetch(url, {
			method : 'GET'
		});
	}
}