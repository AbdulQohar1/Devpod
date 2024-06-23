const socket = io();

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

// Use qs-cdn to get chat-member's username and room from URL
const { username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

console.log(username , room);
// A user join chat room 
socket.emit('joinRoom' , {username, room})

// Listen for messages from the server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  // scroll down
  scrollToBottom();
});

function scrollToBottom() {
  chatMessages.scrollTo(0, chatMessages.scrollHeight);
};

// Submit message event listener
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get chat message
  const msg = e.target.elements.msg.value;
  console.log(msg);

  // Emit input message to server
  socket.emit('chatMessage', msg);

  // Clear the input after sending the message
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Function to append message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `
    <p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">${message.text}</p>
  `;
  document.querySelector('.chat-messages').appendChild(div);
}



/*
const socket = io();

const chatForm = document.getElementById('chat-form');

socket.on('message' , message => {
  console.log(message);
  outputMessage(message);
});

// Submit message
chatForm.addEventListener('submit' , (e) => {
  e.preventDefault();

  // get chat message 
  const msg = e.target.elements.msg.value;
  console.log(msg);

  // Emit input message to server
  socket.emit('chatMessage ' , msg);
});

// send message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `
    <p class="meta">Brad <span> 9:12pm </span></p>
    <p class="text"> ${message}</p>  
  `;

  document.querySelector('.chat-messages').appendChild(div);
}
*/


