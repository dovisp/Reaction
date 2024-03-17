const socket = io();

const nameInput = document.getElementById("nameInput");
const setNameButton = document.getElementById("setNameButton");

setNameButton.addEventListener("click", function () {
  const name = nameInput.value.trim();
  if (name !== "") {
    console.log("Sending username to server:", name); // Add this line for logging
    localStorage.setItem("username", name); // Store the username in localStorage
    socket.emit("setname", { name: name }); // Emit 'setname' event with the name
    window.location.href = "/click.html"; // Redirect to click.html after setting the name
  } else {
    alert("Įrašyk vardą :)");
  }
});
socket.on("connect", function () {
  console.log("Connected to server");
});
