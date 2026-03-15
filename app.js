const STORAGE_KEY = "swipe-rank-state-v2";

const rawNames = `Aaron Johnson
Adam Schupack
Ahhlayna Fran
ahlers@law.duke.edu Ahlers
Alex Kiles
Ali Renes
Alice Specht
Alina Mian
Alise Herschel
Allison Ohlinger
Ally Lamson
Allyson Gunsallus
Alyssa Fiedler
Amanda Pennington
Amelia Thorn
Anastasia Klimenko
Andi Sotolongo
Andrew Keaton
Andrew Villacastin
Anna Manhas
Annie Jaramillo
Ariel Alexovich
Ashley Lane
Ashley Romine
Ashley Weidner
Audrey Moberg
Ben Kastan
Ben McVane
Benjamin Voce-Gardner
Brian Burns
Brie-Anna Michelle
Britney Sutton
Brittany Gerren
Brooke Orr
Bruce Imperial
Bryan Jarrett
Cari Bell
Carly Zubrzycki
Carmen Smith
Catherine Steubing
Ceridwen Cherry
Cerretta Amos
Cesar Gomez
Chantay Lubbecke
Charles Comer
"Charmani, Thania"
Chelsea Glover
Chloé Gillen
Chris Denning
Chris Evans
Christie Takács
Christine Brady
Clare Huerta
Dani Dziatłowicz
Daniel Suhr
Danny Paulson
Darek Heleniak
Dave Levine
Deeptee Jain
Deniz Hughes-Thordarson
Dennis Spencer
Don Farrow
Doris Frye
Doug Warzoha
Drew Andrews
Elle Gilley
Emily Muriel
Erica Liner
Erin Freeman
Francesca Giuliano
George Own
Gio Prusecki
Gonzalo Alberto
Graeme Hawkins
Greta Hambke
Guila Bickford
Hadrien Forterre
Haninah Levine
Heather Arner
Helen Lewis (Mum)
Holly Keith
Hunter Kallenbach
Ian Lawthom
Ian Mok
Ilan Angwin
Ilizabeth Hempstead
Iva Popa
Jack Murphy
Jake Charles
James Zhu
Jameson Rohrer
Jana Kovich
Jason Greenhut
Jay Atkinson
Jeannie Rubin
Jedediah Purdy
Jen Murphy
Jen Walling
Jenna Feistritzer
Jennifer Swize
Jeremiah Daniel
Jess Newman
Jessalee Landfried
Jesse Lynch
Jill Schumacher
John Donovan
Josh Layburn
Joshua Kaye
Josie Starkie
JP Hufnagel
Julie Crampton
Julie-Anne Wilkinson
June Oldman
Kaetochi Okemgbo
Kara Ford
Karen Rediker
Karissa McEnroe
Kat Hall
Kate Brockmeyer
Kate Jenkinson
Katherine Graham
Katie Anthony
Katie Elyse
Kevin Davies
Kevin Fletcher
Kim Mullikin
Koree Wooley
Kristin Alvendia
Kristopher James
Kyra Saffran
Laura Eileen
Laura Galvin
Lauren Forbes
Lauren Godfrey
Lauren Haertlein
Lauren Moore
Laurie Ayala-Alvarez
Leanne McLane
Leigh G Llewelyn
Lexie Lee
Lia Smith
Lisa Ezell
Lisa Zornberg
Liz L-k
Lucy Cayse
Mahlet Ayalew
Marc Walby
Mariana Sofia
Martine Veld
Martynka Wawrzyniak
Mary Ma
Matt Mooney
Matt Robinson
Maureen Merkl
Meg Steer
Melissa Firlit
Michael DeSouza
Michael Ferrie
Michael Longyear
Michelle Burkhalter
Michelle Galvin
Michelle Hange
Mihkel Kolk
Mike Bergen
Molly Reardon
Myra Donnelly
N. Kirkland
Nadia Scott
Nev Irani
Nic Zayas
Nigel Lawthom
Ogle Thomas
Pandora Mousley
Paul Loraine
Paul Newby
Paula Pöste
Peggah Wilson
Priya Raval
Priyanka Wityk
Rachel Berkowitz
Rhys Llewelyn
Richard Bannister
Richard Bateman
Risa Sayre
Robby Warnitz
Rosalynd John
Ryan Walsh
Ryham Ragab
Sally Martel
Sam Burkhalter
Sandrina Glanz
Sarah Brown
Sarah Fischer
Saurabh Kapur
Sean-David Cunningham
Sebastian Oh (Sebby)
Shelagh Johnson
Sioned Morgan
Stacy Beck-Walby
Stephanie Dolan
Stephen Cox
Steve
Stuart Shively
Sumon Dantiki
Susan Burkhalter
Sydney Cone
Tara Allison
Thomas Smith
Tracy Hager
Vernon Mcgowin
Weilong
Will Hellmuth
Yana VB
Yuliana Di Pierro Westover
Zach Bakal
Zach Burkhalter`;

const names = rawNames
  .split("\n")
  .map((name) => name.trim().replace(/^"|"$/g, ""))
  .filter(Boolean);

const swipeRound = document.getElementById("swipe-round");
const cardStack = document.getElementById("card-stack");
const progress = document.getElementById("swipe-progress");
const leftBtn = document.getElementById("left-btn");
const rightBtn = document.getElementById("right-btn");
const restartBtn = document.getElementById("restart-btn");

const rankRound = document.getElementById("rank-round");
const rankList = document.getElementById("rank-list");
const finishBtn = document.getElementById("finish-btn");

const results = document.getElementById("results");
const finalRanking = document.getElementById("final-ranking");
const copyBtn = document.getElementById("copy-btn");

