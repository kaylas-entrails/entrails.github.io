const WORKER_URL = "https://meowbot.kayladianegarcia123.workers.dev"; 

let conversationHistory = []; // "memory"

async function sendMessage() {
  const input = document.getElementById("chat-input");
  const message = input.value.trim();
  if (!message) return;

  // Show user's message immediately
  addMessageToChat("user", message);
  input.value = "";

  // Add to history
  conversationHistory.push({ role: "user", content: message });

  // Show a loading indicator
  addMessageToChat("bot", "...");

  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversationHistory }),
    });

    const data = await response.json();

    // Remove the "..." loading message
    removeLastMessage();

    if (data.error) {
      addMessageToChat("bot", "uh oh, something broke 💀");
      console.error(data.error, data.details);
      return;
    }

    addMessageToChat("bot", data.reply);
    conversationHistory.push({ role: "assistant", content: data.reply });

  } catch (err) {
    removeLastMessage();
    addMessageToChat("bot", "network's being weird rn, try again");
    console.error(err);
  }
}

function addMessageToChat(sender, text) {
  const chatBox = document.getElementById("chat-messages");
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${sender}`;
  
  const label = sender === "user" ? "user:" : "meowbot:";
  msgDiv.textContent = `> ${label} ${text}`;
  
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeLastMessage() {
  const chatBox = document.getElementById("chat-messages");
  chatBox.removeChild(chatBox.lastChild);
}

// Send on Enter key
document.getElementById("chat-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
