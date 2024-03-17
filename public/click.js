const socket = io();

// Retrieve the username from localStorage
const username = localStorage.getItem("username");

socket.on("connect", function () {
  // Emit 'setname' event with the stored username
  if (username) {
    socket.emit("setname", { name: username });
  }
});

const clickButton = document.getElementById("clickButton");
const backButton = document.getElementById("backButton"); // Reference to the "Go Back" button
const lejaButton = document.getElementById("lejaButton");

clickButton.addEventListener("click", function () {
  socket.emit("click");
});

lejaButton.addEventListener("click", function () {
  socket.emit("lejaEvent");
});

backButton.addEventListener("click", function () {
  window.location.href = "/setname.html";
});

if (username === "Leja69") {
  lejaButton.style.display = "inline";
}