let state = loadState();

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const fallback = { index: 0, liked: [], ranking: [], phase: "swipe" };
    if (!Number.isInteger(parsed.index) || parsed.index < 0 || parsed.index > names.length) return fallback;
    if (!Array.isArray(parsed.liked) || !Array.isArray(parsed.ranking)) return fallback;
    if (!["swipe", "rank", "results"].includes(parsed.phase)) parsed.phase = "swipe";
    return parsed;
  } catch {
    return { index: 0, liked: [], ranking: [], phase: "swipe" };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function resetState() {
  state = { index: 0, liked: [], ranking: [], phase: "swipe" };
  saveState();
  showRound("swipe");
  renderCard();
}

function showRound(round) {
  swipeRound.classList.toggle("hidden", round !== "swipe");
  rankRound.classList.toggle("hidden", round !== "rank");
  results.classList.toggle("hidden", round !== "results");
}

function updateProgress() {
  const current = Math.min(state.index + 1, names.length);
  progress.textContent = `Card ${current} of ${names.length} · Kept: ${state.liked.length}`;
}

function renderCard() {
  cardStack.innerHTML = "";

  if (state.index >= names.length) {
    startRankRound();
    return;
  }

  const card = document.createElement("article");
  card.className = "card";
  card.textContent = names[state.index];
  cardStack.appendChild(card);

  enablePointerSwipe(card);
  updateProgress();
}

function swipe(direction) {
  const card = cardStack.querySelector(".card");
  if (!card) return;

  const currentName = names[state.index];
  if (direction === "right") {
    state.liked.push(currentName);
  }

  card.classList.add(direction === "right" ? "swipe-right" : "swipe-left");
  state.index += 1;
  saveState();
  window.setTimeout(renderCard, 180);
}

function enablePointerSwipe(card) {
  let startX = 0;
  let currentX = 0;
  let dragging = false;

  card.addEventListener("pointerdown", (event) => {
    startX = event.clientX;
    dragging = true;
    card.setPointerCapture(event.pointerId);
  });

  card.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    currentX = event.clientX - startX;
    card.style.transform = `translateX(${currentX}px) rotate(${currentX / 18}deg)`;
  });

  card.addEventListener("pointerup", () => {
    if (!dragging) return;
    dragging = false;

    if (currentX > 90) return swipe("right");
    if (currentX < -90) return swipe("left");

    card.style.transform = "";
    currentX = 0;
  });
}

function startRankRound() {
  state.phase = "rank";
  showRound("rank");

  if (!state.ranking.length) {
    state.ranking = [...state.liked];
    saveState();
  }

  if (state.ranking.length === 0) {
    rankList.innerHTML = "<li class='rank-item'>No names kept. Tap reset to try again.</li>";
    finishBtn.disabled = true;
    return;
  }

  finishBtn.disabled = false;
  renderRankList();
}

function moveItem(from, to) {
  if (to < 0 || to >= state.ranking.length) return;
  const [item] = state.ranking.splice(from, 1);
  state.ranking.splice(to, 0, item);
  saveState();
  renderRankList();
}

function renderRankList() {
  rankList.innerHTML = "";

  state.ranking.forEach((name, i) => {
    const li = document.createElement("li");
    li.className = "rank-item";
    li.draggable = true;
    li.dataset.index = String(i);

    const label = document.createElement("span");
    label.className = "drag-handle";
    label.textContent = `${i + 1}. ${name}`;

    const actions = document.createElement("div");
    actions.className = "rank-actions";

    const up = document.createElement("button");
    up.type = "button";
    up.textContent = "↑";
    up.addEventListener("click", () => moveItem(i, i - 1));

    const down = document.createElement("button");
    down.type = "button";
    down.textContent = "↓";
    down.addEventListener("click", () => moveItem(i, i + 1));

    actions.append(up, down);
    li.append(label, actions);
    rankList.appendChild(li);
  });

  enableDesktopDragDrop();
}

function enableDesktopDragDrop() {
  let sourceIndex = null;

  rankList.querySelectorAll(".rank-item").forEach((item) => {
    item.addEventListener("dragstart", (event) => {
      sourceIndex = Number(event.currentTarget.dataset.index);
    });

    item.addEventListener("dragover", (event) => {
      event.preventDefault();
    });

    item.addEventListener("drop", (event) => {
      event.preventDefault();
      const targetIndex = Number(event.currentTarget.dataset.index);
      if (Number.isNaN(sourceIndex) || sourceIndex === targetIndex) return;
      moveItem(sourceIndex, targetIndex);
      sourceIndex = null;
    });
  });
}

function showResults() {
  state.phase = "results";
  showRound("results");
  finalRanking.innerHTML = "";

  state.ranking.forEach((name) => {
    const li = document.createElement("li");
    li.textContent = name;
    finalRanking.appendChild(li);
  });

  saveState();
}

async function copyRanking() {
  const text = state.ranking.map((name, i) => `${i + 1}. ${name}`).join("\n");
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = "Copied!";
  } catch {
    copyBtn.textContent = "Copy failed";
  }

  window.setTimeout(() => {
    copyBtn.textContent = "Copy Ranking";
  }, 1000);
}

leftBtn.addEventListener("click", () => swipe("left"));
rightBtn.addEventListener("click", () => swipe("right"));
finishBtn.addEventListener("click", showResults);
restartBtn.addEventListener("click", resetState);
copyBtn.addEventListener("click", copyRanking);

window.addEventListener("keydown", (event) => {
  if (!swipeRound.classList.contains("hidden")) {
    if (event.key === "ArrowLeft") swipe("left");
    if (event.key === "ArrowRight") swipe("right");
  }
});

if (state.index >= names.length) {
  if (state.phase === "results") {
    showResults();
  } else {
    startRankRound();
  }
} else {
  showRound("swipe");
  renderCard();
}
