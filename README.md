# 🍩 Donut Shop

Boutique communautaire (non-officielle) pour vendre de l'argent et des items du serveur **Donut SMP** contre de l'argent réel, avec un système pour composer sa propre Shulker Box.

> Site communautaire non affilié à l'équipe du serveur. Vérifie les règles du serveur sur le RMT (real-money trading) avant de l'utiliser en production.

## Fonctionnalités

- **Argent** (`/argent`) — packs prédéfinis + montant personnalisé, calculés au même tarif que la boutique (500 M = 15 €, proportionnel à tout montant).
- **Items** (`/items`) — uniquement des items haut de gamme, dont le prix en euros est calculé automatiquement à partir de leur valeur en jeu (millions de Donuts), au même taux que l'argent. Une élytre à 500 M coûte donc 15 €, comme un pack d'argent de 500 M.
- **Shulker** (`/shulker`) — grille de 27 emplacements façon inventaire Minecraft : on clique sur une case pour choisir un item cher, on ajuste les quantités (dans la limite du stack réel de l'item), puis on ajoute la Shulker composée au panier.
- **Panier** (`/panier`) — récapitulatif, quantités modifiables, puis commande : le client doit saisir son **pseudo Minecraft deux fois** (les deux doivent correspondre) avant de pouvoir envoyer sa commande. Un numéro de commande est généré.
- **Admin** (`/admin`) — protégé par mot de passe (`ADMIN_PASSWORD`), liste toutes les commandes reçues et permet de changer leur statut (nouvelle / payée / livrée / annulée).

Aucun moyen de paiement en ligne n'est branché : la commande crée juste une demande, à finaliser manuellement (Discord, PayPal, etc.) — voir `NEXT_PUBLIC_CONTACT_DISCORD` ci-dessous.

## Où modifier les prix

Tout part d'un seul taux de change dans `lib/pricing.ts` :

```ts
export const RATE = 0.03; // € par Million de Donuts (500 M = 15 €)
```

Le catalogue d'items (nom, catégorie, icône, valeur en M, taille de stack) est dans `lib/catalog.ts`. Les prix en euros ne sont **jamais** stockés en dur : ils sont recalculés à partir de `valueM * RATE`, partout (site + serveur). Change `RATE` ou les `valueM` et tout se met à jour automatiquement. Les valeurs fournies par défaut sont des exemples à ajuster selon le marché réel du serveur.

## Installation

```bash
npm install
cp .env.example .env
# édite .env et choisis un ADMIN_PASSWORD
npm run dev
```

Le site est alors sur http://localhost:3000, l'admin sur http://localhost:3000/admin.

## Stockage des commandes

Les commandes sont enregistrées côté serveur dans un fichier `orders.json` (créé automatiquement, ignoré par git). Le prix envoyé par le client n'est jamais utilisé tel quel : le serveur (`app/api/orders/route.ts`) revalide chaque ligne du panier contre le catalogue et recalcule le total.

`lib/ordersStore.ts` choisit lui-même où écrire : `var/orders.json` (persistant) en local ou sur un serveur classique, et le dossier temporaire du système (non persistant entre deux invocations froides) si le système de fichiers du projet est en lecture seule — c'est le cas sur Vercel. Ça évite un crash au moment d'envoyer une commande, mais ce n'est **pas** un vrai stockage pour un shop actif sur ce type de plateforme : remplace `lib/ordersStore.ts` par une vraie base de données (Vercel Postgres, Vercel KV, etc.) avant d'encaisser de vraies commandes en production.

## Déploiement sur Vercel

Le moyen le plus simple d'obtenir une URL publique, sans rien partager avec qui que ce soit :

1. Sur [vercel.com](https://vercel.com), *Add New → Project*, puis importe le repo GitHub `donut-shop`.
2. Choisis la branche `claude/sweet-pasteur-g3kkwa` (ou celle sur laquelle tu es). Next.js est détecté automatiquement, aucune configuration nécessaire.
3. Dans *Environment Variables*, ajoute `ADMIN_PASSWORD` (et `NEXT_PUBLIC_CONTACT_DISCORD` si tu veux l'afficher sur la page de confirmation).
4. *Deploy*. Le site est en ligne en 1-2 minutes sur une URL `*.vercel.app`.

Voir la section précédente pour la limite de ce déploiement (commandes non durables tant qu'aucune vraie base de données n'est branchée).

## Stack

Next.js 14 (App Router) + TypeScript + Tailwind CSS, sans dépendance externe pour le stockage (fichier JSON) ni pour les paiements (à brancher manuellement selon vos besoins).
