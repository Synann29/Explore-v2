import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

  const API_KEY = "AIzaSyDhg6qZlm5dcmMo7d8W-6KkYpzUjNZeZjU"; // Replace with your API key
  const genAI = new GoogleGenerativeAI(API_KEY);

  const btn = document.getElementById("generateBtn");
  const spinner = document.getElementById("btnSpinner");
  const downloadBtn = document.getElementById("downloadBtn");
  const promptInput = document.getElementById("promptInput");
  const aiText = document.getElementById("aiText");
  const aiImage = document.getElementById("aiImage");
  const resultCard = document.getElementById("resultCard");// multiple upload buttons
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileCollectionBtn = document.getElementById("mobile-collection-btn");
  const mobileCollection = document.getElementById("mobile-collection");
  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

let currentImageData = "";

// === Dark/Light Mode Toggle ===
// Check saved theme on load
if (localStorage.getItem("theme") === "dark" || 
   (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.classList.add("dark");
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
} else {
    document.documentElement.classList.remove("dark");
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
}

// Toggle theme on click
themeToggleBtn.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    if (document.documentElement.classList.contains("dark")) {
        themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");
        localStorage.setItem("theme", "dark");
    } else {
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
        localStorage.setItem("theme", "light");
    }
});



  // Mobile menu toggle
mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

mobileCollectionBtn.addEventListener("click", () => {
  mobileCollection.classList.toggle("hidden");
});

  btn.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      alert("Please enter a description before generating.");
      return;
    }


    // Show loading spinner and disable buttons
    spinner.classList.remove("hidden");
    btn.disabled = true;
    downloadBtn.disabled = true;

    aiText.textContent = "";
    aiImage.src = "";
    aiImage.style.display = "none";
    resultCard.style.display = "none";
    currentImageData = "";

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-preview-image-generation",
      });

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
        },
      });

      const parts = result.response.candidates[0].content.parts;

      for (const part of parts) {
        if (part.text) {
        //   aiText.textContent = part.text;
        }
        if (part.inlineData) {
          currentImageData = part.inlineData.data;
          aiImage.src = `data:image/png;base64,${currentImageData}`;
          aiImage.style.display = "block";
          downloadBtn.disabled = false;
        }
      }
      resultCard.style.display = "block";
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image. Check console for details.");
    } finally {
      spinner.classList.add("hidden");
      btn.disabled = false;
    }
  });

  // Download functionality
  downloadBtn.addEventListener("click", () => {
    if (!currentImageData) return;

    const link = document.createElement("a");
    link.href = `data:image/png;base64,${currentImageData}`;
    link.download = "generated-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // Allow Enter key to trigger generate
  promptInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      btn.click();
    }
  });





function updateAuthUI() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const loginBtn = document.getElementById("loginBtn");
    const loginBtnMobile = document.getElementById("loginBtn-mobile");
    const profileBtn = document.getElementById("profileBtn");
    const profileBtnMobile = document.getElementById("profileBtn-mobile");
    const uploadBtnDesktop = document.getElementById("uploadBtnDesktop");
    const uploadBtnMobile = document.getElementById("uploadBtnMobile");

    if (isLoggedIn) {
        if (loginBtn) loginBtn.classList.add("hidden");
        if (loginBtnMobile) loginBtnMobile.classList.add("hidden");
        if (profileBtn) profileBtn.classList.remove("hidden");
        if (profileBtnMobile) profileBtnMobile.classList.remove("hidden");
        if (uploadBtnDesktop) uploadBtnDesktop.classList.remove("hidden");
        if (uploadBtnMobile) uploadBtnMobile.classList.remove("hidden");
    } else {
        if (loginBtn) loginBtn.classList.remove("hidden");
        if (loginBtnMobile) loginBtnMobile.classList.remove("hidden");
        if (profileBtn) profileBtn.classList.add("hidden");
        if (profileBtnMobile) profileBtnMobile.classList.add("hidden");
        if (uploadBtnDesktop) uploadBtnDesktop.classList.add("hidden");
        if (uploadBtnMobile) uploadBtnMobile.classList.add("hidden");
    }
}

// Handles the registration form submission
function handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const username = form.querySelector("input[type='text']").value;
    const password = form.querySelector("input[type='password']").value;
    
    if (!username || !password) {
        alert("Please fill out all fields.");
        return;
    }

    if (localStorage.getItem("username") === username) {
        alert("This username is already taken. Please choose another.");
        return;
    }

    localStorage.setItem("username", username);
    localStorage.setItem("password", password);

    alert("Registration successful! Please log in.");
    const authContainer = document.getElementById('auth-container');
    if (authContainer) authContainer.classList.remove('right-panel-active');
}

// Handles the login form submission
function handleLogin(event) {
    event.preventDefault();
    const form = event.target; 
    const loginUsername = form.querySelector("input[type='text']").value;
    const loginPassword = form.querySelector("input[type='password']").value;

    const authModal = document.getElementById("authModal");
    const usernameLogin = localStorage.getItem("username");
    const passwordLogin = localStorage.getItem("password");

    if (loginUsername === usernameLogin && loginPassword === passwordLogin) {
        localStorage.setItem("isLoggedIn", "true");
        updateAuthUI();
        alert("Login successful!");
        if (authModal) authModal.classList.remove('is-active');
    } else {
        alert("Invalid username or password");
    }
}

