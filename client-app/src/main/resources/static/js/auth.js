// Authentication functions
const GATEWAY_BASE_URL = "http://localhost:8080/api";
const AUTH_SERVICE_BASE_URL = "http://localhost:8081"; // direct to auth-service

async function fetchWithFallback(path, options) {
  const urls = [
    `${GATEWAY_BASE_URL}${path}`,
    `${AUTH_SERVICE_BASE_URL}${path.replace(/^\/api/, "")}`,
  ];

  let lastError = null;
  for (const url of urls) {
    try {
      const response = await fetch(url, options);
      // If gateway returns a bad status, don't fallback silently; return it
      return response;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error("Network error");
}

let currentUser = null;
let authToken = null;
let csrfToken = null;

// Get CSRF token
async function getCsrfToken() {
  try {
    const response = await fetchWithFallback(`/auth/csrf`, {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      csrfToken = data.token;
      return csrfToken;
    }
  } catch (error) {
    console.error("Failed to get CSRF token:", error);
  }
  return null;
}

// Login function
async function login(username, password) {
  try {
    await getCsrfToken(); // Get CSRF token first
    const response = await fetchWithFallback(`/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": csrfToken || "",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      authToken = data.token;
      currentUser = {
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role,
      };

      localStorage.setItem("authToken", authToken);
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      window.location.href = "/chat";
    } else {
      const error = await response.text();
      alert("Login failed: " + error);
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Login failed: " + error.message);
  }
}

// Register function
async function register(username, email, password) {
  try {
    await getCsrfToken(); // Get CSRF token first
    const response = await fetchWithFallback(`/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": csrfToken || "",
      },
      credentials: "include",
      body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
      alert("Registration successful! Please login.");
      window.location.href = "/login";
    } else {
      const error = await response.text();
      alert("Registration failed: " + error);
    }
  } catch (error) {
    console.error("Registration error:", error);
    alert("Registration failed: " + error.message);
  }
}

// Logout function
function logout() {
  authToken = null;
  currentUser = null;
  localStorage.removeItem("authToken");
  localStorage.removeItem("currentUser");
  window.location.href = "/";
}

// Check if user is authenticated
function checkAuth() {
  const token = localStorage.getItem("authToken");
  const user = localStorage.getItem("currentUser");

  if (token && user) {
    authToken = token;
    currentUser = JSON.parse(user);
    return true;
  }
  return false;
}

// Initialize authentication on page load
document.addEventListener("DOMContentLoaded", function () {
  // Login form
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      login(username, password);
    });
  }

  // Register form
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      register(username, email, password);
    });
  }

  // Check authentication for protected pages
  if (window.location.pathname === "/chat") {
    if (!checkAuth()) {
      window.location.href = "/login";
    } else {
      // Update user info display
      const userInfo = document.getElementById("userInfo");
      if (userInfo) {
        userInfo.textContent = `Welcome, ${currentUser.username}`;
      }
    }
  }
});
