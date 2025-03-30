// Forum-Startdaten (Platzhalter – später durch Datenbank ersetzt)
const user = {
  name: null, // Wird gesetzt, wenn eingeloggt
}

const posts = [
  {
    id: 1,
    title: "Forum-Regeln",
    content: "Bitte vor dem Posten lesen. Kein Spam, höflich bleiben!",
    pinned: true,
  },
  {
    id: 2,
    title: "Ankündigung: Neue Funktionen",
    content: "Wir haben einige neue Features ins Forum eingebaut.",
    pinned: true,
  },
  {
    id: 3,
    title: "Dark Mode Vorschlag",
    content: "Könnte man einen Dunkelmodus hinzufügen?",
    pinned: false,
  },
]

// 💬 Beiträge anzeigen
function renderPosts() {
  const pinned = document.getElementById("pinnedPosts")
  const list = document.getElementById("postList")

  pinned.innerHTML = ""
  list.innerHTML = ""

  posts.forEach(post => {
    const html = `
      <article class="post ${post.pinned ? 'pinned' : ''}">
        <h3>${post.pinned ? '📌 ' : ''}${post.title}</h3>
        <p>${post.content}</p>
        <a href="thread.html?id=${post.id}">Zum Beitrag</a>
      </article>
    `
    if (post.pinned) {
      pinned.innerHTML += html
    } else {
      list.innerHTML += html
    }
  })
}

// 🔐 Simulierter Login
function login(username) {
  user.name = username
  updateUI()
}

// 🔓 Simulierter Logout
function logout() {
  user.name = null
  updateUI()
}

// 👤 Login/Logout anzeigen
function updateUI() {
  const nav = document.querySelector("nav")
  const existingLogin = document.getElementById("userInfo")

  if (existingLogin) existingLogin.remove()

  const userBox = document.createElement("div")
  userBox.id = "userInfo"
  userBox.style.marginLeft = "1rem"

  if (user.name) {
    userBox.innerHTML = `
      Angemeldet als <strong>${user.name}</strong>
      <button onclick="logout()">Logout</button>
    `
  } else {
    userBox.innerHTML = `
      <input id="loginName" placeholder="Benutzername" />
      <button onclick="handleLogin()">Login</button>
    `
  }

  nav.appendChild(userBox)
}

function handleLogin() {
  const input = document.getElementById("loginName")
  if (input && input.value.trim() !== "") {
    login(input.value.trim())
  }
}

// 🔁 Initial ausführen
document.addEventListener("DOMContentLoaded", () => {
  renderPosts()
  updateUI()
})

// Initialisierung (falls noch nicht global in HTML passiert)
// Firestore nutzen – db ist bereits global definiert
db.collection("posts").get().then(snapshot => {
  // Beiträge anzeigen …
})

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

// Beim Laden der Seite starten
document.addEventListener("DOMContentLoaded", () => {
  loadPosts()
})

