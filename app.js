/* Betsson Clips prototype: layout and copy follow the Figma "Use case 2" frames. */
const A = (h, ext = "svg") => `assets/${h}.${ext}`;
const $ = (id) => document.getElementById(id);
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

/* ------------------------------------------------------------------ data */
const HERO = [
  { type: "game", img: A("f5e57929d8b4f64a7096fe86898c6ac0634ab4ef", "png"), title: "Ganesha Fortune", sub: "PG Soft", tint: "rgba(101,58,0,.9)" },
  { type: "game", img: A("99a4a46611c2f1457531a07705e12b3bc1787db7", "png"), title: "Ganesha Fortune", sub: "PG Soft", tint: "rgba(101,58,0,.9)" },
  { type: "promo", img: A("d19624c98e4a889fe76e7ca4e9b3a69e8c9291df", "png"), title: "Break the ice with Icescape", sub: "Get 20 Freespins", tint: "rgba(15,92,148,.9)" },
];
const CATS = [
  ["Trending", "fd9ffe42a3cc2ba4b61eeccd7d17c030683df481", 1],
  ["Best Games", "5ca0ae706efe8f1f52971f7e476a4ee05606ea79", 1],
  ["Crash Games", "8dbdabb7d3bcdd2e1410a263377144f6362c7f81", 1],
  ["New Games", "5ca0ae706efe8f1f52971f7e476a4ee05606ea79"],
  ["All Games", "ae0153ba9e474c5de888198091849ccc88f341d7"],
  ["Daily Missions", "9e7607c4dbc4ce85a09f719c920ce43d34ac23b8"],
  ["Turbo Cashback", "0ffe7f2761483d722453c844ec02b569c93cb352"],
  ["Megaways", "682cc383ba0401fe0908d999c05c07924d424367"],
];
const CONTINUE = ["e1cf180e7f3bd0810a0cbe98663c1edf10a9b378", "07e6845a3175b1dbeff9444fdc1498b3077f3575", "84303859799ac46144fb7ed9ce8250fa399d4d6d"];
const BEST = ["9d63b7af76c57718ef32752b68e8fe223839d6e4", "a966170a03491bf95e524c243d4aa224f466d343", "c861ffa8fe6440c1efa49ed161fc987a6fc0c434",
  "03553998f78ca109c04ea54d5860f9f3e40d87f2", "6214fed2d877f925be4162329754743230f7bbbc", "896bdbbada323ec9bd43a87135c3a4f4a7001264"];
const TOP10 = [
  ["91272a0bb496c5ff306d36c6c39ed099c7564384", "4,265 playing", "high"], ["99a4a46611c2f1457531a07705e12b3bc1787db7", "3,965 playing", "high"],
  ["03553998f78ca109c04ea54d5860f9f3e40d87f2", "2,820 playing", "med"], ["a7314dd8b6af1b82d605f6481b9a52995d231e62", "2,267 playing", "med"],
  ["15ef28d0540bf1ddf8733d8d5318bf68eeca0711", "2,129 playing", "med"], ["654323a813d0eaa629c9d7fe63418f96355c4fe9", "1,277 playing", "med"],
  ["bdeecd2bd0933ac7b3eca2f7ddbc70afd32131ca", "923 playing", "low"], ["9fcda113c8b377a6925c35672375f9ee59ee32a9", "876 playing", "low"],
  ["d9af5b8ce0560095f8ccdc598689526636f4f711", "782 playing", "low"], ["9d63b7af76c57718ef32752b68e8fe223839d6e4", "452 playing", "low"],
];
const POP = {
  high: ["b577b59da5c0e224ef38784410e30cfc622a4890", "#ff6d6d"],
  med: ["21cc370a283037a5156c30f7ac7d9a4cd70607ef", "#fa9600"],
  low: ["ff42fe5d7521c347bdaca7c4dd8f576ac8956d33", "#fad749"],
};
// Clip order, titles, subtitles and bet values are taken from the Clip 1–4 frames.
const CLIPS = [
  { id: "gates", name: "Gates of Inter Milan", sub: "Meet the Inter gods", src: "clips/clip3.mp4", poster: "posters/clip3.png",
    avatar: A("d72035eb0aa9506147944551245df1557670cc85", "png"), bet: "€27.29" },
  { id: "legacy", avatar: "assets/thumb-legacy.png", name: "Legacy of Dead", sub: "Meet the Inter gods", src: "clips/clip4.mp4", poster: "posters/clip4.png", bet: "€53.00" },
  { id: "golden", avatar: "assets/thumb-golden.png", name: "Golden Retriever", sub: "Crazy win by this customer", src: "clips/clip2.mp4", poster: "posters/clip2.png", bet: "€97.29" },
  { id: "starburst", avatar: "assets/thumb-starburst.png", name: "Betsson Starburst", sub: "Reach the stars!", src: "clips/clip1.mp4", poster: "posters/clip1.png", bet: "€289.20" },
];
const STAT = { rtp: "89%", vol: "Med", max: "5000x" };

