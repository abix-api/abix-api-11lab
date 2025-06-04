const apiKey = 'sk_5b41d4b1de6c9b4587e8b7f21a8b844499e40a9be3c98d7a';

const stabilitySlider = document.getElementById("stability");
const similaritySlider = document.getElementById("similarity");
const speedSlider = document.getElementById("speed");
const exaggerationSlider = document.getElementById("exaggeration");

const stabilityValue = document.getElementById("stabilityValue");
const similarityValue = document.getElementById("similarityValue");
const speedValue = document.getElementById("speedValue");
const exaggerationValue = document.getElementById("exaggerationValue");

const textInput = document.getElementById("textInput");
const wordCountDisplay = document.getElementById("wordCount");

const generateBtn = document.getElementById("generateBtn");
const regenerateBtn = document.getElementById("regenerateBtn");
const loader = document.getElementById("loader");
const downloadLink = document.getElementById("downloadLink");
const audioPlayer = document.getElementById("audioPlayer");
const voiceSelect = document.getElementById("voiceSelect");

let lastText = "";
let lastVoice = "";
let regenerateCount = 0;

// Live update slider values
[stabilitySlider, similaritySlider, speedSlider, exaggerationSlider].forEach(slider => {
  slider.oninput = () => {
    document.getElementById(slider.id + "Value").textContent = slider.value;
  };
});

// Word counter live
textInput.addEventListener("input", () => {
  const words = textInput.value.trim().split(/\s+/).filter(Boolean);
  wordCountDisplay.textContent = `Word count: ${words.length} / 50`;
  wordCountDisplay.style.color = words.length > 50 ? "red" : "black";
});

// Change voice selection color
voiceSelect.addEventListener("change", () => {
  voiceSelect.style.color = "red";
});

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

async function generateAudio(isRegenerate = false) {
  const text = textInput.value.trim();
  const voiceId = voiceSelect.value;
  const wordCount = countWords(text);

  if (!isRegenerate) {
    regenerateCount = 0;
    lastText = text;
    lastVoice = voiceId;
  } else {
    if (text !== lastText || voiceId !== lastVoice) {
      regenerateCount = 0;
      lastText = text;
      lastVoice = voiceId;
    } else {
      regenerateCount++;
      if (regenerateCount > 2) {
        alert("You can only regenerate 3 times per input.");
        return;
      }
    }
  }

  if (wordCount === 0) {
    alert("⚠️ Please enter some text.");
    return;
  }
  if (wordCount > 50) {
    alert("⚠️ Please limit your input to 50 words.");
    return;
  }

  loader.style.display = "block";
  generateBtn.disabled = true;
  regenerateBtn.disabled = true;
  downloadLink.style.display = "none";
  audioPlayer.style.display = "none";
  audioPlayer.src = "";

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: parseFloat(stabilitySlider.value),
          similarity_boost: parseFloat(similaritySlider.value),
          style: parseFloat(exaggerationSlider.value),
          speed: parseFloat(speedSlider.value)
        }
      })
    });

    if (!response.ok) throw new Error("API error: " + response.statusText);

    const blob = await response.blob();
    const audioURL = URL.createObjectURL(blob);

    audioPlayer.src = audioURL;
    audioPlayer.style.display = "block";
    downloadLink.href = audioURL;
    downloadLink.style.display = "inline-block";

    

  } catch (err) {
    alert("❌ Error: " + err.message);
  } finally {
    loader.style.display = "none";
    generateBtn.disabled = false;
    regenerateBtn.disabled = false;
  }
}



// Button events
generateBtn.addEventListener("click", () => generateAudio(false));
regenerateBtn.addEventListener("click", () => generateAudio(true));
