// const socket = io('http://localhost:8000', { transports: ["websocket"] });
const socket = io();

const messageInput = document.getElementById('messageInput');
const messageContainer = document.querySelector(".chatBox");

var name;
do {
    name = prompt("Enter your name to join");
} while (!name)

function sendMessageTrigger() {

    const msg = messageInput.value;
    messageInput.value = "";

    if(msg.length != 0){
        let data = {
            user: name,
            message: msg
        }
        appendMessage(data, 'right');
        scrollToBottom();
        socket.emit('send', data);
    }
}

const appendMessage = (data, position) => {

    const messageElement = document.createElement('div');
    messageElement.classList.add('messageBox',position);

    let markup = `
        <h3>${data.user}</h3>
        <p>${data.message}</p>
    `
    messageElement.innerHTML = markup;
    messageContainer.append(messageElement);
}

const appendMessageLeaveJoin = (data) =>{
    const messageElement = document.createElement('div');
    messageElement.innerText = data;
    messageElement.classList.add('messageBox','center');
    messageContainer.append(messageElement);
}


socket.emit("new-user-joined", name);


//RECEIVING
socket.on('connectMe',name => {
    appendMessageLeaveJoin(`You joined the chat.`);
    scrollToBottom();

})
socket.on('user-joined', name => {
    appendMessageLeaveJoin(`${name} joined the chat.`);
    scrollToBottom();

})

socket.on('receive', data => {
    appendMessage(data, 'left');
    scrollToBottom();
})

socket.on('left', name => {
    appendMessageLeaveJoin(`${name} left the chat.`);
    scrollToBottom();
})

//chats remains at bottom
function scrollToBottom(){
    messageContainer.scrollTop = messageContainer.scrollHeight;
}



