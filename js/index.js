/**
 * Cyberglossary - Hash Router SPA Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  let allTopics = [];
  let allTerms = [];

  // DOM Views
  const homeView = document.getElementById('home-view');
  const topicView = document.getElementById('topic-view');

  // DOM Elements - Home View
  const homeSearchInput = document.getElementById('home-search-input');
  const topicsGrid = document.getElementById('topics-grid');
  const homeSearchResults = document.getElementById('home-search-results');
  const randomBtn = document.getElementById('random-btn');
  const randomCard = document.getElementById('random-card');
  const closeRandomBtn = document.getElementById('close-random-btn');

  // DOM Elements - Topic View
  const currentTopicName = document.getElementById('current-topic-name');
  const currentTopicCount = document.getElementById('current-topic-count');
  const topicSearchInput = document.getElementById('topic-search-input');
  const topicTermsGrid = document.getElementById('topic-terms-grid');
  const noTopicResults = document.getElementById('no-topic-results');

  // SVG Icons
  const topicIcons = {
      'social-engineering': `<svg class="topic-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
      'web-security': `<svg class="topic-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
      'malware': `<svg class="topic-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 2 1.88 1.88"></path><path d="M14.12 3.88 16 2"></path><path d="M9 7.13v-1a3.003 3.003 0 0 1 6 0v1"></path><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6z"></path><path d="M12 20v2"></path><path d="M6 13H2"></path><path d="M22 13h-4"></path></svg>`,
      'network-security': `<svg class="topic-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`,
      'cryptography': `<svg class="topic-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
      'cloud-security': `<svg class="topic-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M175 190h-110a50 50 0 0 1-50-50 45 45 0 0 1 32-43 65 65 0 0 1 125-17 50 50 0 0 1 3 110z"></path></svg>`,
      'identity-access': `<svg class="topic-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle><rect x="14" y="11" width="8" height="10" rx="1"></rect></svg>`,
      'incident-response': `<svg class="topic-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
      'application-security': `<svg class="topic-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
      'endpoint-security': `<svg class="topic-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`,
      'data-privacy': `<svg class="topic-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
      'threat-intelligence': `<svg class="topic-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m16.2 7.8-2 6.3-6.4 2.1 2-6.3z"></path></svg>`,
      'vulnerability-mgmt': `<svg class="topic-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
      'wireless-mobile': `<svg class="topic-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14 0"></path><path d="M8.5 16.42a6 6 0 0 1 7 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>`,
      'iot-ot-security': `<svg class="topic-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line></svg>`,
      'ai-cybersecurity': `<svg class="topic-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z"></path><path d="M12 12 2.1 10.5"></path><path d="M12 12l4.3 9.1"></path></svg>`
    };

  // 1. Fetch Master Data
  async function initAppData() {
    try {
      const indexResponse = await fetch('data/cybersecurity/index.json');
      if (!indexResponse.ok) throw new Error('Failed to fetch index.json');

      const indexData = await indexResponse.json();
      allTopics = indexData.topics || [];

      const fetchPromises = allTopics.map(topic =>
        fetch(`data/cybersecurity/${topic.file}`)
          .then(res => res.json())
          .catch(() => [])
      );

      const topicResults = await Promise.all(fetchPromises);
      allTerms = topicResults.flat();

      renderHomeTopicCards();
      handleRouting(); // Initial route evaluation
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  }

  // 2. Hash Router (Swaps views based on URL location)
  function handleRouting() {
    const hash = window.location.hash || '#/';

    if (hash.startsWith('#/topic/')) {
      const topicId = hash.replace('#/topic/', '');
      const topicObj = allTopics.find(t => t.id === topicId);

      if (topicObj) {
        showTopicPage(topicObj);
      } else {
        showHomePage();
      }
    } else {
      showHomePage();
    }
  }

  window.addEventListener('hashchange', handleRouting);

  // 3. View Switchers
  function showHomePage() {
    homeView.classList.remove('hidden');
    topicView.classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showTopicPage(topicObj) {
    homeView.classList.add('hidden');
    topicView.classList.remove('hidden');

    currentTopicName.textContent = topicObj.name;
    topicSearchInput.value = ''; // Reset local search

    renderTopicTerms(topicObj.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 4. Render Home Topic Cards
  function renderHomeTopicCards() {
    if (!topicsGrid) return;
    topicsGrid.innerHTML = '';

    allTopics.forEach(topic => {
      const count = allTerms.filter(t =>
        t.topic.toLowerCase().includes(topic.id.replace('-', ' ')) ||
        t.topic.toLowerCase() === topic.name.toLowerCase()
      ).length;

      const icon = topicIcons[topic.id] || topicIcons['web-security'];

      const card = document.createElement('a');
      card.href = `#/topic/${topic.id}`;
      card.className = 'topic-card';
      card.innerHTML = `
        ${icon}
        <h3>${topic.name}</h3>
        <span>${count} terms</span>
      `;

      topicsGrid.appendChild(card);
    });
  }

  // 5. Render Terms Inside Specific Topic Page
  function renderTopicTerms(topicId) {
    const topicObj = allTopics.find(t => t.id === topicId);
    if (!topicObj) return;

    const query = topicSearchInput.value.toLowerCase().trim();
    topicTermsGrid.innerHTML = '';

    const matchingTerms = allTerms.filter(item => {
      const belongsToTopic = item.topic.toLowerCase().includes(topicId.replace('-', ' ')) ||
                             item.topic.toLowerCase() === topicObj.name.toLowerCase();

      const matchesSearch = item.term.toLowerCase().includes(query) ||
                            item.short_definition.toLowerCase().includes(query) ||
                            item.layman_explanation.toLowerCase().includes(query);

      return belongsToTopic && matchesSearch;
    });

    currentTopicCount.textContent = `${matchingTerms.length} terms`;

    if (matchingTerms.length === 0) {
      noTopicResults.classList.remove('hidden');
    } else {
      noTopicResults.classList.add('hidden');
      matchingTerms.forEach(item => {
        const card = document.createElement('div');
        card.className = 'term-card';
        card.innerHTML = `
          <h3>${item.term}</h3>
          <span class="topic-tag">${item.topic}</span>
          <p class="short-def"><strong>Quick Def:</strong> ${item.short_definition}</p>
          <p class="layman-def"><strong>In Plain English:</strong> ${item.layman_explanation}</p>
        `;
        topicTermsGrid.appendChild(card);
      });
    }
  }

  if (topicSearchInput) {
    topicSearchInput.addEventListener('input', () => {
      const currentHash = window.location.hash;
      if (currentHash.startsWith('#/topic/')) {
        renderTopicTerms(currentHash.replace('#/topic/', ''));
      }
    });
  }

  // 6. Global Search on Home Page
  if (homeSearchInput) {
    homeSearchInput.addEventListener('input', () => {
      const query = homeSearchInput.value.toLowerCase().trim();

      if (query === '') {
        topicsGrid.classList.remove('hidden');
        homeSearchResults.classList.add('hidden');
      } else {
        topicsGrid.classList.add('hidden');
        homeSearchResults.classList.remove('hidden');
        homeSearchResults.innerHTML = '';

        const results = allTerms.filter(item =>
          item.term.toLowerCase().includes(query) ||
          item.short_definition.toLowerCase().includes(query) ||
          item.layman_explanation.toLowerCase().includes(query)
        );

        results.forEach(item => {
          const card = document.createElement('div');
          card.className = 'term-card';
          card.innerHTML = `
            <h3>${item.term}</h3>
            <span class="topic-tag">${item.topic}</span>
            <p class="short-def"><strong>Quick Def:</strong> ${item.short_definition}</p>
            <p class="layman-def"><strong>In Plain English:</strong> ${item.layman_explanation}</p>
          `;
          homeSearchResults.appendChild(card);
        });
      }
    });
  }

  // 7. Randomizer
  if (randomBtn) {
    randomBtn.addEventListener('click', () => {
      if (allTerms.length === 0) return;
      const randomTerm = allTerms[Math.floor(Math.random() * allTerms.length)];

      document.getElementById('random-term-title').textContent = randomTerm.term;
      document.getElementById('random-term-topic').textContent = randomTerm.topic;
      document.getElementById('random-term-short').textContent = randomTerm.short_definition;
      document.getElementById('random-term-layman').textContent = randomTerm.layman_explanation;

      randomCard.classList.remove('hidden');
      randomCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  if (closeRandomBtn) {
    closeRandomBtn.addEventListener('click', () => randomCard.classList.add('hidden'));
  }

  initAppData();
});