// Handles the logout process
function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    updateAuthUI();
    alert("You have been logged out.");
}

// Event listeners for the entire page
document.addEventListener('DOMContentLoaded', function() {
    // ... (rest of your existing code remains the same)

    // DOM Elements
    const gallery = document.querySelector('.gallery');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileCollectionBtn = document.getElementById('mobile-collection-btn');
    const mobileCollection = document.getElementById('mobile-collection');
    const themeToggleBtn = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");
    const themeToggleMobileBtn = document.getElementById("theme-toggle-mobile");
    const themeIconMobile = document.getElementById("theme-icon-mobile");
    const profileBtn = document.getElementById("profileBtn");
    const profileBtnMobile = document.getElementById("profileBtn-mobile");
    const loginBtn = document.getElementById('loginBtn');
    const loginBtnMobile = document.getElementById('loginBtn-mobile');
    const authModal = document.getElementById('authModal');
    const closeModalBtn = document.getElementById('closeModal');
    const authContainer = document.getElementById('auth-container');
    const signInBtn = document.getElementById('signInBtn');
    const signUpBtn = document.getElementById('signUpBtn');
    const mobileAuthForm = document.getElementById("mobileAuthForm");
    const showSignupMobileBtn = document.getElementById('showSignupMobile');
    const showLoginMobileBtn = document.getElementById('showLoginMobile');

    // Select all forms by their new IDs
    const desktopLoginForm = document.getElementById("desktop-login-form");
    const desktopRegisterForm = document.getElementById("desktop-register-form");
    const mobileLoginForm = document.getElementById("mobile-login-form");
    const mobileSignupForm = document.getElementById("mobile-signup-form");
    
    // Update UI based on login status
    updateAuthUI();

    // 💡 NEW: Function to apply the theme from localStorage
    const applyTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
            if (themeIcon) themeIcon.classList.replace("fa-sun", "fa-moon");
            if (themeIconMobile) themeIconMobile.classList.replace("fa-sun", "fa-moon");
        } else {
            document.documentElement.classList.remove('dark');
            if (themeIcon) themeIcon.classList.replace("fa-moon", "fa-sun");
            if (themeIconMobile) themeIconMobile.classList.replace("fa-moon", "fa-sun");
        }
    };

    // 💡 NEW: Apply the saved theme on page load
    applyTheme();

    // 💡 UPDATED: Theme toggle logic for both desktop and mobile
    const toggleTheme = () => {
        const isDark = document.documentElement.classList.toggle("dark");
        if (isDark) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
        applyTheme(); // Call the function to update icons
    };

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", toggleTheme);
    }
    if (themeToggleMobileBtn) {
        themeToggleMobileBtn.addEventListener("click", toggleTheme);
    }

    // Mobile menu
    mobileMenuBtn?.addEventListener('click', () => mobileMenu?.classList.toggle('hidden'));
    mobileCollectionBtn?.addEventListener('click', () => mobileCollection?.classList.toggle('hidden'));

    // Modal open/close
    const openModal = () => {
        authModal?.classList.add('is-active');
        if (window.innerWidth <= 768) {
            authContainer?.classList.add('hidden');
            mobileAuthForm?.classList.remove('hidden');
        } else {
            authContainer?.classList.remove('hidden');
            mobileAuthForm?.classList.add('hidden');
        }
    };
    
    const closeModal = () => authModal?.classList.remove('is-active');
    loginBtn?.addEventListener('click', openModal);
    loginBtnMobile?.addEventListener('click', openModal);
    closeModalBtn?.addEventListener('click', closeModal);
    authModal?.addEventListener('click', e => { if (e.target === authModal) closeModal(); });

    // Form panel animation
    signUpBtn?.addEventListener('click', () => authContainer?.classList.add('right-panel-active'));
    signInBtn?.addEventListener('click', () => authContainer?.classList.remove('right-panel-active'));

    // Logout
    profileBtn?.addEventListener('click', handleLogout);
    profileBtnMobile?.addEventListener('click', handleLogout);

    // Attach event listeners to all forms
    if (desktopLoginForm) desktopLoginForm.addEventListener('submit', handleLogin);
    if (desktopRegisterForm) desktopRegisterForm.addEventListener('submit', handleRegister);
    if (mobileLoginForm) mobileLoginForm.addEventListener('submit', handleLogin);
    if (mobileSignupForm) mobileSignupForm.addEventListener('submit', handleRegister);

    // Mobile form toggles
    showSignupMobileBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        mobileLoginForm?.classList.add('hidden');
        mobileSignupForm?.classList.remove('hidden');
    });

    showLoginMobileBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        mobileSignupForm?.classList.add('hidden');
        mobileLoginForm?.classList.remove('hidden');
    });

    // INITIAL IMAGE FETCH
    getImages("random");
});


