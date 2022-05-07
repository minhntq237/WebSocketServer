const WebSocket = require('ws');
const webSocketServer = new WebSocket.Server({ port:8500 });

let phoneClient = []
let desktopClient = []

webSocketServer.on('connection', (webSocketConnection) => {
    console.log("websocket server is running")

	webSocketConnection.on('message', async (data) => {
		let parsedData = JSON.parse(data)

		let message = parsedData.message
		let content = parsedData.content

		console.log('received: %s', message);

		if (message == "hello, this is phone client") {
			phoneClient.push(webSocketConnection)
            sendMessageAndContentToAllClients(phoneClient, "nice to meet you, phone client", "")
		}

        if (message == "hello, this is desktop client") {
			desktopClient.push(webSocketConnection)
			sendMessageAndContentToAllClients(desktopClient, "nice to meet you, desktop client", "")
		}

		if (message == "Orientation Data") {
			console.log("Alpha", content[3])
			console.log("Beta", content[4])
			console.log("Gamma", content[5])
			sendMessageAndContentToAllClients(desktopClient, "Orientation Data", {alpha: content[3], beta: content[4], gamma: content[5]})
		}
    
    });

	webSocketConnection.on('close', () => {
		removeElementFromArray(webSocketConnection, imageSubscribingClients)
		removeElementFromArray(webSocketConnection, capturedImageSubscribingClients)
	});

});


function sendMessageAndContentToAllClients(listOfClients, thisMessage, thisContent) {
	console.log("SERVER SENDING MESSAGE TO WINDOWS")
	listOfClients.forEach((client) => {
		client.send(JSON.stringify({message: thisMessage, content: thisContent}));
	})
}