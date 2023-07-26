const socket = io(`http://localhost:5000`);

const form = document.querySelector("#send-container");
const msgInput = document.querySelector("#msg-input");
const msgContainer = document.querySelector(".container");

let audio = new Audio("./assets/ting.mp3");

msgInput.addEventListener("input", () => {
  msgInput.style.height = "auto";
  msgInput.style.height = `${msgInput.scrollHeight}px`;
});

// adding auto scrolling in the chat message container
const observer = new MutationObserver(() => {
  msgContainer.scrollTop = msgContainer.scrollHeight;
});

observer.observe(msgContainer, { childList: true });

const name = prompt("enter your name to join");
socket.emit("new-user-joined", name);

const addMesasge = (message, position) => {
  const newUser = document.createElement("pre");
  newUser.classList.add("message");
  newUser.classList.add(position);
  newUser.textContent = message;
  msgContainer.append(newUser);
  if (position === "left") {
    newUser.style.backgroundColor = "yellow";
    audio.play();
  }
};

socket.on("user-joined", (name) => {
  addMesasge(`${name} joined the chat`, "left");
});

socket.on("recieve", (data) => {
  addMesasge(data.message, "left");
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = msgInput.value;
  if (message.length !== 0) {
    socket.emit("send", message);
    addMesasge(message, "right");
  }
  form.reset();
});

socket.on("left", (name) => {
  addMesasge(`${name} left`, "left");
});
