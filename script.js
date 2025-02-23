const navbarToggle = document.getElementById('navbar-toggle');
const mobileMenu = document.getElementById('mobile-menu');

navbarToggle.addEventListener('click', () => {
    // Toggle the 'hidden' class to show/hide the menu
    mobileMenu.classList.toggle('hidden');
});

let activeSlide = 1;
const totalSlides = 3;
const sliderTrack = document.getElementById('sliderTrack');
const dots = document.querySelectorAll('.dot');

function showSlide(n) {
    if (n < 1) n = totalSlides;
    if (n > totalSlides) n = 1;
    activeSlide = n;
    sliderTrack.style.transform = 'translateX(-' + (activeSlide - 1) * 100 + '%)';
    updateDots();
}

function prevSlide() {
    showSlide(activeSlide - 1);
}
function nextSlide() {
    showSlide(activeSlide + 1);
}
function goToSlide(n) {
    showSlide(n);
}

function updateDots() {
    dots.forEach((dot, index) => {
        if (index === activeSlide - 1) {
            dot.classList.remove('bg-gray-200');
            dot.classList.add('bg-[#FF4D8D]');
        } else {
            dot.classList.remove('bg-[#FF4D8D]');
            dot.classList.add('bg-gray-200');
        }
    });
}

// Initialize
updateDots();


document.addEventListener('DOMContentLoaded', function () {
    const navbarToggle = document.getElementById('navbar-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    navbarToggle.addEventListener('click', function () {
        mobileMenu.classList.toggle('hidden');
    });
});


const textForm = document.getElementById("textForm");
const voiceForm = document.getElementById("voiceForm");
const textInput = document.getElementById("textInput");
const stepContainer = document.getElementById("stepContainer");
const reportContainer = document.getElementById("reportContainer");
const reportFrame = document.getElementById("reportFrame");

let sessionId = "doctor123"; // Maintain session across requests

// 📌 Handle Step-by-Step Text Input
textForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const text = textInput.value.trim();
    if (!text) {
        alert("Please enter details!");
        return;
    }

    const requestData = { sessionId, text };

    try {
        const response = await fetch("http://localhost:5000/generate-from-text", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData),
        });

        const data = await response.json();
        if (data.report) {
            reportContainer.classList.remove("hidden");
            reportFrame.srcdoc = data.report; // Render HTML report
        } else {
            stepContainer.innerText = data.message; // Move to next step
            textInput.value = "";
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Server error! Try again.");
    }
});

// 🎤 Handle Voice Input
voiceForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const voiceFile = document.getElementById("voiceInput").files[0];

    if (!voiceFile) {
        alert("Please select a voice file (MP3)!");
        return;
    }

    const formData = new FormData();
    formData.append("sessionId", sessionId);
    formData.append("voice", voiceFile);

    try {
        const response = await fetch("http://localhost:5000/generate-from-voice", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        if (data.report) {
            reportContainer.classList.remove("hidden");
            reportFrame.srcdoc = data.report; // Render HTML report
        } else {
            stepContainer.innerText = data.message;
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Server error! Try again.");
    }
});