const state = {
  index: 0,
  muted: true,
  favs: store.get("clips.favs", {}),
  votes: store.get("clips.votes", {}),
};

/* ----------------------------------------------------------------- lobby */
function renderLobby() {
  $("catList").innerHTML = CATS.map(([n, ic, fill]) =>
    `<button class="cat ${fill ? "fill" : ""}"><img src="${A(ic)}" alt="">${n}</button>`).join("");

  $("contRow").innerHTML = CONTINUE.map((h) => `<img class="ct" src="${A(h, "png")}" alt="">`).join("");

  $("clipsRow").innerHTML = CLIPS.map((c, i) =>
    `<button class="clip-th" data-i="${i}" aria-label="Open clip: ${c.name}"><img src="${c.poster}" alt=""></button>`).join("");
  document.querySelectorAll(".clip-th").forEach((t) => t.addEventListener("click", () => openViewer(+t.dataset.i)));

  $("bestRow").innerHTML = BEST.map((h) =>
    `<div class="gm"><img class="im" src="${A(h, "png")}" alt=""><div class="nm">Game Name</div><div class="pv">PROVIDER</div><span class="tag">NEW</span></div>`).join("");

  $("promoRow").innerHTML = [1, 2, 3].map(() =>
    `<div class="promo-card"><b>Get 100% up to R$100 - 300 spins</b>Start your adventure with KTO</div>`).join("");

  $("topRow").innerHTML = TOP10.map(([h, txt, p], i) =>
    `<div class="tp"><img class="im" src="${A(h, "png")}" alt=""><span class="tag">NEW</span>
      <div class="rank">${i + 1}</div>
      <div class="play" style="color:${POP[p][1]}"><img src="${A(POP[p][0])}" alt="">${txt}</div></div>`).join("");

  // sticky header turns into the blurred bar once the page scrolls
  $("lobby").addEventListener("scroll", (e) => $("hdr").classList.toggle("solid", e.target.scrollTop > 8), { passive: true });
}

