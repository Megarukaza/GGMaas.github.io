let blogs = [];


async function fetchBlogs () {
      const response = await fetch('http://localhost:5086/api/Blogposts');
       if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.status}`);
      }

     const data = await response.json();

     return data.map(blog => ({
      title: blog.title,
      description: blog.description,
      date: blog.date.slice(0,10),
      dateLabel: blog.date.slice(0, 10)
     }));
}

function sortBlogs(blogList, sortBy) {
  const sorted = [...blogList];

  if (sortBy === 'date-asc') {
    return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function renderBlogs(blogList) {
  const blogTimeline = document.getElementById('blog-timeline');
  if (!blogTimeline) return;

  blogTimeline.innerHTML = blogList
    .map(
      (blog) => `
        <article class="blog-card ${blog.isFuture ? 'future-post' : ''}">
          <span class="blog-date">${blog.date}</span>
          <h3>${blog.title}</h3>
          <p>${blog.description}</p>
        </article>
      `
    )
    .join('');
}

function updateBlogs(sortMethod) {
  const sortedBlogs = sortBlogs(blogs, sortMethod);
  renderBlogs(sortedBlogs);
}

async function init() {
  const sortSelect = document.getElementById('blog-sort-select');

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      updateBlogs(sortSelect.value);
    });
  }

  try {
    blogs = await fetchBlogs();

    const initialSort = sortSelect ? sortSelect.value : 'date-desc';
    updateBlogs(initialSort);
  } catch (error) {
    console.error('Error while loading blogs:', error);
  }
}

init();
