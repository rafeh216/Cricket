document.addEventListener("DOMContentLoaded", function () {
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
        <a href="players.html#${team.team_name.toLowerCase().replace(/\s/g, '-')}-players" class="carousel-card-link">
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

    initializeCarousel(); // ✅ Now call it safely after cards exist

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
const playerList = document.getElementById('player-list')
const getPlayers = async (req,res)=>{
  const response = await axios.get('http://localhost:5000/api/team/player')
  console.log(response.data);
  const players = response.data

  players.forEach((player)=>{
    const html = `
      <div class="player-card">
              <div class="player-info">
                <div class="player-picture">
                  <img src="Sachin_Tendehar.webp" alt="Sachin Tendulkar" />
                </div>
                <h3 class="player-name">${player.player_name}</h3>
                <p class="player-type">${player.role}</p>
              </div>
              <div class="player-stats-table-container">
                <table class="player-stats-table">
                  <thead>
                    <tr>
                      <th>Format</th>
                      <th>Matches</th>
                      <th>Runs</th>
                      <th>Bat Avg</th>
                      <th>SR</th>
                      <th>HS</th>
                      <th>100s</th>
                      <th>50s</th>
                      <th>4s</th>
                      <th>6s</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Test</td>
                      <td>200</td>
                      <td>15,921</td>
                      <td>53.78</td>
                      <td>54.04</td>
                      <td>248*</td>
                      <td>51</td>
                      <td>68</td>
                      <td>2,058</td>
                      <td>69</td>
                    </tr>
                    <tr>
                      <td>ODI</td>
                      <td>463</td>
                      <td>18,426</td>
                      <td>44.83</td>
                      <td>86.23</td>
                      <td>200*</td>
                      <td>49</td>
                      <td>96</td>
                      <td>2,016</td>
                      <td>195</td>
                    </tr>
                    <tr>
                      <td>T20I</td>
                      <td>1</td>
                      <td>10</td>
                      <td>10.00</td>
                      <td>83.33</td>
                      <td>10</td>
                      <td>0</td>
                      <td>0</td>
                      <td>2</td>
                      <td>0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
    `;
    playerList.innerHTML+=html
  })
  
}
getPlayers()