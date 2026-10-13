const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');

function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobileMenu.hidden = !open;
  document.body.classList.toggle('menu-open', open);
}

menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .09, rootMargin: '0px 0px -30px 0px' });
  revealItems.forEach(item => observer.observe(item));
} else revealItems.forEach(item => item.classList.add('is-visible'));

document.getElementById('year').textContent = new Date().getFullYear();

const credentials = document.querySelector('.credentials');
if (credentials && 'IntersectionObserver' in window && !reducedMotion.matches) {
  const countNodes = credentials.querySelectorAll('[data-count-to]');
  const countObserver = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    countObserver.disconnect();
    const start = performance.now();
    const duration = 1500;
    const countUp = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      countNodes.forEach(node => {
        const target = Number(node.dataset.countTo);
        node.textContent = String(progress === 1 ? target : Math.floor(target * eased));
      });
      if (progress < 1) requestAnimationFrame(countUp);
    };
    requestAnimationFrame(countUp);
  }, { threshold: .35 });
  countObserver.observe(credentials);
}

const marquee = document.querySelector('.hero-marquee');
const marqueeTrack = marquee?.querySelector('.hero-marquee-track');
if (marqueeTrack) {
  const updateScrollShift = () => {
    marqueeTrack.style.setProperty('--marquee-scroll', `${-Math.min(window.scrollY, 1400) * .38}px`);
  };
  window.addEventListener('scroll', updateScrollShift, { passive: true });
  updateScrollShift();
}

const heroStage = document.querySelector('.hero-stage');
const heroDisc = document.querySelector('.hero-disc');
if (heroStage && heroDisc && !reducedMotion.matches) {
  let framePending = false;
  const updateHeroDepth = () => {
    framePending = false;
    const mobile = window.innerWidth < 650;
    const progress = Math.max(0, Math.min(1, window.scrollY / (heroStage.closest('.hero').offsetHeight * .8)));
    heroDisc.style.setProperty('--photo-shift', `${-progress * (mobile ? 12 : 24)}px`);
    heroDisc.style.setProperty('--photo-tilt-x', `${-progress * (mobile ? 5 : 9)}deg`);
    heroDisc.style.setProperty('--photo-tilt-y', `${progress * (mobile ? 8 : 14)}deg`);
    heroDisc.style.setProperty('--photo-scale', String(1.12 + progress * (mobile ? .03 : .07)));
  };
  const scheduleHeroDepth = () => {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(updateHeroDepth);
  };
  window.addEventListener('scroll', scheduleHeroDepth, { passive: true });
  window.addEventListener('resize', scheduleHeroDepth, { passive: true });
  scheduleHeroDepth();
}

const filterButtons = document.querySelectorAll('[data-filter]');
const projectCards = document.querySelectorAll('.portfolio-card[data-category]');
const loadMoreWrap = document.querySelector('.load-more-wrap');
const loadMoreButton = document.getElementById('load-more-projects');
const projectsRemaining = document.getElementById('projects-remaining');
const pageSize = 9;
let activeCategory = 'all';
let visibleCount = pageSize;
const loadRevealObserver = 'IntersectionObserver' in window && !reducedMotion.matches
  ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-load-visible');
        loadRevealObserver.unobserve(entry.target);
      });
    }, { threshold: .08, rootMargin: '0px 0px -24px 0px' })
  : null;

function renderProjects() {
  let matchingIndex = 0;
  const newlyVisible = [];
  projectCards.forEach(card => {
    const wasHidden = card.hidden;
    const matches = activeCategory === 'all' || card.dataset.category.split(/\s+/).includes(activeCategory);
    card.hidden = !matches || (activeCategory === 'all' && matchingIndex >= visibleCount);
    if (matches) matchingIndex++;
    if (!card.hidden) {
      card.classList.add('is-visible');
      if (wasHidden) newlyVisible.push(card);
    }
  });
  const remaining = Math.max(0, matchingIndex - visibleCount);
  loadMoreWrap.hidden = activeCategory !== 'all' || remaining === 0;
  projectsRemaining.textContent = `${remaining} remaining`;
  loadMoreButton.setAttribute('aria-label', `Load ${Math.min(pageSize, remaining)} more projects`);
  return newlyVisible;
}

filterButtons.forEach(button => button.addEventListener('click', () => {
  projectCards.forEach(card => {
    loadRevealObserver?.unobserve(card);
    card.classList.remove('load-enter', 'is-load-visible');
    card.style.removeProperty('--load-order');
  });
  activeCategory = button.dataset.filter;
  visibleCount = pageSize;
  filterButtons.forEach(item => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  renderProjects();
}));
loadMoreButton.addEventListener('click', () => {
  const scrollPosition = window.scrollY;
  visibleCount += pageSize;
  const newlyVisible = renderProjects();
  if (loadRevealObserver) {
    newlyVisible.forEach((card, index) => {
      card.style.setProperty('--load-order', index % 3);
      card.classList.add('load-enter');
      loadRevealObserver.observe(card);
    });
  }
  window.scrollTo({ top: scrollPosition, behavior: 'instant' });
});
renderProjects();