/* --------------------------------------------------------- hero carousel */
const heroState = { i: HERO.length - 1 };
function renderHero() {
  const track = $("heroTrack");
  track.innerHTML = HERO.map((h, i) => `
    <div class="hcard ${h.type}" data-i="${i}" style="--tint:${h.tint}">
      <img src="${h.img}" alt="" draggable="false">
      <div><h3>${h.title}</h3><p>${h.sub}</p>
      ${h.type === "game" ? `<span class="pill">Play <svg viewBox="0 0 26 26"><path d="M8 10l5 5 5-5"/></svg></span>` : ""}</div>
    </div>`).join("");
  $("dots").innerHTML = HERO.map(() => "<i></i>").join("");
  heroGo(heroState.i, false);

  let d = null;
  const hero = $("hero");
  hero.addEventListener("pointerdown", (e) => { d = { x0: e.clientX, dx: 0 }; track.classList.add("drag"); hero.setPointerCapture(e.pointerId); });
  hero.addEventListener("pointermove", (e) => { if (!d) return; d.dx = e.clientX - d.x0; track.style.transform = `translateX(${heroX(heroState.i) + d.dx}px)`; });
  const end = () => {
    if (!d) return; const dx = d.dx; d = null; track.classList.remove("drag");
    heroGo(heroState.i + (dx < -40 ? 1 : dx > 40 ? -1 : 0));
  };
  hero.addEventListener("pointerup", end); hero.addEventListener("pointercancel", end);
}
function heroX(i) { return $("hero").clientWidth / 2 - (i * (267 + 16.5) + 133.5); }
function heroGo(i, animate = true) {
  i = Math.max(0, Math.min(HERO.length - 1, i)); heroState.i = i;
  const t = $("heroTrack");
  if (!animate) t.style.transition = "none";
  t.style.transform = `translateX(${heroX(i)}px)`;
  if (!animate) { t.offsetHeight; t.style.transition = ""; }
  t.querySelectorAll(".hcard").forEach((c, k) => c.classList.toggle("on", k === i));
  $("dots").querySelectorAll("i").forEach((c, k) => c.classList.toggle("on", k === i));
}

/* ------------------------------------------------------------ clip viewer */
const viewer = $("viewer"), track = $("track");
let slides = [], H = 0;

const ICON_MUTED = '<path d="M11 5L6 9H3v6h3l5 4z"/><path d="M16 9l5 6M21 9l-5 6"/>';
const ICON_SOUND = '<path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>';
const INFO_ICON = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9.2"/><path d="M12 11v5.500M12 7.700v.1" stroke-width="2.200"/></svg>');
const PLAY_SVG ='<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';

function buildSlides() {
  track.innerHTML = CLIPS.map((c) => `
    <section class="slide" data-id="${c.id}">
      <div class="vid">
        <div class="media">
          <div class="poster" style="background-image:url(${c.poster})"></div>
          <video playsinline webkit-playsinline loop muted preload="none" poster="${c.poster}" data-src="${c.src}"></video>
        </div>
        <i class="fade fade-t"></i><i class="fade fade-b"></i>
        <div class="pause-ind">${PLAY_SVG}</div>
      </div>

      <div class="actions">
        <button class="act" data-act="fav" aria-label="Favourite"><span class="ci"><i class="ico" style="--m:url(${A("361287ce9d54f4c85c846cee9837850985438ed3")})"></i></span><span>Fav</span></button>
        <button class="act" data-act="up" aria-label="Like"><span class="ci"><i class="ico" style="--m:url(${A("b3f8909b6d6c45a3c60c97c6fe01e44ef18d3002")})"></i></span><span>Like</span></button>
        <button class="act" data-act="down" aria-label="Dislike"><span class="ci"><i class="ico" style="--m:url(${A("66918ca1692cee64f483e8f410e8235d6db356cd")})"></i></span><span>Dislike</span></button>
        <button class="act" data-act="info" aria-label="Game info"><span class="ci"><i class="ico" style="--m:url('${INFO_ICON}')"></i></span><span>Info</span></button>
      </div>

      <div class="cap">
        <img src="${c.avatar || c.poster}" alt="" style="${c.avatar ? "" : "object-position:center 14%"}">
        <div class="cap-body">
          <div class="cap-line"><b>${c.name}</b></div>
          <div class="cap-sub">${c.sub}</div>
        </div>
        <button class="play-cta" data-act="play">Play now</button>
      </div>

      <div class="wins" aria-live="polite"></div>
    </section>`).join("");
  slides = [...track.children];
  slides.forEach((s, k) => {   // the hint appears when the clip finishes (it loops, so detect the end / wrap-around)
    const v = s.querySelector("video"); v._last = 0;
    v.addEventListener("timeupdate", () => {
      const wrapped = v.currentTime < v._last - 1; v._last = v.currentTime;
      if (coachArmed && k === state.index && v.duration && (wrapped || v.currentTime >= v.duration - 0.35)) fireCoach();
    });
  });
}

