// 🔧 ID aus URL holen
function getThreadId() {
  const params = new URLSearchParams(window.location.search)
  return params.get("id")
}

// 🧵 Beitrag anzeigen
async function loadThread() {
  const id = getThreadId()
  if (!id) return alert("Keine Thread-ID übergeben.")

  const mainPost = document.getElementById("mainPost")

  try {
    const doc = await db.collection("posts").doc(id).get()
    if (!doc.exists) return mainPost.innerHTML = "<p>Beitrag nicht gefunden.</p>"

    const post = doc.data()
    mainPost.innerHTML = `
      <h2>${post.title}</h2>
      <p>${post.content}</p>
      <small>von <strong>${post.author ?? "Unbekannt"}</strong> am ${new Date(post.createdAt.toDate()).toLocaleDateString()}</small>
    `
  } catch (err) {
    console.error("Fehler beim Laden des Threads:", err)
  }
}

// 💬 Antworten laden
async function loadReplies() {
  const id = getThreadId()
  const repliesContainer = document.getElementById("repliesSection")

  repliesContainer.innerHTML = "<p>Lade Antworten...</p>"

  try {
    const snapshot = await db.collection("posts").doc(id).collection("answers").orderBy("createdAt", "asc").get()

    if (snapshot.empty) {
      repliesContainer.innerHTML = "<p>Keine Antworten vorhanden.</p>"
      return
    }

    repliesContainer.innerHTML = "<h3>Antworten</h3>"

    snapshot.forEach(doc => {
      const reply = doc.data()
      const html = `
        <article class="reply post">
          <p>${reply.text}</p>
          <small>Antwort von <strong>${reply.author ?? "Anonym"}</strong> am ${new Date(reply.createdAt.toDate()).toLocaleDateString()}</small>
        </article>
      `
      repliesContainer.innerHTML += html
    })
  } catch (err) {
    console.error("Fehler beim Laden der Antworten:", err)
  }
}

// 📝 Antwort speichern
async function handleReplySubmit(event) {
  event.preventDefault()
  const text = document.getElementById("replyText").value.trim()
  const id = getThreadId()
  if (!text) return

  await db.collection("posts").doc(id).collection("answers").add({
    text: text,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    author: "Du" // Später dynamisch
  })

  document.getElementById("replyText").value = ""
  loadReplies()
}

// 🚀 Seite laden
document.addEventListener("DOMContentLoaded", () => {
  loadThread()
  loadReplies()
  document.getElementById("replyForm").addEventListener("submit", handleReplySubmit)
})
