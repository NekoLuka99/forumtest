document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newPostForm")

  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const title = document.getElementById("postTitle").value.trim()
    const content = document.getElementById("postContent").value.trim()
    const author = user?.name ?? "Anonym" // Nur wenn script.js geladen ist

    if (!title || !content) return alert("Bitte Titel und Inhalt ausfüllen.")

    try {
      const docRef = await db.collection("posts").add({
        title,
        content,
        pinned: false,
        author,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })

      // Optional: Direkt zum neuen Thread springen
      window.location.href = `thread.html?id=${docRef.id}`
    } catch (err) {
      console.error("Fehler beim Speichern:", err)
      alert("Beim Speichern ist etwas schiefgelaufen.")
    }
  })
})
