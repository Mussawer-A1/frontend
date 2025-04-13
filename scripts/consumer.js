const backend = "https://photosapp-insta-gca8aafdbygffjbq.canadacentral-01.azurewebsites.net";
let selectedPhoto = null;
let currentRating = 0;

document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'index.html';
    return;
  }
  
  setupStarRating();
  loadPhotos();
});

function setupStarRating() {
  const stars = document.querySelectorAll('.star-rating .star');
  stars.forEach(star => {
    star.addEventListener('click', function() {
      const value = parseInt(this.getAttribute('data-value'));
      currentRating = value;
      
      stars.forEach((s, index) => {
        if (index < value) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
    });
  });
}

function loadPhotos() {
  const token = localStorage.getItem('token');
  
  fetch(`${backend}/photos`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("photos");
    container.innerHTML = "";
    
    if (data.length === 0) {
      container.innerHTML = "<p>No photos found. Check back later!</p>";
      return;
    }
    
    data.forEach(photo => {
      const card = document.createElement("div");
      card.className = "photo-card";
      card.innerHTML = `
        <img src="${photo.blob_url}" alt="${photo.title}"/>
        <div class="photo-info">
          <h3>${photo.title}</h3>
          <p class="photo-meta">${photo.caption}</p>
          <p class="photo-meta"><small>${photo.location || 'Location not specified'}</small></p>
          <div class="photo-actions">
            <button class="btn" onclick="viewPhotoDetails('${photo.title}', '${photo.blob_url}', '${photo.caption}', '${photo.location || ''}')">View Details</button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  })
  .catch(err => {
    console.error("Error loading photos:", err);
  });
}

// Other consumer functions (search, view details, comment, rate)...