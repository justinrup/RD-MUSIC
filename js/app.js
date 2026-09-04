





















































let songs = [];
let currentSongIndex = -1;

const audioPlayer = document.getElementById("audioPlayer");

function toggleMenu() {
  const menu = document.querySelector(".nav-menu");
  if (menu) menu.classList.toggle("show");
}

function showUpload() {
  const modal = document.getElementById("uploadModal");
  if (modal) modal.style.display = "flex";
}

function closeUpload() {
  const modal = document.getElementById("uploadModal");
  if (modal) modal.style.display = "none";
}

function showLogin() {
  const modal = document.getElementById("loginModal");
  if (modal) modal.style.display = "flex";
}

function closeLogin() {
  const modal = document.getElementById("loginModal");
  if (modal) modal.style.display = "none";
}


/* =========================
   SEARCH
========================= */

function searchSongs() {

  const input = document.getElementById("searchInput");

  if (!input) {
    alert("Search box পাওয়া যায়নি!");
    return;
  }

  const value = input.value.toLowerCase().trim();

  const sections = document.querySelectorAll("main section");

  let found = false;

  sections.forEach(function(section) {

    if (section.classList.contains("search-area")) {
      return;
    }

    const text = section.textContent.toLowerCase();

    if (value === "" || text.includes(value)) {

      section.style.display = "";

      if (value !== "") {
        found = true;
      }

    } else {

      section.style.display = "none";

    }

  });


  let message = document.getElementById("searchMessage");

  if (!message) {

    message = document.createElement("div");

    message.id = "searchMessage";

    const searchArea = document.querySelector(".search-area");

    if (searchArea) {
      searchArea.appendChild(message);
    }

  }


  if (message) {

    if (value !== "" && !found) {

      message.textContent =
        "❌ No results found for: " + value;

    } else {

      message.textContent = "";

    }

    message.style.textAlign = "center";
    message.style.padding = "15px";
    message.style.color = "#ffffff";
    message.style.fontWeight = "bold";

  }

}


/* =========================
   LOGIN
========================= */

function login() {

  const username =
    document.getElementById("loginUser");

  const password =
    document.getElementById("loginPassword");

  const message =
    document.getElementById("loginMessage");


  if (!username || !password || !message) {
    return;
  }


  if (
    username.value.trim() === "admin" &&
    password.value === "1234"
  ) {

    message.textContent =
      "✓ Login successful";

    message.style.color = "#22c55e";

    setTimeout(function() {
      window.location.href = "admin.html";
    }, 800);

  } else {

    message.textContent =
      "❌ Wrong username or password";

    message.style.color = "#ef4444";

  }

}


/* =========================
   AUDIO PLAYER
========================= */

function playSong(index) {

  if (!songs[index]) {
    return;
  }

  currentSongIndex = index;

  if (audioPlayer) {

    audioPlayer.src = songs[index].url;

    audioPlayer.play();

  }

}


function nextSong() {

  if (songs.length === 0) {
    return;
  }

  currentSongIndex++;

  if (currentSongIndex >= songs.length) {
    currentSongIndex = 0;
  }

  playSong(currentSongIndex);

}


function previousSong() {

  if (songs.length === 0) {
    return;
  }

  currentSongIndex--;

  if (currentSongIndex < 0) {
    currentSongIndex = songs.length - 1;
  }

  playSong(currentSongIndex);

}


function seekSong() {

  if (!audioPlayer || !audioPlayer.duration) {
    return;
  }

  const progress =
    document.getElementById("progressBar");

  if (!progress) {
    return;
  }

  audioPlayer.currentTime =
    (progress.value / 100) *
    audioPlayer.duration;

}


function changeVolume() {

  if (!audioPlayer) {
    return;
  }

  const volume =
    document.getElementById("volumeBar");

  if (volume) {
    audioPlayer.volume = volume.value;
  }

}


function formatTime(seconds) {

  if (!isFinite(seconds)) {
    return "0:00";
  }

  const minutes =
    Math.floor(seconds / 60);

  const secs =
    Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");

  return minutes + ":" + secs;

}


/* =========================
   UPLOAD
========================= */

const uploadType =
  document.getElementById("uploadType");

if (uploadType) {

  uploadType.addEventListener(
    "change",
    function() {

      const songOptions =
        document.getElementById("songOptions");

      if (songOptions) {

        songOptions.style.display =
          this.value === "song"
            ? "block"
            : "none";

      }

    }
  );

}


/* =========================
   AUDIO EVENTS
========================= */

if (audioPlayer) {

  audioPlayer.addEventListener(
    "timeupdate",
    function() {

      const progress =
        document.getElementById("progressBar");

      const currentTime =
        document.getElementById("currentTime");

      const duration =
        document.getElementById("duration");

      if (progress && audioPlayer.duration) {

        progress.value =
          (audioPlayer.currentTime /
           audioPlayer.duration) * 100;

      }

      if (currentTime) {

        currentTime.textContent =
          formatTime(audioPlayer.currentTime);

      }

      if (duration) {

        duration.textContent =
          formatTime(audioPlayer.duration);

      }

    }
  );


  audioPlayer.addEventListener(
    "ended",
    function() {
      nextSong();
    }
  );

}