function layout() {
  H = viewer.clientHeight;
  slides.forEach((s, i) => (s.style.top = i * H + "px"));
  track.style.transform = `translateY(${-state.index * H}px)`;
}
const vid = (i) => slides[i]?.querySelector("video");

/* ---- latest wins: TikTok-style live comments, flag as the avatar ---- */
const FLAG = A("0970a388b02c486cd082fe21177c220ff64aacc2");
const WIN_AMOUNTS = ["€12.40", "€105.80", "€3.60", "€58.00", "€240.10", "€9.90", "€76.50", "€18.20", "€164.30", "€31.75"];
let winTimer = null, winN = 0;
function pushWin(i, amount) {
  const box = slides[i]?.querySelector(".wins"); if (!box) return;
  const el = document.createElement("div");
  el.className = "win";
  const id = String(Math.floor(100 + Math.random() * 900));
  el.innerHTML = `<img src="${FLAG}" alt=""><div><small>Player ••${id}</small><p>Just won <b>${amount}</b></p></div>`;
  el.style.setProperty("--x", Math.round(Math.random() * 22) + "px");   // slight horizontal jitter
  el.addEventListener("animationend", (e) => { if (e.animationName === "winFade" || e.animationName === "winOut") el.remove(); });
  box.appendChild(el);
  const live = [...box.children].filter((c) => !c.classList.contains("out"));
  if (live.length > 2) dismissWin(live[0]);   // never more than 2 on screen
}
function dismissWin(el) {   // freeze at the current position, then fade out
  const cs = getComputedStyle(el), tf = cs.transform, op = cs.opacity;
  el.classList.add("out"); el.style.animation = "none"; el.style.transform = tf; el.style.opacity = op;
  void el.offsetWidth;
  el.style.transition = "opacity .3s"; el.style.opacity = "0";
  setTimeout(() => el.remove(), 320);
}
function startWins(i) {
  clearInterval(winTimer);
  slides.forEach((s) => (s.querySelector(".wins").innerHTML = ""));
  winN = 0;
  pushWin(i, CLIPS[i].bet);            // first win matches the amount in the design
  winTimer = setInterval(() => {
    if (!viewer.classList.contains("open")) return;
    pushWin(state.index, WIN_AMOUNTS[winN++ % WIN_AMOUNTS.length]);
  }, 2400);
}
function stopWins() { clearInterval(winTimer); }

function activate(i) {
  startWins(i);
  slides.forEach((s, k) => {
    const v = s.querySelector("video");
    if (k === i) {
      if (!v.src) v.src = v.dataset.src;
      v.muted = state.muted; v.currentTime = 0; v._last = 0;   // a manual restart is not the end of the clip
      s.classList.remove("paused");
      v.play().catch(() => {});
    } else {
      v.pause();
      if (Math.abs(k - i) === 1 && !v.src) { v.src = v.dataset.src; v.preload = "auto"; } // preload neighbours
    }
  });
  syncUI();
}

function goTo(i, animate = true) {
  i = Math.max(0, Math.min(CLIPS.length - 1, i));
  track.classList.remove("drag");
  if (!animate) track.style.transition = "none";
  track.style.transform = `translateY(${-i * H}px)`;
  if (!animate) { track.offsetHeight; track.style.transition = ""; }
  if (i !== state.index) { state.index = i; activate(i); if (coachArmed) { coachArmed = false; store.set("clips.seenHint", true); } }   // swiped on their own: no hint needed
  else if (!animate) activate(i);
}

