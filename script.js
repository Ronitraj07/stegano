// Backend URL
const BASE_URL = "https://6148761c-de82-4979-ad37-6c30b37d924c-00-327b08h6rrqii.sisko.replit.dev";

// ✅ Tab Switching
document.querySelectorAll(".tab-btn").forEach(button => {
    button.addEventListener("click", () => {
        const tabName = button.getAttribute("data-tab");
        document.querySelectorAll(".tab-content").forEach(content => {
            content.classList.remove("active");
        });
        document.getElementById(tabName).classList.add("active");

        // Active button highlight
        document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
    });
});

// ✅ Dark Mode Toggle
document.getElementById("darkModeToggle").addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");
});

// ✅ Handle Image Steganography Encoding
async function encodeImage() {
    const fileInput = document.getElementById("imageInput");
    const messageInput = document.getElementById("messageInputImage");

    if (!fileInput.files.length) {
        alert("Please upload an image.");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
    formData.append("message", messageInput.value || "");

    try {
        const response = await fetch(`${BASE_URL}/encode/image`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) throw new Error("Image Encoding Failed!");

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        previewEncodedFile(url, "encoded_image.png", "encodedImageContainer", "encodedImage", "downloadImage");
    } catch (error) {
        alert(error.message);
    }
}

// ✅ Handle Image Steganography Decoding
async function decodeImage() {
    const fileInput = document.getElementById("decodeImageInput");

    if (!fileInput.files.length) {
        alert("Please upload an image.");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
        const response = await fetch(`${BASE_URL}/decode/image`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById("decodedImageText").innerText = "Decoded Message: " + data.message;
        } else {
            throw new Error(data.error || "Image Decoding Failed!");
        }
    } catch (error) {
        alert(error.message);
    }
}

// ✅ Handle Video Steganography Encoding
async function encodeVideo() {
    const fileInput = document.getElementById("videoInput");
    const messageInput = document.getElementById("messageInputVideo");
    const videoContainer = document.getElementById("encodedVideoContainer");
    const videoPlayer = document.getElementById("encodedVideo"); 
    const downloadLink = document.getElementById("downloadVideo"); 

    if (!fileInput.files.length) {
        alert("Please upload a video.");
        return;
    }
    
    const formData = new FormData(); 
    formData.append("file", fileInput.files[0]);  
    formData.append("message", messageInput.value || "");

    console.log("📡 Sending video:", fileInput.files[0].name);
    console.log("📡 Sending message:", messageInput.value);

    try {
        const response = await fetch("http://localhost:5000/encode/video", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Video Encoding Failed!");
        }

        const data = await response.json();
        console.log("✅ Video Encoding Response:", data);

        // Update UI to display encoded video
        videoContainer.style.display = "block";
        videoPlayer.src = data.encoded_video_url;
        videoPlayer.load();

        // Update download link
        downloadLink.href = data.encoded_video_url;
        downloadLink.style.display = "block";

        alert("Video encoded successfully!");

    } catch (error) {
        console.error("🔥 Video Encoding Error:", error);
        alert(error.message);
    }
}

// ✅ Handle Video Steganography Decoding
async function decodeVideo() {
    const fileInput = document.getElementById("decodeVideoInput");

    if (!fileInput.files.length) {
        alert("Please upload a video.");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
        const response = await fetch(`${BASE_URL}/decode/video`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById("decodedVideoText").innerText = "Decoded Message: " + data.message;
        } else {
            throw new Error(data.error || "Video Decoding Failed!");
        }
    } catch (error) {
        alert(error.message);
    }
}

// ✅ Ciphertext Encryption
async function encryptText() {
    const messageInput = document.getElementById("cipherInput").value;

    if (!messageInput.trim()) {
        alert("Please enter text.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/encrypt/text`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: messageInput }),
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById("encryptedTextResult").innerText = "Encrypted Text: " + data.encrypted;
        } else {
            throw new Error(data.error || "Encryption Failed!");
        }
    } catch (error) {
        alert(error.message);
    }
}

// ✅ Ciphertext Decryption
async function decryptText() {
    const encryptedText = document.getElementById("decryptInput").value;

    if (!encryptedText.trim()) {
        alert("Please enter the encrypted text.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/decrypt/text`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ encrypted: encryptedText }),
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById("decryptedTextResult").innerText = "Decrypted Text: " + data.decrypted;
        } else {
            throw new Error(data.error || "Decryption Failed!");
        }
    } catch (error) {
        alert(error.message);
    }
}

// ✅ Preview & Download for Encoded Files (Image/Video)
function previewEncodedFile(url, filename, containerId, previewId, downloadId) {
    const container = document.getElementById(containerId);
    const preview = document.getElementById(previewId);
    const downloadLink = document.getElementById(downloadId);

    container.style.display = "block";
    preview.src = url;
    downloadLink.style.display = "inline";
    downloadLink.href = url;
    downloadLink.download = filename;
}

// ✅ Event Listeners for Forms
document.getElementById("encodeImageForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    await encodeImage();
});

document.getElementById("decodeImageForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    await decodeImage();
});

document.getElementById("encodeVideoForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    await encodeVideo();
});

document.getElementById("decodeVideoForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    await decodeVideo();
});

document.getElementById("encryptTextForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    await encryptText();
});

document.getElementById("decryptTextForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    await decryptText();
});
