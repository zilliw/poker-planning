# 🃏 Poker Planning

Poker planning en temps réel basé sur la **suite de Fibonacci** (`0 1 2 3 5 8 13 21 34 55 89 ? ☕`), avec des **thèmes** pour personnaliser les cartes.

| Thème | Statut |
|---|---|
| ⚡ Pokémon | ✅ disponible |
| 🏴‍☠️ One Piece | 🔜 bientôt |
| ⚽ Footballeurs | 🔜 bientôt |
| 🍄 Mario | 🔜 bientôt |

## Fonctionnalités

- Création d'une room et partage par lien (`/room/<code>`), jusqu'à 20 participants.
- Chacun vote depuis son navigateur **sans voir les votes des autres** : on voit seulement qui a voté (carte retournée avec une icône ✔).
- **Révéler les votes** : affiche toutes les cartes à tous les participants, avec la moyenne, la valeur Fibonacci suggérée, la répartition et un indicateur de consensus.
- **Clean** : remet la table à zéro pour un nouveau tour.
- Changement de thème à la volée, synchronisé pour toute la room.
- Un rechargement de page conserve le participant et son vote (reconnexion automatique).

## Stack

- `client/` : Angular 21 (composants standalone, signals) + `socket.io-client`.
- `server/` : Node.js + Express 5 + Socket.IO (WebSockets). L'état des rooms est en mémoire.
- Le serveur sert aussi le build Angular : **un seul process / un seul conteneur** à déployer.

Sécurité des votes : c'est le serveur qui masque les votes. Tant qu'ils ne sont pas révélés, chaque client reçoit seulement `hasVoted` pour les autres participants, jamais la valeur.

## Développement

```bash
npm run install:all
npm run dev:server   # http://localhost:3000 (API WebSocket)
npm run dev:client   # http://localhost:4200 (proxy /socket.io → :3000)
npm test             # tests unitaires du serveur
```

## Déploiement

### Docker (recommandé)

```bash
docker build -t poker-planning .
docker run -p 3000:3000 poker-planning
```

L'image se déploie telle quelle sur Render, Railway, Fly.io, Google Cloud Run, Azure Container Apps, etc. (les WebSockets doivent être supportés par l'hébergeur).

> ⚠️ L'état est en mémoire : lancez **une seule instance**. Pour plusieurs instances, il faudrait ajouter l'adapter Redis de Socket.IO.

### Sans Docker

```bash
npm run install:all && npm run build && npm start
```

### Variables d'environnement

| Variable | Défaut | Description |
|---|---|---|
| `PORT` | `3000` | Port HTTP |
| `STATIC_DIR` | `server/public` | Dossier du build Angular |
| `DISCONNECT_GRACE_MS` | `15000` | Délai avant de retirer un participant déconnecté |
| `CORS_ORIGIN` | – | Origines autorisées si le front est hébergé ailleurs (séparées par des virgules) |

## Ajouter un thème

Les thèmes sont définis dans `client/src/app/core/themes.ts` : une palette de couleurs et une image + un nom de personnage par valeur de carte. Placez les images dans `client/public/themes/<theme>/` et passez `available: true`.

Les illustrations Pokémon proviennent de [PokeAPI/sprites](https://github.com/PokeAPI/sprites). Pokémon est une marque de Nintendo / Game Freak / The Pokémon Company.
