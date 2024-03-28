import Start from "./views/Start.js";
import Posts from "./views/Posts.js";
import Settings from "./views/Login.js";
import GetCode from "./views/GetCode.js";
import TwoFactor from "./views/2fa.js";
import input2fa from "./views/input2fa.js"

const navigateTo = url => {
	history.pushState(null, null, url);
	router();
};

const router = async () => {
	const routes = [
		{ path: "/", view: Start },
		{ path: "/posts", view: Posts },
		{ path: "/settings", view: Settings },
		{ path: "/shallwe", view: GetCode },
		{ path: "/twofactor", view: TwoFactor},
		{ path: "/input2fa", view : input2fa }
	];
	
	const potentialMatches = routes.map(route => {
		return {
			route: route,
			isMatch: location.pathname === route.path,
		};
	});

	let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);

	if (!match) {
		match = {
			route: routes[0],
			isMatch: true
		};
	}

	const view = new match.route.view();

	document.querySelector("#app").innerHTML = await view.getHtml();

    if (match.route.path === "/twofactor" || match.route.path === "/input2fa") {
        await view.executeScript();
    }
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
	document.body.addEventListener("click", e => {
		if (e.target.matches("[data-link]")) {
			e.preventDefault();
			navigateTo(e.target.href);
		}
	});

	router();
});