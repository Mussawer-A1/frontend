const backend = "https://photosapp-insta-gca8aafdbygffjbq.canadacentral-01.azurewebsites.net";

function showSignUp() {
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('signUpSection').style.display = 'flex';
}

function showLogin() {
  document.getElementById('signUpSection').style.display = 'none';
  document.getElementById('loginSection').style.display = 'flex';
}

function signUp() {
  const username = document.getElementById('signUpUsername').value;
  const password = document.getElementById('signUpPassword').value;

  if (!username || !password) {
    alert("Please fill in all fields");
    return;
  }

  fetch(`${backend}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  .then(res => {
    if (!res.ok) {
      return res.json().then(err => { throw err; });
    }
    return res.json();
  })
  .then(data => {
    if (data.token) {
      localStorage.setItem('token', data.token);
      redirectToDashboard(data.role);
    }
  })
  .catch(err => {
    alert(err.error || "Signup failed. Please try again.");
  });
}

function login() {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  fetch(`${backend}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  .then(res => {
    if (!res.ok) {
      return res.json().then(err => { throw err; });
    }
    return res.json();
  })
  .then(data => {
    if (data.token) {
      localStorage.setItem('token', data.token);
      redirectToDashboard(data.role);
    }
  })
  .catch(err => {
    alert(err.error || "Login failed. Please try again.");
  });
}

function redirectToDashboard(role) {
  if (role === 'consumer') {
    window.location.href = 'consumer.html';
  } else if (role === 'creator') {
    window.location.href = 'creator.html';
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
}

// Check if already logged in
document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      redirectToDashboard(payload.role);
    } catch (e) {
      localStorage.removeItem('token');
    }
  }
});