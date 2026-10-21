// ---------- State ----------
let projects = [];

// ---------- Data ----------
async function fetchProjects() {
    const response = await fetch('http://localhost:5086/api/Projects');
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.status}`);
    }

    const data = await response.json();

    return data.map(project => ({
      name: project.name,
      description: project.description,
      year: project.year,
      img: project.img,
      link: project.link
    }));
}

// ---------- Sorting ----------
function sortProjects(projectList, sortBy) {
  const sorted = [...projectList];

  if (sortBy === 'year-desc') {
      return sorted.sort((a,b) => b.year - a.year);

  } else if (sortBy === ('year-asc')) {
      return sorted.sort((a,b) => a.year - b.year);

  } else if (sortBy === ('name-asc')) {
    return sorted.sort((a,b) => a.name.localeCompare(b.name));

  } else if (sortBy === ('name-desc')) {
    return sorted.sort((a,b) => b.name.localeCompare(a.name));

  } else if (sortBy === 'random') {
    for (let i = sorted.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
    }
  }
    return sorted;
}

// ---------- Rendering ----------
function renderProjects(projectsList, sortMethod) {
    const years_wrapper = document.getElementById('years-wrapper');
    if (!years_wrapper) return;
    
    const years = [...new Set(projectsList.map(p => p.year))];

    if (sortMethod === 'year-desc' || sortMethod === 'year-asc') {
      years_wrapper.innerHTML = years.map(year => {
        const yearsProjects = projectsList.filter(p => p.year === year);
        return `
        <div class="year-block">
        <h3 class="year-title">Year ${year}</h3>
        <div class="projects-grid">
          ${yearsProjects.map(p => `
            <article class="project-card">
              <div class="project-image">
                <img src="${p.img}" loading="lazy" alt="Preview van ${p.name}" />
              </div>
              <div class="project-info">
                <h4>${p.name}</h4>
                <p>${p.description}</p>${p.link ? `<a href="${p.link}" target="_blank" class="project-link">Check it out</a>` : ''}
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    `;

      }).join('');
    } else if (sortMethod === 'name-asc' || sortMethod === 'name-desc') {
      const letters = [...new Set(projectsList.map(p => p.name.charAt(0).toUpperCase()))];
      years_wrapper.innerHTML = `
        ${letters.map(letter => `
          <div class="letter-block">
            <h3 class="letter-title">${letter}</h3>
            <div class="projects-grid">
              ${projectsList.filter(p => p.name.charAt(0).toUpperCase() === letter).map(p => `
                <article class="project-card">
                  <div class="project-image">
                    <img src="${p.img}" loading="lazy" alt="Preview van ${p.name}" />
                  </div>
                  <div class="project-info">
                    <h4>${p.name}</h4>
                    <p>${p.description}</p>${p.link ? `<a href="${p.link}" target="_blank" class="project-link">Check it out</a>` : ''}
                  </div>
                </article>
              `).join('')}
            </div>
          </div>
        `).join('')}
      `;
    } else if (sortMethod === 'random') {
      years_wrapper.innerHTML = `
        <div class="projects-grid">
          ${projectsList.map(p => `
            <article class="project-card">
              <div class="project-image">
                <img src="${p.img}" loading="lazy" alt="Preview van ${p.name}" />
              </div>
              <div class="project-info">
                <h4>${p.name}</h4>
                <p>${p.description}</p>${p.link ? `<a href="${p.link}" target="_blank" class="project-link">Check it out</a>` : ''}
              </div>
            </article>
          `).join('')}
        </div>
      `;
    } 
}

// ---------- Controls and event handlers ----------
const sortSelect = document.getElementById('project-sort-select');
const randomButton = document.getElementById('randomize-btn');

function sortAndRender(sortMethod) {
  const sortedProjects = sortProjects(projects, sortMethod);
  renderProjects(sortedProjects, sortMethod);
}

function toggleRandomButton(selectedValue) {
  if (!randomButton) return;

  if (selectedValue === 'random') {
    randomButton.classList.remove('hidden');
  } else {
    randomButton.classList.add('hidden');
  }
}

function handleSortChange(event) {
  const sortMethod = event.target.value;

  toggleRandomButton(sortMethod);
  sortAndRender(sortMethod);
}

function handleRandomClick() {
  sortAndRender('random');
}

function setupEventListeners() {
  if (sortSelect) {
    sortSelect.addEventListener('change', handleSortChange);
  }

  if (randomButton) {
    randomButton.addEventListener('click', handleRandomClick);
  }
}

// ---------- Startup ----------
async function init() {
  setupEventListeners();

  try {
    projects = await fetchProjects();
    sortAndRender('year-asc');
  } catch (error) {
    console.error('Error while loading projects:', error);
  }
}

init();
