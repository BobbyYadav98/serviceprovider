
// index.js
// Unified script for Register, Login, Navbar (profile icon) and Profile page.
// Put <script src="index.js"></script> at end of body on all pages.

// Helper: get saved users array
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}
function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}
function clearCurrentUser() {
  localStorage.removeItem("currentUser");
}

// Update navbar: shows profile icon if logged in, otherwise Register+Login
function updateNavbar() {
  const authLinks = document.getElementById("authLinks");
  if (!authLinks) return; // nothing to do if nav not present

  const user = getCurrentUser();
  if (user) {
    // show only profile icon (link to profile.html)
    authLinks.innerHTML = `
      <a href="profile.html" class="nav-item profile-icon" title="Profile">
        <i class="fa-solid fa-circle-user" aria-hidden="true"></i>
      </a>
    `;
  } else {
    // show register + login (links to pages)
    authLinks.innerHTML = `
      <a href="register.html" class="nav-item">Register</a>
      <a href="login.html" class="nav-item">Login</a>
    `;
  }
}

// Logout (available globally)
function logout() {
  clearCurrentUser();
  updateNavbar();
  // if on profile page, redirect to home
  if (location.pathname.includes("profile.html")) {
    location.href = "index.html";
  }
}
window.logout = logout; // expose for inline use if needed

// Attach mobile menu toggle (if exists)
function attachMenuToggle() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}





// Register form handler (register.html)
function attachRegisterHandler() {
  const registerForm = document.getElementById("registerForm");
  if (!registerForm) return;

  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Using placeholder selectors as in your markup
    const fullName = (registerForm.querySelector('input[placeholder="Full Name"]') || {}).value?.trim() || "";
    const email = (registerForm.querySelector('input[type="email"]') || {}).value?.trim() || "";
    const phone = (registerForm.querySelector('input[placeholder="Phone Number"]') || {}).value?.trim() || "";
    const password = (registerForm.querySelector('input[placeholder="Password"]') || {}).value?.trim() || "";
    const confirmPassword = (registerForm.querySelector('input[placeholder="Confirm Password"]') || {}).value?.trim() || "";

    // Basic validations
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email.");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const users = getUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      alert("An account with this email already exists. Please login.");
      return;
    }

    const newUser = { fullName, email, phone, password };
    users.push(newUser);
    saveUsers(users);

    // Log the user in automatically and redirect to profile
    setCurrentUser(newUser);
    updateNavbar();
    alert("Registration successful! Redirecting to your profile...");
    location.href = "profile.html";
  });
}

// Login form handler (login.html)
function attachLoginHandler() {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = (loginForm.querySelector('input[type="email"]') || {}).value?.trim() || "";
    const password = (loginForm.querySelector('input[type="password"]') || {}).value?.trim() || "";

    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    const users = getUsers();
    // case-insensitive email match
    const validUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (validUser) {
      setCurrentUser(validUser);
      updateNavbar();
      alert(`Welcome back, ${validUser.fullName}!`);
      // Redirect to home so navbar shows the icon there (or go to profile.html if you prefer)
      location.href = "index.html";
    } else {
      alert("Invalid email or password.");
    }
  });
}

// Profile page attachment (profile.html)
function attachProfilePage() {
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  const profilePhone = document.getElementById("profilePhone");
  const logoutBtn = document.getElementById("logoutBtn");

  // If the profile DOM isn't present, nothing to do
  if (!profileName || !profileEmail || !profilePhone) return;

  const currentUser = getCurrentUser();
  if (!currentUser) {
    // not logged in -> send to login or home
    location.href = "login.html";
    return;
  }

  // Fill details
  profileName.textContent = currentUser.fullName || "";
  profileEmail.textContent = currentUser.email || "";
  profilePhone.textContent = currentUser.phone || "";

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      logout();
      // redirect handled inside logout
    });
  }
}

// Run on every page load
document.addEventListener("DOMContentLoaded", () => {
  attachMenuToggle();
  updateNavbar();
  attachRegisterHandler();
  attachLoginHandler();
  attachProfilePage();
});