/* ---- first-time swipe hint: shown once, when the first clip you watch reaches its end ---- */
let coachTimer = null, coachOn = false, coachJustHidden = false, coachArmed = false;
function armCoach() { coachArmed = !store.get("clips.seenHint", false); }
function fireCoach() {
  coachArmed = false; store.set("clips.seenHint", true);
  $("coach").classList.add("on"); coachOn = true;
  coachTimer = setTimeout(hideCoach, 6000);
}
function hideCoach() {
  clearTimeout(coachTimer);
  if (!coachOn) return;
  coachOn = false; $("coach").classList.remove("on");
  coachJustHidden = true; setTimeout(() => (coachJustHidden = false), 400);   // the dismissing tap shouldn't pause the clip
}

function openViewer(i) {
  viewer.classList.add("open"); viewer.setAttribute("aria-hidden", "false");
  state.index = i; layout(); goTo(i, false);
  armCoach();
}
function openSheet() {
  $("shRtp").textContent = STAT.rtp; $("shVol").textContent = "Medium"; $("shMax").textContent = "5,000x";
  $("shWin").textContent = CLIPS[state.index].bet;
  setTab("bonuses");
  $("sheet").classList.add("on"); $("scrim").classList.add("on"); $("sheet").setAttribute("aria-hidden", "false");
}
function closeSheet() {
  const sh = $("sheet");
  sh.style.transform = ""; sh.classList.remove("on", "dragging");
  $("scrim").classList.remove("on"); sh.setAttribute("aria-hidden", "true");
}
function setTab(name) {
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("on", t.dataset.tab === name));
  document.querySelectorAll(".tabpane").forEach((p) => p.classList.toggle("on", p.dataset.pane === name));
  $("sheet").querySelector(".sheet-body").scrollTop = 0;
}
document.querySelectorAll(".tab").forEach((t) => t.addEventListener("click", () => setTab(t.dataset.tab)));
$("scrim").onclick = closeSheet;
// drag the handle down to dismiss
(function () {
  let y0 = null, dy = 0; const sh = $("sheet"), top = $("sheetTop");
  top.addEventListener("pointerdown", (e) => { y0 = e.clientY; dy = 0; sh.classList.add("dragging"); top.setPointerCapture(e.pointerId); });
  top.addEventListener("pointermove", (e) => { if (y0 === null) return; dy = Math.max(0, e.clientY - y0); sh.style.transform = `translateY(${dy}px)`; });
  const end = () => { if (y0 === null) return; y0 = null; sh.classList.remove("dragging"); if (dy > 80) closeSheet(); else sh.style.transform = ""; };
  top.addEventListener("pointerup", end); top.addEventListener("pointercancel", end);
})();

function closeViewer() {
  closeSheet(); stopWins(); hideCoach(); coachArmed = false;
  viewer.classList.remove("open"); viewer.setAttribute("aria-hidden", "true");
  setTimeout(() => { if (!viewer.classList.contains("open")) slides.forEach((s) => s.querySelector("video").pause()); }, 360); // keep playing while it slides away
}

