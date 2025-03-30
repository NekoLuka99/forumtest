document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm")
  const messageBox = document.getElementById("registerMessage")

  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const username = document.getElementById("regName").value.trim()
    const password = document.getElementById("regPassword").value.trim()

    if (!username || !password) return alert("Bitte Benutzername und Passwort angeben.")

    try {
      await db.collection("pendingUsers").add({
        username: username,
        password: password, // 🔐 Achtung: aktuell im Klartext
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })

      messageBox.innerHTML = `<p style="color:green;">Registrierung gesendet. Du wirst freigeschaltet, sobald ein Admin dich bestätigt hat.</p>`
      form.reset()
    } catch (err) {
      console.error("Fehler bei Registrierung:", err)
      messageBox.innerHTML = `<p style="color:red;">Fehler beim Senden der Registrierung.</p>`
    }
  })
})

