





















































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
  const song = songs[index];

  if (!song) {
    console.error("Song not found:", index);
    return;
  }

  console.log("Playing song:", song);

  let audioURL = song.url;

  if (!audioURL && song.file instanceof Blob) {
    audioURL = URL.createObjectURL(song.file);
    song.url = audioURL;
  }

  if (!audioURL) {
    alert("Audio file পাওয়া যায়নি");
    console.error("No audio file:", song);
    return;
  }

  if (!audioPlayer) {
    audioPlayer = document.getElementById("audioPlayer");
  }

  if (!audioPlayer) {
    audioPlayer = document.createElement("audio");
    audioPlayer.id = "audioPlayer";
    audioPlayer.controls = true;
    audioPlayer.style.width = "100%";
    document.body.appendChild(audioPlayer);
  }

  audioPlayer.src = audioURL;
  audioPlayer.load();

  const playPromise = audioPlayer.play();

  if (playPromise !== undefined) {
    playPromise.catch(function(error) {
      console.error("Audio play error:", error);
      alert("Song play হচ্ছে না। Browser console-এ error দেখুন।");
    });
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
   MEDIA UPLOAD
========================= */

function selectTheme(theme) {

  const selectedTheme =
    document.getElementById("selectedTheme");

  if (selectedTheme) {
    selectedTheme.value = theme;
  }

  document.querySelectorAll(".theme").forEach(function(btn) {
    btn.classList.remove("selected");
  });

  const selectedButton =
    document.querySelector(".theme." + theme);

  if (selectedButton) {
    selectedButton.classList.add("selected");
  }
}


function uploadFile() {

  const type =
    document.getElementById("uploadType")?.value;

  const fileInput =
    document.getElementById("fileInput");

  const message =
    document.getElementById("uploadMessage");

  if (!fileInput || !message) {
    return;
  }

  const file = fileInput.files[0];

  if (!file) {
    message.textContent = "❌ Please choose a file first.";
    message.style.color = "#ef4444";
    return;
  }

  const artist =
    document.getElementById("artistInput")?.value.trim() || "";

  const coverInput =
    document.getElementById("coverInput");

  const coverFile =
    coverInput?.files[0] || null;

  const theme =
    document.getElementById("selectedTheme")?.value || "purple";

  message.textContent = "⏳ Uploading...";
  message.style.color = "#ffffff";

  const request =
    indexedDB.open("RDMusicDB", 3);

  request.onupgradeneeded = function(e) {

    const db = e.target.result;

    if (!db.objectStoreNames.contains("songs")) {
      db.createObjectStore("songs", {
        keyPath: "id",
        autoIncrement: true
      });
    }

    if (!db.objectStoreNames.contains("media")) {
      db.createObjectStore("media", {
        keyPath: "id",
        autoIncrement: true
      });
    }
  };

  request.onerror = function() {

    console.error(
      "Database error:",
      request.error
    );

    message.textContent =
      "❌ Database error: " +
      (request.error?.message || "Unknown error");

    message.style.color = "#ef4444";
  };

  request.onsuccess = function(e) {

    const db = e.target.result;

    let storeName =
      type === "song" ? "songs" : "media";

    const tx =
      db.transaction(storeName, "readwrite");

    const store =
      tx.objectStore(storeName);

    let data;

    if (type === "song") {

      data = {
        name: file.name,
        artist: artist,
        category: "Other",
        theme: theme,
        file: file,
        cover: coverFile,
        addedAt: Date.now()
      };

    } else {

      data = {
        type: type,
        title: file.name,
        file: file,
        addedAt: Date.now()
      };
    }

    const addRequest =
      store.add(data);

    addRequest.onerror = function() {

      console.error(
        "Upload error:",
        addRequest.error
      );

      message.textContent =
        "❌ Upload failed: " +
        (addRequest.error?.message || "Unknown error");

      message.style.color = "#ef4444";
    };

    tx.oncomplete = function() {

      message.textContent =
        "✅ Upload successful!";

      message.style.color = "#22c55e";

      fileInput.value = "";

      if (coverInput) {
        coverInput.value = "";
      }

      const artistInput =
        document.getElementById("artistInput");

      if (artistInput) {
        artistInput.value = "";
      }

      setTimeout(function() {
        closeUpload();
      }, 1000);
    };

    tx.onerror = function() {

      message.textContent =
        "❌ Upload failed.";

      message.style.color = "#ef4444";
    };
  };
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


/* =========================
   FIREBASE PHONE OTP LOGIN
========================= */

let confirmationResult = null;
let recaptchaVerifier = null;

function sendOTP() {
  const phone = document.getElementById("phoneNumber");
  const message = document.getElementById("loginMessage");

  if (!phone || !message) return;

  const phoneNumber = phone.value.trim();

  if (!/^\+91\d{10}$/.test(phoneNumber)) {
    message.textContent = "❌ Enter a valid Indian phone number";
    message.style.color = "#ef4444";
    return;
  }

  if (!recaptchaVerifier) {
    recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      { size: "normal" }
    );
  }

  firebase.auth().signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
    .then(function(result) {
      confirmationResult = result;

      document.getElementById("otpCode").style.display = "block";
      document.getElementById("verifyOTPBtn").style.display = "block";

      message.textContent = "✅ OTP sent";
      message.style.color = "#22c55e";
    })
    .catch(function(error) {
      message.textContent = "❌ " + error.message;
      message.style.color = "#ef4444";
    });
}

function verifyOTP() {
  const otp = document.getElementById("otpCode").value.trim();
  const message = document.getElementById("loginMessage");

  if (!confirmationResult) {
    message.textContent = "❌ Send OTP first";
    message.style.color = "#ef4444";
    return;
  }

  confirmationResult.confirm(otp)
    .then(function() {
      message.textContent = "✓ Login successful";
      message.style.color = "#22c55e";

      setTimeout(function() {
        window.location.href = "admin.html";
      }, 800);
    })
    .catch(function() {
      message.textContent = "❌ Wrong OTP";
      message.style.color = "#ef4444";
    });
}

/* EMAIL LOGIN */
function emailLogin() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const message = document.getElementById("loginMessage");

  if (!email || !password) {
    message.textContent = "❌ Email and password দিন";
    message.style.color = "#ef4444";
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(function() {
      message.textContent = "✓ Login successful";
      message.style.color = "#22c55e";

      setTimeout(function() {
        window.location.href = "admin.html";
      }, 800);
    })
    .catch(function(error) {
      message.textContent = "❌ " + error.message;
      message.style.color = "#ef4444";
    });
}

function resetPassword() {
  const email = document.getElementById("loginEmail").value.trim();
  const message = document.getElementById("loginMessage");

  if (!email) {
    message.textContent = "❌ আগে Email লিখুন";
    message.style.color = "#ef4444";
    return;
  }

  auth.sendPasswordResetEmail(email)
    .then(function() {
      message.textContent = "✓ Password reset email পাঠানো হয়েছে";
      message.style.color = "#22c55e";
    })
    .catch(function(error) {
      message.textContent = "❌ " + error.message;
      message.style.color = "#ef4444";
    });
}

/* =========================
   LOAD SONGS FROM ADMIN
   ALBUM COVER + CATEGORY
========================= */

function loadAdminSongs() {
  const request = indexedDB.open("RDMusicDB", 3);

      request.onupgradeneeded = function(e) {
        const db = e.target.result;

        if (!db.objectStoreNames.contains("songs")) {
          db.createObjectStore("songs", {
            keyPath: "id",
            autoIncrement: true
          });
        }

        if (!db.objectStoreNames.contains("media")) {
          db.createObjectStore("media", {
            keyPath: "id",
            autoIncrement: true
          });
        }
      };

      request.onerror = function() {
        console.error("RDMusicDB error:", request.error);
      };

  request.onsuccess = function(e) {
    const db = e.target.result;

    if (!db.objectStoreNames.contains("songs")) {
      return;
    }

    const tx = db.transaction("songs", "readonly");
    const store = tx.objectStore("songs");
    const getAll = store.getAll();

    getAll.onsuccess = function() {
      songs = getAll.result || [];
      displayAdminSongs();
    };
  };

  request.onerror = function() {
    console.log("Could not load songs");
  };
}

function displayAdminSongs() {
  const songList = document.getElementById("songList");

  if (!songList) {
    return;
  }

  songList.innerHTML = "";

  if (songs.length === 0) {
    return;
  }

  songs.forEach(function(song, index) {

    const card = document.createElement("div");
    card.className = "song-card";

    let coverURL = "";

    if (song.cover) {
      coverURL = URL.createObjectURL(song.cover);
    }

    card.innerHTML = `
      <div class="song-cover">
        ${
          coverURL
            ? `<img src="${coverURL}" alt="Album Cover">`
            : `<div class="default-cover">🎵</div>`
        }
      </div>

      <div class="song-info">
        <h3>${song.name || "Unknown Song"}</h3>
        <p>${song.artist || "Unknown Artist"}</p>

        ${
          song.category
            ? `<span class="song-category">${song.category}</span>`
            : ""
        }
      </div>

      <div class="song-actions">
        <button type="button" onclick="playSong(${index})">
          ▶ Play
        </button>

        <button type="button" onclick="deleteSong(${index})">
          🗑️ Delete
        </button>
      </div>
    `;

    songList.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", function() {
  loadAdminSongs();
});


/* =========================
   RD MUSIC - PICTURES
========================= */

function loadPictures() {
  const list = document.getElementById("pictureList");
  if (!list) return;

  const request = indexedDB.open("RDMusicDB", 3);

      request.onupgradeneeded = function(e) {
        const db = e.target.result;

        if (!db.objectStoreNames.contains("songs")) {
          db.createObjectStore("songs", {
            keyPath: "id",
            autoIncrement: true
          });
        }

        if (!db.objectStoreNames.contains("media")) {
          db.createObjectStore("media", {
            keyPath: "id",
            autoIncrement: true
          });
        }
      };

      request.onerror = function() {
        console.error("RDMusicDB error:", request.error);
      };

  request.onsuccess = function(e) {
    const db = e.target.result;

    if (!db.objectStoreNames.contains("media")) {
      list.innerHTML = "<p>No pictures uploaded yet.</p>";
      return;
    }

    const tx = db.transaction("media", "readonly");
    const store = tx.objectStore("media");
    const getAll = store.getAll();

    getAll.onsuccess = function() {
      const pictures = getAll.result.filter(item => item.type === "picture");

      if (!pictures.length) {
        list.innerHTML = "<p>No pictures uploaded yet.</p>";
        return;
      }

      list.innerHTML = "";

      pictures.reverse().forEach(item => {
        const card = document.createElement("div");
        card.className = "media-card";

        const img = document.createElement("img");
        img.alt = item.title || "Picture";
        img.loading = "lazy";

        if (item.file instanceof Blob) {
          img.src = URL.createObjectURL(item.file);
        }

        const title = document.createElement("h3");
        title.textContent = item.title || "Untitled";

        card.appendChild(img);
        card.appendChild(title);
        list.appendChild(card);
      });
    };
  };
}

document.addEventListener("DOMContentLoaded", loadPictures);




/* =========================
   THEME
========================= */

function selectTheme(theme) {

  const selectedTheme =
    document.getElementById("selectedTheme");

  if (selectedTheme) {
    selectedTheme.value = theme;
  }

  document.querySelectorAll(".theme").forEach(function(button) {
    button.classList.remove("selected");
  });

  document
    .querySelectorAll(".theme")
    .forEach(function(button) {

      if (button.classList.contains(theme)) {
        button.classList.add("selected");
      }

    });

}


/* =========================
   UPLOAD FILE
========================= */

document.addEventListener("DOMContentLoaded", function() {

  selectTheme("purple");

});


/* =========================
   DELETE SONG
========================= */

function deleteSong(index) {
  const song = songs[index];

  if (!song) {
    alert("Song পাওয়া যায়নি");
    return;
  }

  const name = song.name || song.title || "এই গান";

  if (!confirm('"' + name + '" Delete করতে চান?')) {
    return;
  }

  const request = indexedDB.open("RDMusicDB", 3);

  request.onsuccess = function(e) {
    const db = e.target.result;

    const tx = db.transaction("songs", "readwrite");
    const store = tx.objectStore("songs");

    tx.oncomplete = function() {
      if (song.url && song.url.startsWith("blob:")) {
        URL.revokeObjectURL(song.url);
      }

      songs.splice(index, 1);
      displayAdminSongs();

      alert("Song Delete হয়েছে ✅");
    };

    tx.onerror = function() {
      console.error("Delete error:", tx.error);
      alert("Song Delete করা যায়নি");
    };

    if (song.id === undefined || song.id === null) {
      alert("এই গানটির ID পাওয়া যায়নি");
      return;
    }

    store.delete(song.id);
  };

  request.onerror = function() {
    alert("Database খুলতে সমস্যা হয়েছে");
  };
}