function syncUI() {
  $("soundIcon").innerHTML = state.muted ? ICON_MUTED : ICON_SOUND;
  $("soundBtn").classList.toggle("on", !state.muted); $("soundBtn").setAttribute("aria-pressed", String(!state.muted));
  slides.forEach((s, k) => {
    const id = CLIPS[k].id;
    s.querySelector('[data-act="fav"]').classList.toggle("on", !!state.favs[id]);
    s.querySelector('[data-act="up"]').classList.toggle("on", state.votes[id] === "up");
    s.querySelector('[data-act="down"]').classList.toggle("on", state.votes[id] === "down");
  });
}
const pop = (b) => { b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop"); };
function toast(msg) { const t = $("toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 1600); }

function toggleFav(btn, forceOn = false) {
  const id = CLIPS[state.index].id;
  state.favs[id] = forceOn ? true : !state.favs[id];
  if (!state.favs[id]) delete state.favs[id];
  store.set("clips.favs", state.favs); syncUI();
  if (btn) pop(btn);
  if (state.favs[id]) toast("Added to favourites");
}
function vote(btn, kind) {
  const id = CLIPS[state.index].id;
  if (state.votes[id] === kind) delete state.votes[id]; else state.votes[id] = kind;
  store.set("clips.votes", state.votes); syncUI(); pop(btn);
}

/* buttons inside slides (delegated) */
track.addEventListener("click", (e) => {
  const b = e.target.closest("[data-act]"); if (!b) return;
  const a = b.dataset.act;
  if (a === "fav") toggleFav(b);
  else if (a === "up") vote(b, "up");
  else if (a === "down") vote(b, "down");
  else if (a === "info") openSheet();
  else if (a === "play") toast("Prototype: launches " + CLIPS[state.index].name);
});
$("closeBtn").onclick = closeViewer;
$("soundBtn").onclick = () => { state.muted = !state.muted; const v = vid(state.index); if (v) v.muted = state.muted; syncUI(); };

/* gestures: vertical swipe (touch + mouse), tap = pause, double tap = favourite, wheel, arrows */
let drag = null, lastTap = 0, tapTimer = null;
viewer.addEventListener("pointerdown", (e) => {
  hideCoach();
  if (e.target.closest("button, .sheet, .scrim")) return;
  drag ={ y0: e.clientY, t0: performance.now(), dy: 0, moved: false };
  viewer.setPointerCapture(e.pointerId); track.classList.add("drag");
});
viewer.addEventListener("pointermove", (e) => {
  if (!drag) return;
  drag.dy = e.clientY - drag.y0;
  if (Math.abs(drag.dy) > 6) drag.moved = true;
  let dy = drag.dy;
  if ((state.index === 0 && dy > 0) || (state.index === CLIPS.length - 1 && dy < 0)) dy *= 0.3; // rubber-band
  track.style.transform = `translateY(${-state.index * H + dy}px)`;
});
function endDrag(e) {
  if (!drag) return;
  const d = drag; drag = null; track.classList.remove("drag");
  const v = Math.abs(d.dy) / (performance.now() - d.t0);
  if (d.moved && (Math.abs(d.dy) > H * 0.15 || v > 0.5)) goTo(state.index + (d.dy < 0 ? 1 : -1));
  else if (d.moved) goTo(state.index);
  else if (e.type === "pointerup") handleTap();
}
viewer.addEventListener("pointerup", endDrag); viewer.addEventListener("pointercancel", endDrag);

function handleTap() {
  if (coachJustHidden) return;
  const now = performance.now();
  if (now - lastTap < 300) {
    clearTimeout(tapTimer); lastTap = 0;
    const btn = slides[state.index].querySelector('[data-act="fav"]');
    if (!state.favs[CLIPS[state.index].id]) toggleFav(btn, true); else pop(btn);
    const b = $("burst"); b.classList.remove("go"); void b.offsetWidth; b.classList.add("go");
    return;
  }
  lastTap = now;
  tapTimer = setTimeout(() => {
    const v = vid(state.index), s = slides[state.index];
    if (v.paused) { v.play(); s.classList.remove("paused"); } else { v.pause(); s.classList.add("paused"); }
  }, 300);
}

let wheelLock = false;
viewer.addEventListener("wheel", (e) => {
  e.preventDefault(); hideCoach();
  if (wheelLock || Math.abs(e.deltaY) < 20) return;
  wheelLock = true; setTimeout(() => (wheelLock = false), 550);
  goTo(state.index + (e.deltaY > 0 ? 1 : -1));
}, { passive: false });
document.addEventListener("keydown", (e) => {
  if (!viewer.classList.contains("open")) return;
  hideCoach();
  if (e.key === "ArrowDown") goTo(state.index + 1);
  else if (e.key === "ArrowUp") goTo(state.index - 1);
  else if (e.key === "Escape") ($("sheet").classList.contains("on") ? closeSheet() : closeViewer());
});

window.addEventListener("resize", () => { layout(); heroGo(heroState.i, false); });
buildSlides(); renderLobby(); renderHero(); layout(); syncUI();
