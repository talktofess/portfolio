// Navigation Menu Functionality
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close');

// Show menu
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.add('show');
  });
}

// Hide menu
if (navClose && navMenu) {
  navClose.addEventListener('click', () => {
    navMenu.classList.remove('show');
  });
}

// Remove menu when clicking a nav link
const navLinks = document.querySelectorAll('.nav__link');

function linkAction() {
  if (navMenu) navMenu.classList.remove('show');
}

navLinks.forEach(link => {
  if (link) link.addEventListener('click', linkAction);
});

// Active section highlighting
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    if (!section) return;

    const sectionHeight = section.offsetHeight,
          sectionTop = section.offsetTop - 50,
          sectionId = section.getAttribute('id');

    if (!sectionId) return;

    const navLink = document.querySelector(`.nav__menu a[href*="${sectionId}"]`);
    if (navLink) {
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLink.classList.add('active');
      } else {
        navLink.classList.remove('active');
      }
    }
  });
}

window.addEventListener('scroll', scrollActive);

// Works Section - Image Grid Functionality
function initWorksGallery() {
  const worksContainer = document.querySelector('.works__container');
  
  if (!worksContainer) return;

  // Generate image blocks if container is empty
  if (worksContainer.children.length === 0) {
    for (let i = 1; i <= 35; i++) {
      const imgBlock = document.createElement('div');
      imgBlock.className = 'works__img';
      imgBlock.innerHTML = `
        <img src="img/qwetu (${i}).jpg" alt="Qwetu ${i}" class="works__image">
        <div class="works__data">
          <a href="projects/qwetu (${i}).html" class="works__btn inspect-btn" target="_blank">Inspect</a>
          <button class="works__btn collapse-btn">Collapse</button>
        </div>
      `;
      worksContainer.appendChild(imgBlock);
    }
  }

  // Set up event listeners for all images
  const worksImages = document.querySelectorAll('.works__img');

  worksImages.forEach(img => {
    if (!img) return;

    // Click to expand/collapse
    img.addEventListener('click', function (e) {
      if (e.target.classList.contains('works__btn')) return;

      const currentlyExpanded = document.querySelector('.works__img.expanded');
      if (currentlyExpanded && currentlyExpanded !== this) {
        currentlyExpanded.classList.remove('expanded');
      }

      this.classList.toggle('expanded');

      if (this.classList.contains('expanded')) {
        this.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    const collapseBtn = img.querySelector('.collapse-btn');
    if (collapseBtn) {
      collapseBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        img.classList.remove('expanded');
      });
    }
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  scrollActive();
  initWorksGallery();

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Lazy loading (optional, only works if images have .lazy and data-src)
  const lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));

  if ('IntersectionObserver' in window && lazyImages.length > 0) {
    const lazyImageObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;
          if (lazyImage.dataset.src) {
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.classList.remove('lazy');
            observer.unobserve(lazyImage);
          }
        }
      });
    });

    lazyImages.forEach(function (lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  }
});
