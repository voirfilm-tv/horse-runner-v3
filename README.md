# 🐴 Petits Chevaux Battle – Webapp Multijoueur

Un jeu de petits chevaux en ligne moderne, multijoueur, fun et 100% gratuit.

---

## 🚀 Fonctionnalités principales

- ✅ Connexion via pseudo + mot de passe
- 🪙 500 coins à l’inscription + 50/jour
- 🎲 Lancer de dé animé et logique de plateau
- 🧠 Capture des pions adverses (hors case étoile)
- 🏁 Détection de victoire et fin de partie
- 💬 Chat en temps réel dans chaque partie
- 📊 Historique personnel (résultats, gains)
- 🌐 Matchmaking automatique ou lobby public
- 🔒 Parties privées (lien d’invitation)
- 🔁 Temps réel via Supabase Realtime
- 📱 PWA installable

---

## 📁 Arborescence des routes/pages

```
/login           → Connexion
/register        → Inscription
/lobby           → Liste des parties publiques
/create          → Création de partie
/game/:id        → Partie en cours
/history         → Historique du joueur
```

---

## 🧱 Stack technique

- Frontend : **React**, **Vite**, **TailwindCSS**
- State : **Zustand**
- Backend : **Supabase** (auth, base, realtime)
- PWA ready

---

## 🗄️ Tables Supabase

- `users` : coins, pseudo, last_bonus
- `games` : parties créées avec `players_state`
- `chat_messages` : messages en partie
- `history` : résultats finaux des parties

---

## 📥 Installation

```bash
git clone <repo>
cd petits-chevaux-battle
npm install
npm run dev
```

Crée un fichier `.env` :

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

---

## 🧪 À faire encore (éventuellement)

- ✅ Score global / classement
- ✅ Système d’amis
- ✅ IA ou mode solo
- ✅ Animations / sons supplémentaires

---

Développé par Gwendal avec rigueur et passion 🤝