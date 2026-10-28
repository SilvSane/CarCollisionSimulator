
let timelineOnSeek = null;
let timelineOnPlayPause = null;

function initTimeline() {
  const seek = document.getElementById("timeline-seek");
  const playPauseButton = document.getElementById("play-pause-button");
  const currentTime = document.getElementById("timeline-current-time");
  const totalTime = document.getElementById("timeline-total-time");

  if (!seek || !playPauseButton || !currentTime || !totalTime) {
    console.error("Элементы временной шкалы не найдены");
    return;
  }

  seek.value = "0";
  seek.disabled = true;
  playPauseButton.disabled = true;
  playPauseButton.textContent = "Продолжить";

  currentTime.textContent = "0.00 с";
  totalTime.textContent = "0.00 с";

  seek.oninput = () => {
    if (typeof timelineOnSeek === "function") {
      timelineOnSeek(Number(seek.value) / 1000);
    }
  };

  playPauseButton.onclick = () => {
    if (typeof timelineOnPlayPause === "function") {
      timelineOnPlayPause();
    }
  };
}

function configureTimeline(duration, onSeek, onPlayPause) {
  const seek = document.getElementById("timeline-seek");
  const playPauseButton = document.getElementById("play-pause-button");
  const totalTime = document.getElementById("timeline-total-time");

  if (!seek || !playPauseButton || !totalTime) return;

  timelineOnSeek = onSeek;
  timelineOnPlayPause = onPlayPause;

  seek.min = "0";
  seek.max = "1000";
  seek.step = "1";
  seek.value = "0";
  seek.disabled = false;

  playPauseButton.disabled = false;
  playPauseButton.textContent = "Пауза";
  totalTime.textContent = `${duration.toFixed(2)} с`;
}

function updateTimeline(current, duration, playing) {
  const seek = document.getElementById("timeline-seek");
  const playPauseButton = document.getElementById("play-pause-button");
  const currentTime = document.getElementById("timeline-current-time");

  if (!seek || !playPauseButton || !currentTime) return;

  const percent = duration > 0
    ? Math.max(0, Math.min(100, current / duration * 100))
    : 0;

  currentTime.textContent = `${current.toFixed(2)} с`;

  if (document.activeElement !== seek) {
    seek.value = String(Math.round(percent * 10));
  }

  playPauseButton.textContent = playing ? "Пауза" : "Продолжить";
}
