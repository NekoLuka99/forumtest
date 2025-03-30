// admin.js

document.addEventListener("DOMContentLoaded", async () => {
  const username = localStorage.getItem("username")

  if (!username) {
    alert("Du musst eingeloggt sein.")
    window.location.href = "index.html"
    return
  }

  try {
    const snapshot = await db.collection("users")
      .where("username", "==", username)
      .where("isAdmin", "==", true)
      .limit(1)
      .get()

    if (snapshot.empty) {
      alert("Kein Zugriff – nur für Admins.")
      window.location.href = "index.html"
      return
    }

    // Zugriff erlaubt
    loadPendingUsers()

    const addUserForm = document.getElementById("addUserForm")
    const addUserMessage = document.getElementById("addUserMessage")

    addUserForm.addEventListener("submit", async (e) => {
      e.preventDefault()
      const username = document.getElementById("newUsername").value.trim()
      const password = document.getElementById("newPassword").value.trim()

      if (!username || !password) return alert("Bitte alle Felder ausfüllen.")

      try {
        await db.collection("users").add({
          username,
          password,
          approved: true,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })

        addUserMessage.innerHTML = "<p style='color:green;'>Benutzer erfolgreich hinzugefügt.</p>"
        addUserForm.reset()
      } catch (err) {
        console.error("Fehler beim Hinzufügen:", err)
        addUserMessage.innerHTML = "<p style='color:red;'>Fehler beim Hinzufügen.</p>"
      }
    })
  } catch (err) {
    console.error("Fehler beim Admin-Check:", err)
    alert("Fehler beim Admin-Zugriff.")
    window.location.href = "index.html"
  }
})

async function loadPendingUsers() {
  const list = document.getElementById("pendingList")
  list.innerHTML = ""

  try {
    const snapshot = await db.collection("pendingUsers").orderBy("createdAt", "asc").get()

    if (snapshot.empty) {
      list.innerHTML = "<p>Keine ausstehenden Anfragen.</p>"
      return
    }

    snapshot.forEach(doc => {
      const data = doc.data()
      const container = document.createElement("div")
      container.className = "pending-user"
      container.innerHTML = `
        <p><strong>${data.username}</strong></p>
        <button data-id="${doc.id}" data-username="${data.username}" data-password="${data.password}">Freischalten</button>
        <button data-id="${doc.id}" class="delete-btn">Löschen</button>
        <hr />
      `
      list.appendChild(container)
    })

    list.querySelectorAll("button[data-id]").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = btn.getAttribute("data-id")

        if (btn.classList.contains("delete-btn")) {
          await db.collection("pendingUsers").doc(id).delete()
          loadPendingUsers()
        } else {
          const username = btn.getAttribute("data-username")
          const password = btn.getAttribute("data-password")

          await db.collection("users").add({
            username,
            password,
            approved: true,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          })

          await db.collection("pendingUsers").doc(id).delete()
          loadPendingUsers()
        }
      })
    })
  } catch (err) {
    console.error("Fehler beim Laden der Anfragen:", err)
    list.innerHTML = "<p style='color:red;'>Fehler beim Laden.</p>"
  }
}
