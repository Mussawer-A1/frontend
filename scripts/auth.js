const backend = "https://photosapp-insta-gca8aafdbygffjbq.canadacentral-01.azurewebsites.net";

// Make functions globally available
window.showSignUp = function() {
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('signUpSection').style.display = 'flex';
};

window.showLogin = function() {
  document.getElementById('signUpSection').style.display = 'none';
  document.getElementById('loginSection').style.display = 'flex';
};

window.signUp = function() {
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
      redirectToDashboard(data.role || 'consumer'); // Default to consumer if role not specified
    }
  })
  .catch(err => {
    alert(err.error || "Signup failed. Please try again.");
  });
};

window.login = function() {
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
};

window.logout = function() {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
};

function redirectToDashboard(role) {
  if (role === 'consumer') {
    window.location.href = 'consumer.html';
  } else if (role === 'creator') {
    window.location.href = 'creator.html';
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('token');
  
  // Set up event listeners for buttons that exist on this page
  if (document.getElementById('signUpBtn')) {
    document.getElementById('signUpBtn').addEventListener('click', signUp);
  }
  if (document.getElementById('loginBtn')) {
    document.getElementById('loginBtn').addEventListener('click', login);
  }
  if (document.getElementById('showLoginBtn')) {
    document.getElementById('showLoginBtn').addEventListener('click', showLogin);
  }
  if (document.getElementById('showSignUpBtn')) {
    document.getElementById('showSignUpBtn').addEventListener('click', showSignUp);
  }

  // Check authentication status
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Check token expiration (payload.exp is in seconds)
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        return;
      }
      
      // Redirect if valid token exists
      if (payload.role) {
        redirectToDashboard(payload.role);
      }
    } catch (e) {
      console.error("Token validation error:", e);
      localStorage.removeItem('token');
    }
  }
});