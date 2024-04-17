import AbstractView from "./AbstractView.js"

export default class Chat extends AbstractView {
	constructor() {
		super();
		this.setTitle("Chat");
	}

	async getHtml() {
		return `
			<h2>What chat room would you like to enter?<h2>
			<div>
				<input id="room-name-input" type="text" size="100"><br>
				<input id="room-name-submit" type="button" value="Enter">
			</div>
		`;
	}

	async executeScript() {
		document.querySelector('#room-name-input').focus();
        document.querySelector('#room-name-input').onkeyup = function(e) {
            if (e.keyCode === 13) {
                document.querySelector('#room-name-submit').click();
            }
        };

        document.querySelector('#room-name-submit').onclick = function(e) {
            var roomName = document.querySelector('#room-name-input').value;
            window.location.pathname = '/chat/' + roomName + '/';
		};
	}
}