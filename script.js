// script.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("replyForm")
  const replyText = document.getElementById("replyText")
  const repliesSection = document.querySelector(".replies")

  form.addEventListener("submit", (e) => {
    e.preventDefault()

    const text = replyText.value.trim()
    if (text === "") return

    // Neue Antwort erzeugen
    const newReply = document.createElement("article")
    newReply.className = "reply post"
    newReply.innerHTML = `
      <p>${text}</p>
      <small>Antwort von <strong>Du</strong> am ${new Date().toLocaleDateString()}</small>
    `

    repliesSection.appendChild(newReply)
    replyText.value = ""
  })
})
