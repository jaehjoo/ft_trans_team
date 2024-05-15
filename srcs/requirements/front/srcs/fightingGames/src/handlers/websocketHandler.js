export function websocketTerminate(ws) {
	ws.onmessage = (msg) => {
		let textData = JSON.parse(msg.data);

		if (textData.data.mode == "normal.terminate"
			|| textData.data.mode == "abnormal.terminate")
			ws.close(1000, "Session End");
	}
	ws.onclose = () => {
		ws.close(1000, "Session End");
		window.location.href = "/main";
	}
}
