# Supabase Edge Functions – Petits Chevaux Battle

Ce dossier contient des fonctions serverless pour Supabase Edge, en TypeScript (Deno).

## Déploiement

```bash
supabase functions deploy dailyBonus
supabase functions deploy validateGame
supabase functions deploy handleCapture
```

## Fonctions incluses

- `dailyBonus.ts` – Donne 50 coins si l’utilisateur ne l’a pas encore reçu aujourd’hui.
- `validateGame.ts` – Vérifie si une partie est valide (2 joueurs ou un gagnant).
- `handleCapture.ts` – Remet un pion capturé à l’écurie (position -1).