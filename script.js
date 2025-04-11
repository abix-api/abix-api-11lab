const apiKey = 'sk_de4fab318945ece1a4f61601e4db1640941af63624a34b69';

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

async function submitText() {
  const text = document.getElementById('textInput').value.trim();
  const wordCount = countWords(text);
  const voiceId = document.getElementById('voiceSelect').value;
  const downloadLink = document.getElementById('downloadLink');

  if (wordCount > 50) {
    alert("⚠️ Please limit your input to 50 words.");
    return;
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75
        }
      })
    });

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    downloadLink.href = url;
    downloadLink.style.display = 'inline-block';
  } catch (error) {
    alert("❌ Something went wrong: " + error.message);
  }
}

// Make selected voice name appear red after choosing
const voiceSelect = document.getElementById("voiceSelect");
voiceSelect.addEventListener("change", () => {
  voiceSelect.style.color = "red";
});
