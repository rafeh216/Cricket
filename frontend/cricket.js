document.addEventListener("DOMContentLoaded", function () {
  // Scroll to the specific team section if the URL contains a hash
    const hash = window.location.hash;
    if (hash) {
      const targetSection = document.querySelector(hash);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  // Cricket ball animation
  const balls = document.querySelectorAll(".cricket-ball");
  balls.forEach((ball, index) => {
    ball.style.animation = `floatBall ${3 + index}s ease-in-out infinite`;
    ball.style.animationDelay = `${index * 0.5}s`;
  });

  // Get teams and initialize carousel
  getTeams();

  // Tab switching for rankings
  const formatTabs = document.querySelectorAll('.format-tab');
  const rankingContents = document.querySelectorAll('.rankings-content');

  formatTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      const format = this.getAttribute('data-format');

      formatTabs.forEach(t => t.classList.remove('active'));
      rankingContents.forEach(content => content.classList.remove('active'));

      this.classList.add('active');
      const targetRankingContent = document.getElementById(`${format}-rankings`);
      if (targetRankingContent) {
        targetRankingContent.classList.add('active');

        const categoryTabs = targetRankingContent.querySelectorAll('.category-tab');
        const categoryContents = targetRankingContent.querySelectorAll('.category-content');

        categoryTabs.forEach(t => t.classList.remove('active'));
        categoryContents.forEach(content => content.classList.remove('active'));

        const firstCategoryTab = targetRankingContent.querySelector('.category-tab');
        if (firstCategoryTab) {
          firstCategoryTab.classList.add('active');
          const initialCategory = firstCategoryTab.getAttribute('data-category');
          const initialCategoryContent = document.getElementById(`${format}-${initialCategory}`);
          if (initialCategoryContent) {
            initialCategoryContent.classList.add('active');
          }
        }
      }
    });
  });

  rankingContents.forEach(rankingSection => {
    const categoryTabs = rankingSection.querySelectorAll('.category-tab');
    const categoryContents = rankingSection.querySelectorAll('.category-content');

    categoryTabs.forEach(tab => {
      tab.addEventListener('click', function () {
        const category = this.getAttribute('data-category');
        const formatId = this.closest('.rankings-content').id;
        const format = formatId.replace('-rankings', '');

        categoryTabs.forEach(t => t.classList.remove('active'));
        categoryContents.forEach(content => content.classList.remove('active'));

        this.classList.add('active');
        const targetCategoryContent = document.getElementById(`${format}-${category}`);
        if (targetCategoryContent) {
          targetCategoryContent.classList.add('active');
        }
      });
    });
  });

  const initialActiveFormatTab = document.querySelector('.format-tab.active');
  if (initialActiveFormatTab) {
    const initialFormat = initialActiveFormatTab.getAttribute('data-format');
    const initialRankingContent = document.getElementById(`${initialFormat}-rankings`);
    if (initialRankingContent) {
      initialRankingContent.classList.add('active');
      const initialActiveCategoryTab = initialRankingContent.querySelector('.category-tab.active');
      if (initialActiveCategoryTab) {
        const initialCategory = initialActiveCategoryTab.getAttribute('data-category');
        const initialCategoryContent = document.getElementById(`${initialFormat}-${initialCategory}`);
        if (initialCategoryContent) {
          initialCategoryContent.classList.add('active');
        }
      } else {
        const firstCategoryTab = initialRankingContent.querySelector('.category-tab');
        if (firstCategoryTab) {
          firstCategoryTab.classList.add('active');
          const initialCategory = firstCategoryTab.getAttribute('data-category');
          const initialCategoryContent = document.getElementById(`${initialFormat}-${initialCategory}`);
          if (initialCategoryContent) {
            initialCategoryContent.classList.add('active');
          }
        }
      }
    }
  }

  const detailButtons = document.querySelectorAll('.details-button');
  detailButtons.forEach(button => {
    button.addEventListener('click', function () {
      alert("Match Yet To Began");
    });
  });
});

// ===========================
// GET TEAMS + CAROUSEL INIT
// ===========================

const carouselContainer = document.getElementById('carousel-container');

