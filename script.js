// 🔐 Benutzerobjekt für Login/Logout
const user = {
  name: localStorage.getItem("username") ?? null
}


// 🔄 Beiträge aus Firestore laden und anzeigen
async function loadPosts() {
  const pinnedContainer = document.getElementById("pinnedPosts")
  const postListContainer = document.getElementById("postList")

  pinnedContainer.innerHTML = ""
  postListContainer.innerHTML = ""

  try {
    const snapshot = await db.collection("posts").orderBy("createdAt", "desc").get()

    snapshot.forEach(doc => {
      const post = doc.data()
      const html = `
        <article class="post ${post.pinned ? 'pinned' : ''}">
          <h3>${post.pinned ? '📌 ' : ''}${post.title}</h3>
          <p>${post.content}</p>
          <a href="thread.html?id=${doc.id}">Zum Beitrag</a>
        </article>
      `
      if (post.pinned) {
        pinnedContainer.innerHTML += html
      } else {
        postListContainer.innerHTML += html
      }
    })
  } catch (error) {
    console.error("Fehler beim Laden der Beiträge:", error)
  }
}

// 👤 Login/Logout UI anzeigen
function updateUI() {
  const nav = document.querySelector("nav")
  const existing = document.getElementById("userInfo")
  if (existing) existing.remove()

  const userBox = document.createElement("div")
  userBox.id = "userInfo"
  userBox.style.marginLeft = "1rem"


  if (user.name) {
    userBox.innerHTML = `
      Angemeldet als <strong>${user.name}</strong>
      <button onclick="logout()">Logout</button>
    `
    checkAdminStatus()
  } else {
    userBox.innerHTML = `
  <input id="loginName" placeholder="Benutzername" />
  <input id="loginPassword" type="password" placeholder="Passwort" style="margin-left: 0.5rem;" />
  <button onclick="handleLogin()">Login</button>
  <a href="register.html" style="margin-left: 1rem;">Registrieren</a>
`


  }

  nav.appendChild(userBox)
}

// 🔐 Login und Logout
function login(username) {
  user.name = username
  localStorage.setItem("username", username)
  updateUI()
}

function logout() {
  user.name = null
  localStorage.removeItem("username")
  updateUI()
}

async function handleLogin() {
  const inputName = document.getElementById("loginName")
  const inputPassword = document.getElementById("loginPassword")

  if (!inputName || !inputPassword) return
  const username = inputName.value.trim()
  const password = inputPassword.value.trim()

  if (!username || !password) return alert("Bitte Benutzername und Passwort eingeben.")

  try {
    const snapshot = await db.collection("users")
      .where("username", "==", username)
      .limit(1)
      .get()

    if (snapshot.empty) {
      return alert("Benutzer nicht gefunden oder noch nicht freigeschaltet.")
    }

    const userDoc = snapshot.docs[0].data()

    if (userDoc.password !== password) {
      return alert("Falsches Passwort.")
    }

    user.name = username
    localStorage.setItem("username", username)
    updateUI()

  } catch (err) {
    console.error("Fehler beim Login:", err)
    alert("Login fehlgeschlagen.")
  }
}


// ✅ Beim Laden der Seite starten
document.addEventListener("DOMContentLoaded", () => {
  loadPosts()
  updateUI()
})

async function checkAdminStatus() {
  const username = user.name
  if (!username) return

  try {
    const snapshot = await db.collection("users")
      .where("username", "==", username)
      .where("isAdmin", "==", true)
      .limit(1)
      .get()

    if (!snapshot.empty) {
      const nav = document.querySelector("nav")
      const adminLink = document.createElement("a")
      adminLink.href = "admin.html"
      adminLink.textContent = "⚙️ Admin Panel"
      adminLink.style.marginLeft = "1rem"
      nav.appendChild(adminLink)
    }
  } catch (err) {
    console.error("Admin-Check fehlgeschlagen:", err)
  }
}
