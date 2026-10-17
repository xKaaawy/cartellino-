# Cartellino

App Android per segnare le ore di lavoro, stimare lo stipendio netto e mettere da parte le ore extra per i giochi Steam.

## Come si crea l'APK

Non serve installare niente sul computer: l'app viene compilata da GitHub.

1. Carica questi file in un repository GitHub **privato**.
2. Apri la scheda **Actions** del repository: parte da sola l'azione "Crea l'app Android" (dura circa 5–8 minuti).
3. Quando diventa verde, apri **Releases** (colonna a destra nella pagina principale del repository) e scarica `Cartellino.apk` dal telefono.
4. Apri il file sul telefono e conferma l'installazione. La prima volta Android chiede di permettere l'installazione di app da quella fonte (browser o app File): attivalo.

## Aggiornare l'app

Ogni modifica caricata nel repository crea una nuova versione in Releases. Scaricala e installala sopra quella vecchia: i dati restano, perché l'app è firmata sempre con la stessa chiave (`keystore/debug.keystore`). Non cancellare quel file.

## Cosa c'è dentro

- `www/index.html` — tutta l'app (calendario, stipendio, salvadanaio, giochi Steam)
- `resources/` — icona, icona delle notifiche e schermata di avvio
- `scripts/android-setup.mjs` — applica icone e numero di versione al progetto Android
- `.github/workflows/build.yml` — le istruzioni che GitHub segue per creare l'APK

I dati sono salvati solo sul telefono. Usa **Impostazioni → Backup** per esportarli ogni tanto.

## Musica (facoltativo)

In **Impostazioni → Musica** scegli la fonte.

**Spotify** (serve Premium)
1. Su developer.spotify.com/dashboard premi *Create app*.
2. Nome e descrizione a piacere. Redirect URI: `cartellino-ore://spotify-callback`. API: *Web API*. Salva.
3. Copia il *Client ID* e incollalo nell'app (o in `www/config.js`), poi premi *Collega Spotify*.

**Last.fm**
1. Crea un account su last.fm e collegalo a Spotify: Settings → Applications → Spotify Scrobbling → Connect.
2. Crea una API key su last.fm/api/account/create (basta nome e descrizione).
3. Nell'app scrivi nome utente e API key (o mettila in `www/config.js`) e premi *Collega Last.fm*.
