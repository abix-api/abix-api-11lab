const apiKey = 'sk_de4fab318945ece1a4f61601e4db1640941af63624a34b69';

const stabilitySlider = document.getElementById("stability");
const similaritySlider = document.getElementById("similarity");
const exaggerationSlider = document.getElementById("exaggeration");
const speedSlider = document.getElementById("speed");

const stabilityValue = document.getElementById("stabilityValue");
const similarityValue = document.getElementById("similarityValue");
const exaggerationValue = document.getElementById("exaggerationValue");
const speedValue = document.getElementById("speedValue");

const textInput = document.getElementById("textInput");
const wordCountDisplay = document.getElementById("wordCount");

const loader = document.getElementById("loader");
const downloadLink = document.getElementById("downloadLink");
const generateBtn = document.getElementById("generateBtn");
const voiceSelect = document.getElementById("voiceSelect");

// Update slider labels
stabilitySlider.oninput = () => {
  stabilityValue.textContent = stabilitySlider.value;
};

similaritySlider.oninput = () => {
  similarityValue.textContent = similaritySlider.value;
};

exaggerationSlider.oninput = () => {
  exaggerationValue.textContent = exaggerationSlider.value;
};

speedSlider.oninput = () => {
  speedValue.textContent = speedSlider.value;
};

// Word Count Live
textInput.addEventListener("input", () => {
  const words = textInput.value.trim().split(/\s+/).filter(Boolean);
  wordCountDisplay.textContent = `Word count: ${words.length} / 50`;
  wordCountDisplay.style.color = words.length > 50 ? "red" : "black";
});

// Highlight voice selection
voiceSelect.addEventListener("change", () => {
  voiceSelect.style.color = "red";
});

// Main Submit Function
async function submitText() {
  const text = textInput.value.trim();
  const words = text.split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    alert("⚠️ Please enter some text.");
    return;
  }

  if (words.length > 50) {
    alert("⚠️ Please limit your input to 50 words.");
    return;
  }

  const voiceId = voiceSelect.value;

  const payload = {
    text: text,
    model_id: "eleven_monolingual_v1",
    voice_settings: {
      stability: parseFloat(stabilitySlider.value),
      similarity_boost: parseFloat(similaritySlider.value),
      style_exaggeration: parseFloat(exaggerationSlider.value),
      speed: parseFloat(speedSlider.value)
    }
  };

  loader.style.display = "block";
  generateBtn.disabled = true;
  downloadLink.style.display = "none";

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error("Server error: " + response.statusText);

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    downloadLink.href = url;
    downloadLink.style.display = "inline-block";
    downloadLink.download = "speech.mp3";
  } catch (error) {
    alert("❌ Something went wrong: " + error.message);
  } finally {
    loader.style.display = "none";
    generateBtn.disabled = false;
  }
}
