# 🧵 Mein Forum – Benutzerverwaltung & Firestore-Anbindung

Dies ist ein selbstgebautes, minimales Webforum mit:
- HTML/CSS/JS (ohne Frameworks)
- Firestore als Datenbank
- Benutzer-Login via Benutzername + Passwort
- Manuelle Registrierung mit Freischaltung
- Admin-Panel mit Rechteprüfung

---

## 🔧 Projektstruktur (wichtigste Dateien)

| Datei              | Funktion                                              |
|-------------------|--------------------------------------------------------|
| `index.html`       | Startseite mit Beitragsliste                         |
| `thread.html`      | Einzelansicht eines Beitrags + Antwortformular       |
| `new-post.html`    | Formular zum Erstellen neuer Beiträge                |
| `register.html`    | Registrierung neuer Benutzer (wartend)               |
| `admin.html`       | Adminbereich zur Freischaltung/Hinzufügung          |
| `script.js`        | Login/Logout, Beitrag laden, Admin-Link anzeigen     |
| `thread.js`        | Einzelthread anzeigen & Antworten verwalten          |
| `new-post.js`      | Beitrag speichern in Firestore                       |
| `register.js`      | Benutzer zur Warteschlange hinzufügen                |
| `admin.js`         | Admin-Check, Benutzer anzeigen/hinzufügen/freigeben  |

---

## 🔐 Benutzer-Login

- Benutzer werden manuell registriert und später freigeschaltet.
- Login erfolgt mit Benutzername + Passwort.
- Daten werden in `localStorage` gespeichert (bleibt beim Seitenwechsel erhalten).
- Loginsystem arbeitet mit der Collection `users`.

---

## 📝 Registrierung

- Neue Benutzer registrieren sich über `register.html`
- Eintrag landet in `pendingUsers`
- Admin prüft und verschiebt Freigaben nach `users`
- Benutzerdaten enthalten: `username`, `password`, `createdAt`, `isAdmin` (optional)

---

## ⚙️ Admin Panel

- Nur sichtbar, wenn `isAdmin: true` beim eingeloggten User
- Zeigt alle ausstehenden Benutzeranfragen
- Bietet Buttons zum:
  - Freischalten (nach `users` verschieben)
  - Löschen von Anfragen
  - Manuelles Hinzufügen neuer Benutzer

---

## 💬 Beiträge & Antworten

- Collection `posts` enthält Beiträge mit Feldern: `title`, `content`, `pinned`, `author`, `createdAt`
- Antworten werden in Subcollection `posts/{postId}/answers` gespeichert
- Antworten enthalten: `text`, `author`, `createdAt`

---

## 🛡️ Sicherheit & Hinweise

- Aktuell werden Passwörter im Klartext gespeichert → **nur für private Nutzung geeignet!**
- Später: Passwort-Hashing mit bcrypt.js oder Firebase Auth empfohlen
- Adminschutz basiert auf `isAdmin`-Feld in Firestore
- Zugriff auf `admin.html` wird über Firestore-Berechtigung geprüft

---

## 🧠 Nützliche Firebase Collections

| Collection     | Zweck                             |
|----------------|------------------------------------|
| `posts`        | Alle Forenbeiträge                |
| `users`        | Freigegebene Benutzer              |
| `pendingUsers` | Noch nicht freigegebene Accounts   |

---

## ✅ To-Do für später

- Styling verbessern (z. B. mobile Ansicht, Dark Mode)
- Beiträge bearbeiten/löschen
- Rollenverwaltung (mehrere Admins/Moderatoren)
- Passwort verschlüsseln (z. B. mit bcrypt.js)
- Firebase Hosting optional nutzen

---

> Erstellt im März 2025 – Stand: voll funktionsfähig, minimalistisch und gut erweiterbar.
> Viel Spaß beim Weiterbauen! 🎉

