const socket = io();

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const messageTone = new Audio('/message-tone.mp3');

// Use qs-cdn to get chat-member's username and room from URL
const { username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

/*
// Assuming you have the Qs library imported correctly

// Extract the query string from the URL (if available)
const queryString = location.search;

// Check if the query string exists to avoid errors
if (queryString) {
  try {
    // Parse the query string using Qs, ignoring the query prefix
    const parsedQs = Qs.parse(queryString, { ignoreQueryPrefix: true });

    // Extract username and room from the parsed object
    const username = parsedQs.username;
    const room = parsedQs.room;

    // Handle extracted values (e.g., display them, use them in your application)
    console.log("Username:", username);
    console.log("Room:", room);

    // You can now use these values in your application logic
  } catch (error) {
    console.error("Error parsing query string:", error);
    // Handle parsing errors gracefully (e.g., provide a default value or informative message)
  }
} else {
  console.log("No query string found in the URL.");
  // Handle the case where there's no query string (e.g., provide default values)
}

*/
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

  messageTone.play();
};
