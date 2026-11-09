# Betsson Clips prototype

Casino lobby with a "Clips" section: tap a thumbnail to open a full-screen, swipeable clip feed
(favourite, like/dislike, game info drawer, live wins, audio toggle).

## Run
Static site, no build step. From this folder:

    python3 -m http.server 5180

- Prototype: http://localhost:5180/
- Desktop presentation (phone frame): http://localhost:5180/presentation.html

Note: `clips/` holds four compressed H.264 clips (~14 MB total).
