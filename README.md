# 🃏 Poker Planning

Poker planning en temps réel basé sur la **suite de Fibonacci** (`0 1 2 3 5 8 13 21 ? ☕`), avec des **thèmes** pour personnaliser les cartes.

| Thème | Statut |
|---|---|
| ⚡ Pokémon | ✅ disponible (illustrations officielles) |
| 🏴‍☠️ One Piece | ✅ disponible (avis de recherche) |
| 🐉 Dragon Ball Z | ✅ disponible |
| 🍄 Mario | ✅ disponible |
| 🎤 KPop Demon Hunters | ✅ disponible |

## Fonctionnalités

- Création d'une room et partage par lien (`/room/<code>`), jusqu'à 20 participants.
- Chacun vote depuis son navigateur **sans voir les votes des autres** : on voit seulement qui a voté (carte retournée avec une icône ✔).
- **Révéler les votes** : affiche toutes les cartes à tous les participants, avec la répartition des votes et un indicateur de consensus.
- À gauche, **Votre estimation** : la carte que vous avez choisie.
- À droite, **Estimation la plus votée** (après révélation) : en cas d'égalité, la valeur la plus élevée l'emporte.
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

### Render (recommandé)

Le fichier `render.yaml` décrit le service :

1. Sur [render.com](https://dashboard.render.com), cliquez sur **New → Blueprint**.
2. Choisissez le repo `zilliw/poker-planning`, puis **Apply**.
3. L'URL publique (`https://poker-planning-xxxx.onrender.com`) s'affiche une fois le build terminé. Chaque fusion sur `main` redéploie l'application.

Offre gratuite : mise en veille après 15 min d'inactivité, environ 30 s de réveil, et les rooms en cours sont perdues.

### Docker

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

## Ajouter un thème ou des images

Les thèmes sont définis dans `client/src/app/core/themes.ts` : une palette de couleurs et, pour chaque valeur de carte, un personnage (nom + emoji). Plus l'estimation est grande, plus le personnage est puissant. Le dos des cartes se personnalise dans `client/src/app/components/planning-card.scss` (`.back-<thème>`).

Pour remplacer les emoji par de vraies images dans un nouveau thème :

1. Déposez une image par carte dans `client/public/themes/<thème>/`, nommée d'après la valeur : `0.webp`, `1.webp`, `2.webp`, `3.webp`, `5.webp`, `8.webp`, `13.webp`, `21.webp`, `question.webp` (?) et `coffee.webp` (☕). Format portrait 280 × 400 px (proportions de la carte) : l'image occupe toute la carte, la valeur s'affiche dans une pastille en haut à gauche.
2. Ajoutez `bundledImages: true` au thème dans `themes.ts`.

Si une image manque ou ne se charge pas, la carte affiche automatiquement l'emoji.

Les illustrations Pokémon proviennent de [PokeAPI/sprites](https://github.com/PokeAPI/sprites). Pokémon est une marque de Nintendo / Game Freak / The Pokémon Company.
