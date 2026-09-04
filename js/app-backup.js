let songs = [];
let currentSongIndex = -1;

const audioPlayer = document.getElementById("audioPlayer");

function toggleMenu() {
  document.querySelector(".nav-menu").classList.toggle("active");
}

function showUpload() {
  document.getElementById("uploadModal").style.display = "flex";
}

function closeUpload() {
  document.getElementById("uploadModal").style.display = "none";
}

function showLogin() {
  document.getElementById("loginModal").style.display = "flex";
}

function closeLogin() {
  document.getElementById("loginModal").style.display = "none";
}

document.getElementById("uploadType").addEventListener("change", function () {
  document.getElementById("songOptions").style.display =
    this.value === "song" ? "block" : "none";
});

function selectTheme(theme) {
  document.getElementById("selectedTheme").value = theme;
}

function uploadFile() {
  const input = document.getElementById("fileInput");
  const type = document.getElementById("uploadType").value;
  const message = document.getElementById("uploadMessage");

  if (!input.files.length) {
    message.textContent = "আগে একটি file নির্বাচন করুন।";
    return;
  }

  const file = input.files[0];
  const url = URL.createObjectURL(file);

  if (type === "song") {
    const artist =
      document.getElementById("artistInput").value.trim() || "RD MUSIC";

    let cover = "";
    const coverInput = document.getElementById("coverInput");

    if (coverInput.files.length) {
      cover = URL.createObjectURL(coverInput.files[0]);
    }

    songs.push({
      name: cleanFileName(file.name),
      artist: artist,
      url: url,
      cover: cover,
      theme: document.getElementById("selectedTheme").value
    });

    renderSongs();
  }

  message.textContent = "✓ Upload সফল হয়েছে!";
  input.value = "";
}

function cleanFileName(name) {
  return name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
}

function renderSongs() {
  const box = document.getElementById("songList");

  box.innerHTML = songs.map((song, index) => {
    let cover = "";

    if (song.cover) {
      cover = `<img class="song-cover" src="${song.cover}" alt="Cover">`;
    } else {
      cover = `<div class="song-cover default-cover theme-${song.theme}">🎵</div>`;
    }

    return `
      <div class="song-card">
        ${cover}
        <div class="song-body">
          <h3>${escapeHtml(song.name)}</h3>
          <p>${escapeHtml(song.artist)}</p>
          <button class="play-card-btn" onclick="playSong(${index})">
            ▶ Play
          </button>
        </div>
      </div>
    `;
  }).join("");

  updateEmptyState();
}

function playSong(index) {
  if (!songs[index]) return;

  currentSongIndex = index;
  const song = songs[index];

  audioPlayer.src = song.url;
  audioPlayer.play().catch(() => {});

  document.getElementById("playerTitle").textContent = song.name;
  document.getElementById("playerArtist").textContent = song.artist;

  const cover = document.getElementById("playerCover");

  cover.className = "player-cover";

  if (song.cover) {
    cover.style.backgroundImage = `url("${song.cover}")`;
    cover.style.backgroundSize = "cover";
    cover.style.backgroundPosition = "center";
    cover.textContent = "";
  } else {
    cover.style.backgroundImage = "";
    cover.textContent = "🎵";
    cover.classList.add("theme-" + song.theme);
  }
}

function togglePlay() {
  if (currentSongIndex === -1) {
    if (songs.length) playSong(0);
    return;
  }

  if (audioPlayer.paused) {
    audioPlayer.play();
  } else {
    audioPlayer.pause();
  }
}

function previousSong() {
  if (!songs.length) return;

  currentSongIndex--;

  if (currentSongIndex < 0) {
    currentSongIndex = songs.length - 1;
  }

  playSong(currentSongIndex);
}

function nextSong() {
  if (!songs.length) return;

  currentSongIndex++;

  if (currentSongIndex >= songs.length) {
    currentSongIndex = 0;
  }

  playSong(currentSongIndex);
}

audioPlayer.addEventListener("timeupdate", function () {
  if (!audioPlayer.duration) return;

  const progress =
    (audioPlayer.currentTime / audioPlayer.duration) * 100;

  document.getElementById("progressBar").value = progress;

  document.getElementById("currentTime").textContent =
    formatTime(audioPlayer.currentTime);
});

audioPlayer.addEventListener("loadedmetadata", function () {
  document.getElementById("duration").textContent =
    formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener("ended", function () {
  nextSong();
});

function seekSong() {
  if (!audioPlayer.duration) return;

  const value = document.getElementById("progressBar").value;

  audioPlayer.currentTime =
    (value / 100) * audioPlayer.duration;
}

function changeVolume() {
  audioPlayer.volume =
    document.getElementById("volumeBar").value;
}

function formatTime(seconds) {
  if (!isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);

  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${secs}`;
}

function searchSongs() {
  const input = document.getElementById("searchInput");
  const value = input.value.trim().toLowerCase();
  const sections = document.querySelectorAll("main section:not(.search-area)");
  let found = false;

  sections.forEach(section => {
    const text = section.innerText.toLowerCase();

    if (value === "" || text.includes(value)) {
      section.style.display = "";
      if (value !== "") found = true;
    } else {
      section.style.display = "none";
    }
  });

  let msg = document.getElementById("searchMessage");

  if (!msg) {
    msg = document.createElement("div");
    msg.id = "searchMessage";
    msg.style.textAlign = "center";
    msg.style.padding = "20px";
    msg.style.color = "#fff";
    document.querySelector(".search-area").appendChild(msg);
  }

  if (value !== "" && !found) {
    msg.textContent = "❌ No results found for: " + value;
  } else {
    msg.textContent = "";
  }
}

function login() {
  const username =
    document.getElementById("loginUser").value.trim();

  const password =
    document.getElementById("loginPassword").value;

  const message =
    document.getElementById("loginMessage");

  if (username === "admin" && password === "1234") {
    message.textContent = "✓ Login successful";
  } else {
    message.textContent = "Demo login: admin / 1234";
  }
}

function socialMessage(name) {
  alert(
    name +
    " link এখনো সেট করা হয়নি। পরে আপনার নিজের social media link বসাতে পারবেন।"
  );
}

function updateEmptyState() {
  const empty = document.getElementById("emptySongs");

  if (empty) {
    empty.style.display =
      songs.length ? "none" : "block";
  }
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

renderSongs();
updateEmptyState();
selectTheme("purple");let songs = [];
let currentSongIndex = -1;

console.log("RD Music loaded");