const getTeams = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/team/');
    const teams = res.data;  

    teams.forEach(team => {
      const html = `
        <a href="players.html#${team.team_name.toLowerCase().replace(/\s+/g, '-')}-players" class="carousel-card-link">
          <div class="carousel-card">
            <div class="card-image">
              <div><img src="Flag_of_${team.country}.jpg" alt="${team.country} Flag"></div>
            </div>
            <div class="card-content">
              <h3 class="card-title">${team.team_name}</h3>
              <p class="card-description">
                ${team.description}
              </p>
              <div class="card-stats">
                <span>World Cups: </span>
                <span>ICC Ranking: ${team.odi_ranking}</span>
              </div>
            </div>
          </div>
        </a>
      `;
      carouselContainer.innerHTML += html;      
    });

    initializeCarousel(); 

  } catch (err) {
    console.error('Error fetching teams:', err);
  }
};


function initializeCarousel() {
  const carouselContainers = document.querySelectorAll(".carousel-container");

  carouselContainers.forEach(carouselContainer => {
    const carousel = carouselContainer.querySelector(".carousel");
    const cards = Array.from(carouselContainer.querySelectorAll(".carousel-card"));
    if (!cards.length || !carousel) return;

    const dots = carouselContainer.querySelectorAll(".carousel-dot");
    const leftArrow = carouselContainer.querySelector(".carousel-arrow-left");
    const rightArrow = carouselContainer.querySelector(".carousel-arrow-right");

    const totalCards = cards.length;
    const cardWidth = 380;
    const cardGap = 20;
    let currentIndex = 0;
    let autoSlideTimer;

    function setupInfiniteLoop() {
      const firstCardClone = cards[0].cloneNode(true);
      const lastCardClone = cards[cards.length - 1].cloneNode(true);
      carousel.appendChild(firstCardClone);
      carousel.insertBefore(lastCardClone, carousel.firstChild);

      const updatedCards = Array.from(carouselContainer.querySelectorAll(".carousel-card"));

      updatedCards.forEach(card => {
        card.style.width = `${cardWidth}px`;
        card.style.flexShrink = '0';
        card.style.flexGrow = '0';
        card.style.margin = `0 ${cardGap / 2}px`;
      });

      return updatedCards;
    }

    const updatedCards = setupInfiniteLoop();
    carousel.style.display = 'inline-flex';
    carousel.style.transition = 'transform 0.3s ease';
    currentIndex = 1;

    function updateCarousel(skipAnimation = false) {
      const containerWidth = carouselContainer.offsetWidth;
      const centerPosition = (containerWidth / 2) - (cardWidth / 2);
      const offset = centerPosition - (currentIndex * (cardWidth + cardGap));

      carousel.style.transition = skipAnimation ? 'none' : 'transform 0.3s ease';
      carousel.style.transform = `translateX(${offset}px)`;

      updatedCards.forEach((card, idx) => {
        card.classList.remove("active");
        if (idx === currentIndex) {
          card.classList.add("active");
          card.style.transform = "scale(1.05)";
          card.style.zIndex = "10";
        } else {
          card.style.transform = "scale(1)";
          card.style.zIndex = "1";
        }
      });

      let dotIndex = currentIndex - 1;
      if (dotIndex < 0) dotIndex = totalCards - 1;
      if (dotIndex >= totalCards) dotIndex = 0;

      dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === dotIndex);
      });
    }

    function handleInfiniteLoop() {
      if (currentIndex === 0) {
        setTimeout(() => {
          currentIndex = totalCards;
          updateCarousel(true);
        }, 300);
      } else if (currentIndex === updatedCards.length - 1) {
        setTimeout(() => {
          currentIndex = 1;
          updateCarousel(true);
        }, 300);
      }
    }

    function goToPrevious() {
      currentIndex--;
      updateCarousel();
      handleInfiniteLoop();
      resetAutoSlide();
    }

    function goToNext() {
      currentIndex++;
      updateCarousel();
      handleInfiniteLoop();
      resetAutoSlide();
    }

    function startAutoSlide() {
      stopAutoSlide();
      autoSlideTimer = setInterval(goToNext, 5000);
    }

    function stopAutoSlide() {
      if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        autoSlideTimer = null;
      }
    }

    function resetAutoSlide() {
      stopAutoSlide();
      startAutoSlide();
    }

    if (leftArrow) leftArrow.addEventListener("click", goToPrevious);
    if (rightArrow) rightArrow.addEventListener("click", goToNext);

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        currentIndex = index + 1;
        updateCarousel();
        resetAutoSlide();
      });
    });

    updatedCards.forEach((card, index) => {
      card.addEventListener("click", () => {
        if (index !== currentIndex) {
          currentIndex = index;
          updateCarousel();
          resetAutoSlide();
        }
      });
    });

    carouselContainer.addEventListener("mouseenter", stopAutoSlide);
    carouselContainer.addEventListener("mouseleave", startAutoSlide);

    updateCarousel();
    startAutoSlide();
  });
}

