const socket = io();

// Get the name input element
const nameInput = document.getElementById("nameInput");

// Get the set name button
const setNameButton = document.getElementById("setnameButton");

// Get the click button
const clickButton = document.getElementById("clickButton");

// Get the queue list element
const queueList = document.getElementById("queueList");

setNameButton.addEventListener("click", function () {
  // Get the name entered by the user
  const name = nameInput.value.trim();

  // Check if name is not empty
  if (name !== "") {
    // Send the name to the server
    socket.emit("setname", { name: name });
  } else {
    alert("Please enter your name");
  }
});

// Event listener for click button
clickButton.addEventListener("click", function () {
  // Send the click event to the server
  socket.emit("click");
});

// Function to remove a user from the queue
function removeFromQueue(user) {
  socket.emit("removeFromQueue", user);
}

socket.on("updateQueue", function (queue) {
  // Update the queue list with the new queue
  queueList.innerHTML = "";
  queue.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = user;

    // Add a button to remove the user from the queue
    const button = document.createElement("button");
    button.textContent = "Remove";
    button.addEventListener("click", () => removeFromQueue(user));
    li.appendChild(button);

    queueList.appendChild(li);
  });
});
