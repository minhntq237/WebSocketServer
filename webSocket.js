const WebSocket = require('ws');
const webSocketServer = new WebSocket.Server({ port:8500 });

let phoneClient = new Map()
let desktopClient = new Map()


function generateUniqueID() {
	const today = new Date();
	const uniqueID = today.getHours().toString() + today.getMinutes().toString() + today.getSeconds().toString();
	return uniqueID 
}


webSocketServer.on('connection', (webSocketConnection) => {
    console.log("websocket server is running")

	webSocketConnection.on('message', async (data) => {
		let parsedData = JSON.parse(data)

		let message = parsedData.message
		let content = parsedData.content

		console.log('received: %s', message);

		if (message == "hello, this is phone client") {
			let phoneUniqueID = generateUniqueID()
			phoneClient.set(phoneUniqueID, webSocketConnection)
            sendMessageAndContentToAllClients(phoneClient, "nice to meet you, phone client", "")
		}

        if (message == "hello, this is desktop client") {
			let desktopUniqueID = generateUniqueID()
			desktopClient.set(desktopUniqueID, webSocketConnection);
			sendMessageAndContentToAllClients(desktopClient, "nice to meet you, desktop client", "")
			sendMessageAndContentToAllClients(desktopClient, "unique ID, desktop client", desktopUniqueID)
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
	listOfClients.forEach((websocketConnectionValue, key) => {
		websocketConnectionValue.send(JSON.stringify({message: thisMessage, content: thisContent}));
	})
}

function sendMessageAndContentToClient(client, thisMessage, thisContent) {
	console.log("SERVER SENDING MESSAGE TO WINDOWS")
	client.send(JSON.stringify({message: thisMessage, content: thisContent}));
}