// PLayers data fetch
const container = document.getElementById("country-players-container");

const getPlayers = async (req,res)=>{
  try {
    const res = await axios.get("http://localhost:5000/api/team/player"); // your real API
    const players = res.data;

    // Group players by team_name
    const grouped = {};
    players.forEach(p => {
      if (!grouped[p.team_name]) grouped[p.team_name] = [];
      grouped[p.team_name].push(p);
    });

    // Loop through teams
    Object.entries(grouped).forEach(([team, teamPlayers]) => {
      const section = document.createElement("section");
      section.className = "country-players-section";
      // Fixed ID generation to match the carousel links
      section.id = `${team.toLowerCase().replace(/\s+/g, '-')}-players`;            

      section.innerHTML = `
        <h2 class="country-name-heading" id="${team.toLowerCase().replace(/\s+/g, '-')}-players-heading">${team} Players</h2>
        <div class="player-list">
          ${teamPlayers.map(player => `
            <div class="player-card">
              <div class="player-info">
                <div class="player-picture">
                  <img src="${player.player_name}.jpg" alt="${player.player_name}" />
                </div>
                <h3 class="player-name">${player.player_name}</h3>
              </div>
              <div class="player-stats-table-container">
                <table class="player-stats-table">
                  <thead>
                    <tr>
                      <th>Format</th><th>Matches</th><th>Runs</th><th>Bat Avg</th><th>SR</th>
                      <th>Wickets</th><th>Bowl Avg</th><th>Econ</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${["test", "odi", "t20"].map(format => `
                      <tr>
                        <td>${format.toUpperCase()}</td>
                        <td>${player[`${format}_matches`]}</td>
                        <td>${player[`${format}_runs`]}</td>
                        <td>${player[`${format}_batting_avg`] || "-"}</td>
                        <td>${player[`${format}_strike_rate`] || "-"}</td>
                        <td>${player[`${format}_wickets`]}</td>
                        <td>${player[`${format}_bowling_avg`] || "-"}</td>
                        <td>${player[`${format}_economy`] || "-"}</td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            </div>
          `).join("")}
        </div>
      `;

      container.appendChild(section);
    });

    // After all players are loaded, check if there's a hash in URL and scroll to it
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const targetSection = document.querySelector(hash);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100); // Small delay to ensure DOM is updated
    }

  } catch (err) {
    console.error("Error fetching players:", err);
  }
};

// Only call getPlayers if we're on the players page
if (document.getElementById("country-players-container")) {
  getPlayers();
}

//Fab Four
const fabcontainer = document.getElementById("Fab4-container");

const getFab = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/team/fab4');
    const fabPlayers = response.data;        

    fabPlayers.forEach(fab => {
      const html = `
        <div class="carousel-card">
          <div class="fab-badge">Fab 4</div>
          <div class="card-image">
            <img src="./${fab.player_name.toLowerCase()} fab.jpg" alt="${fab.player_name}">
          </div>
          <div class="card-content">
            <h3 class="card-title">${fab.player_name}</h3>
            <p class="card-description">
              The modern master known for run chases and passion.
            </p>
            <div class="card-stats">
              <span>Test: ${fab.TEST_RUNS}</span>
              <span>ODI: ${fab.odi_runs}</span>
              <span>T20: ${fab.t20_runs}</span>
            </div>
          </div>
        </div>
      `;
      fabcontainer.innerHTML += html;
    });

    initializeCarousel(); 

  } catch (err) {
    console.error('Error fetching Fab 4 players:', err);
  }
};

// Only call getFab if we're on the home page
if (document.getElementById("Fab4-container")) {
  getFab();
}

const currentPage = window.location.href;

// Dynamic Rankings Loading
const loadRankings = async (format, category) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/team/playerrank?format=${format}&category=${category}`);
    const rankings = response.data;
    
    // Find the correct table to update
    const tableBody = document.querySelector(`#${format}-${category} .rankings-table tbody`);
    
    if (!tableBody) {
      console.error(`Table not found for ${format}-${category}`);
      return;
    }
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Populate with new data
    rankings.forEach((player, index) => {
      const row = document.createElement('tr');
      
      // Format position with leading zeros
      const position = String(player.pos).padStart(2, '0');
      
      // Split player name into first and last name
      const nameParts = player.player_name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      
      // Get flag image based on country
      const flagImage = getFlagImage(player.team);
      
      row.innerHTML = `
        <td class="pos">${position}</td>
        <td class="team">
          <img src="${flagImage}" alt="${player.team}" class="team-flag" />
          <span class="team-name">${player.team.toUpperCase()}</span>
        </td>
        <td class="players">
          <span class="player-name">${firstName}</span>
          <span class="player-surname">${lastName.toUpperCase()}</span>
        </td>
        <td class="rating">${player.rating}</td>
      `;
      
      tableBody.appendChild(row);
    });
    
  } catch (error) {
    console.error('Error loading rankings:', error);
  }
};

// Helper function to get flag image based on country
const getFlagImage = (country) => {
  const flagMap = {
    'ENGLAND': 'Flag-England.webp',
    'NEW ZEALAND': 'nz flag1.jpg',
    'AUSTRALIA': 'australia.jpg',
    'INDIA': 'Flag_of_India.svg',
    'SOUTH AFRICA': 'Flag-South-Africa.webp',
    'BANGLADESH': 'Flag_of_Bangladesh.svg.webp',
    'PAKISTAN': 'Flag_of_Pakistan.svg.webp',
    'AFGHANISTAN': 'afg flag.jpg',
    'WEST INDIES': 'West-Indies-Flag.png',
    'SRI LANKA': 'srilanka flag.jpg',
    'NEPAL': 'nepal.jpg'
  };
  
  return flagMap[country.toUpperCase()] || 'default-flag.png';
};

// Load initial rankings when page loads (only if on ranking page)
if (document.querySelector('.rankings-section')) {
  // Load initial data for Test batting (default active tab)
  document.addEventListener('DOMContentLoaded', function() {
    loadRankings('test', 'batting');
  });
  
  // Update the existing tab switching code to load rankings dynamically
  const formatTabs = document.querySelectorAll('.format-tab');
  const rankingContents = document.querySelectorAll('.rankings-content');

  formatTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      const format = this.getAttribute('data-format');

      formatTabs.forEach(t => t.classList.remove('active'));
      rankingContents.forEach(content => content.classList.remove('active'));

      this.classList.add('active');
      const targetRankingContent = document.getElementById(`${format}-rankings`);
      if (targetRankingContent) {
        targetRankingContent.classList.add('active');

        const categoryTabs = targetRankingContent.querySelectorAll('.category-tab');
        const categoryContents = targetRankingContent.querySelectorAll('.category-content');

        categoryTabs.forEach(t => t.classList.remove('active'));
        categoryContents.forEach(content => content.classList.remove('active'));

        const firstCategoryTab = targetRankingContent.querySelector('.category-tab');
        if (firstCategoryTab) {
          firstCategoryTab.classList.add('active');
          const initialCategory = firstCategoryTab.getAttribute('data-category');
          const initialCategoryContent = document.getElementById(`${format}-${initialCategory}`);
          if (initialCategoryContent) {
            initialCategoryContent.classList.add('active');
          }
          // Load rankings for the new format and category
          loadRankings(format, initialCategory);
        }
      }
    });
  });

  rankingContents.forEach(rankingSection => {
    const categoryTabs = rankingSection.querySelectorAll('.category-tab');
    const categoryContents = rankingSection.querySelectorAll('.category-content');

    categoryTabs.forEach(tab => {
      tab.addEventListener('click', function () {
        const category = this.getAttribute('data-category');
        const formatId = this.closest('.rankings-content').id;
        const format = formatId.replace('-rankings', '');

        categoryTabs.forEach(t => t.classList.remove('active'));
        categoryContents.forEach(content => content.classList.remove('active'));

        this.classList.add('active');
        const targetCategoryContent = document.getElementById(`${format}-${category}`);
        if (targetCategoryContent) {
          targetCategoryContent.classList.add('active');
        }
        
        // Load rankings for the selected format and category
        loadRankings(format, category);
      });
    });
  });
}