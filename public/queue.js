const socket = io();

const queueList = document.getElementById("queueList");
const resetButton = document.getElementById("resetButton");
const nextButton = document.getElementById("nextButton");

let wasQueueEmpty = true;

resetButton.addEventListener("click", function () {
  socket.emit("resetQueue");
});

nextButton.addEventListener("click", function () {
  socket.emit("removeFromQueue");
});

socket.on("lejaPlay", function () {
  playSound();
});

socket.on("updateQueue", function (queue) {
  if (wasQueueEmpty && queue.length > 0) {
    playSound();
  }
  wasQueueEmpty = queue.length === 0;
  queueList.innerHTML = "";
  queue.forEach((user, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${user}`;
    queueList.appendChild(li);
  });
});

function playSound() {
  const firstSound = new Audio("/img/clickt.mp3");
  firstSound.play();
}
