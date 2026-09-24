const WHATSAPP_NUMBER = "919938348982";

const studentName = document.getElementById("studentName");
const photoInput = document.getElementById("photoInput");
const cardName = document.getElementById("cardName");
const cardPhoto = document.getElementById("cardPhoto");
const photoPlaceholder = document.getElementById("photoPlaceholder");
const miniAvatar = document.getElementById("miniAvatar");
const miniName = document.getElementById("miniName");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const shareBtn = document.getElementById("shareBtn");
const seniorMessage = document.getElementById("seniorMessage");
const charCount = document.getElementById("charCount");
const sendWhatsAppBtn = document.getElementById("sendWhatsAppBtn");
const toast = document.getElementById("toast");
const invitationCard = document.getElementById("invitationCard");

let currentPhotoDataUrl = "";
let toastTimer = null;

function getName() {
  return studentName.value.trim();
}

function displayName(name) {
  return name ? name.toUpperCase() : "YOUR NAME";
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function updateName() {
  const value = getName();
  cardName.textContent = displayName(value);
  miniName.textContent = value || "Your Name";
}

studentName.addEventListener("input", updateName);

photoInput.addEventListener("change", () => {
  const file = photoInput.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    showToast("Please choose an image file.");
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    currentPhotoDataUrl = event.target.result;
    cardPhoto.src = currentPhotoDataUrl;
    cardPhoto.style.display = "block";
    photoPlaceholder.style.display = "none";

    miniAvatar.innerHTML = "";
    const img = document.createElement("img");
    img.src = currentPhotoDataUrl;
    img.alt = "Selected photo";
    miniAvatar.appendChild(img);

    showToast("Photo added to your invitation.");
  };
  reader.readAsDataURL(file);
});

generateBtn.addEventListener("click", () => {
  const name = getName();

  if (!name) {
    showToast("Please enter your name first.");
    studentName.focus();
    return;
  }

  updateName();

  document.getElementById("invitationCard").scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  launchConfetti();
  showToast(`Your invitation is ready, ${name}!`);
});

downloadBtn.addEventListener("click", async () => {
  const name = getName();
  if (!name) {
    showToast("Enter your name before downloading.");
    studentName.focus();
    return;
  }

  if (typeof html2canvas === "undefined") {
    showToast("Card export library did not load. Please check your internet connection.");
    return;
  }

  const originalText = downloadBtn.textContent;
  downloadBtn.textContent = "Preparing card…";
  downloadBtn.disabled = true;

  try {
    const canvas = await html2canvas(invitationCard, {
      scale: Math.min(3, window.devicePixelRatio * 1.5 || 2),
      backgroundColor: "#0a0907",
      useCORS: true,
      allowTaint: false
    });

    const link = document.createElement("a");
    const safeName = name.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "_") || "Fresher";
    link.download = `Parichaya_2026_${safeName}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    showToast("Invitation downloaded successfully.");
  } catch (error) {
    console.error(error);
    showToast("Could not export the card. Please try again.");
  } finally {
    downloadBtn.textContent = originalText;
    downloadBtn.disabled = false;
  }
});

shareBtn.addEventListener("click", async () => {
  const shareData = {
    title: "ପରିଚୟ 2026 — Freshers' 2026",
    text: "Join us at ପରିଚୟ 2026 — Freshers' celebration at Nabakrushna Choudhury College of Teacher Education, Anugola.",
    url: window.location.href
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Page link copied. Share it with your friends!");
    }
  } catch (error) {
    // User cancelled native share; no action needed.
  }
});

seniorMessage.addEventListener("input", () => {
  charCount.textContent = `${seniorMessage.value.length} / 500`;
});

sendWhatsAppBtn.addEventListener("click", () => {
  const name = getName();
  const message = seniorMessage.value.trim();

  if (!name) {
    showToast("Please enter your name first.");
    studentName.focus();
    document.getElementById("create").scrollIntoView({ behavior: "smooth" });
    return;
  }

  if (!message) {
    showToast("Please write a message for your seniors.");
    seniorMessage.focus();
    return;
  }

  const whatsappText =
`🎓 *A Message from a Fresher*

*Name:* ${name}

💌 *Message:*
${message}

— *ପରିଚୟ 2026*
Nabakrushna Choudhury College of Teacher Education, Anugola`;

  const whatsappUrl =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`;

  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

function launchConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");

  const width = canvas.width = window.innerWidth * devicePixelRatio;
  const height = canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.scale(devicePixelRatio, devicePixelRatio);

  const particles = [];
  const symbols = ["✦", "✧", "•"];

  for (let i = 0; i < 110; i++) {
    particles.push({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 120,
      y: window.innerHeight * 0.42,
      vx: (Math.random() - 0.5) * 10,
      vy: -Math.random() * 11 - 4,
      gravity: 0.23 + Math.random() * 0.08,
      size: 6 + Math.random() * 10,
      life: 0,
      maxLife: 90 + Math.random() * 80,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      rotation: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.15
    });
  }

  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach((p) => {
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.vr;

      const alpha = Math.max(0, 1 - p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = "#e7bf73";
      ctx.font = `${p.size}px Georgia`;
      ctx.fillText(p.symbol, 0, 0);
      ctx.restore();
    });

    frame++;
    if (frame < 170) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  draw();
}

window.addEventListener("resize", () => {
  // Canvas is recreated only when confetti is triggered.
});
