const apiKey = 'sk_de4fab318945ece1a4f61601e4db1640941af63624a34b69';

const stabilitySlider = document.getElementById("stability");
const similaritySlider = document.getElementById("similarity");
const stabilityValue = document.getElementById("stabilityValue");
const similarityValue = document.getElementById("similarityValue");
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

// Update word count live
textInput.addEventListener("input", () => {
  const words = countWords(textInput.value);
  wordCountDisplay.textContent = `Word count: ${words} / 50`;
  wordCountDisplay.style.color = words > 50 ? "red" : "black";
});

// Change voice select style on change
voiceSelect.addEventListener("change", () => {
  voiceSelect.style.color = "red";
});

// Word counting utility
function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// Submit text and fetch audio from ElevenLabs
async function submitText() {
  const text = textInput.value.trim();
  const wordCount = countWords(text);
  const voiceId = voiceSelect.value;

  if (wordCount === 0) {
    alert("⚠️ Please enter some text.");
    return;
  }

  if (wordCount > 50) {
    alert("⚠️ Please limit your input to 50 words.");
    return;
  }

  const payload = {
    text: text,
    model_id: "eleven_monolingual_v1",
    voice_settings: {
      stability: parseFloat(stabilitySlider.value),
      similarity_boost: parseFloat(similaritySlider.value),
    },
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
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    downloadLink.href = url;
    downloadLink.style.display = 'inline-block';
    downloadLink.download = "speech.mp3";
  } catch (error) {
    alert("❌ Something went wrong: " + error.message);
  } finally {
    loader.style.display = "none";
    generateBtn.disabled = false;
  }
}
