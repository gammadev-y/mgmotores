// Login JavaScript file - handles authentication for admin panel

// Supabase configuration
const SUPABASE_URL = 'https://yhqxpepihjeviashxykr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlocXhwZXBpaGpldmlhc2h4eWtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MjcwMTIsImV4cCI6MjA3MjMwMzAxMn0.mKiQSovB35_OO0q016J_LQ8tJkJQQo9gv-mSoJWI7vc';

// Create Supabase client (will be initialized after library loads)
let supabase;

// DOM Elements
const loginButton = document.getElementById('login-button');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginError = document.getElementById('login-error');

// Initialize login page
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Supabase client
  initSupabase();
  
  // Set up event listeners
  setupEventListeners();
  
  // Check if user is already logged in
  checkAuth();
});

// Initialize Supabase client when the library is ready
function initSupabase() {
  if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('Supabase client initialized for login page');
  } else {
    console.log('Waiting for Supabase library to load...');
    // Try again in a moment
    setTimeout(initSupabase, 100);
  }
}

// Set up event listeners
function setupEventListeners() {
  // Login form submission
  loginButton.addEventListener('click', login);
  
  // Allow Enter key to submit form
  document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      login();
    }
  });
}

// Check if user is already authenticated
async function checkAuth() {
  // Wait for Supabase to be initialized
  while (!supabase) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      // User is already logged in, redirect to admin panel
      window.location.href = 'admin.html';
    }
  } catch (error) {
    console.error('Error checking auth:', error);
  }
}

// Login function
async function login() {
  // Wait for Supabase to be initialized
  while (!supabase) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  const email = loginEmail.value;
  const password = loginPassword.value;
  
  // Basic validation
  if (!email || !password) {
    showError('Por favor, preencha todos os campos.');
    return;
  }
  
  try {
    // Show loading state
    loginButton.textContent = 'Autenticando...';
    loginButton.disabled = true;
    
    // Attempt to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });
    
    if (error) throw error;
    
    // Login successful, redirect to admin panel
    window.location.href = 'admin.html';
  } catch (error) {
    showError(error.message);
  } finally {
    // Reset button state
    loginButton.textContent = 'Entrar';
    loginButton.disabled = false;
  }
}

// Show error message
function showError(message) {
  loginError.textContent = message;
  loginError.style.display = 'block';
  
  // Hide error after 5 seconds
  setTimeout(() => {
    loginError.style.display = 'none';
  }, 5000);
}