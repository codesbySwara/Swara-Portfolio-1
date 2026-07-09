// Fetch Swara's public repos from the GitHub API
// and show a loading state, an error state, or the results.

const USERNAME = "codesBySwara";
const statusEl = document.getElementById("github-status");
const listEl = document.getElementById("github-list");

function timeAgo(dateString) {
  const days = Math.floor((Date.now() - new Date(dateString)) / (1000 * 60 * 60 * 24));
  if (days < 1) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return days + " days ago";
  return Math.floor(days / 30) + " mo ago";
}

async function loadRepos() {
  statusEl.textContent = "Loading repos...";
  statusEl.classList.remove("error");

  try {
    const res = await fetch(
      "https://api.github.com/users/" + USERNAME + "/repos?sort=updated&per_page=6"
    );

    if (!res.ok) {
      throw new Error("GitHub API responded with " + res.status);
    }

    const repos = await res.json();
    const nonForks = repos.filter((repo) => !repo.fork).slice(0, 6);

    if (nonForks.length === 0) {
      statusEl.textContent = "No public repositories found yet.";
      return;
    }

    statusEl.textContent = "";
    listEl.innerHTML = "";

    nonForks.forEach((repo) => {
      const card = document.createElement("div");
      card.className = "card repo-card";
      card.innerHTML = `
        <div class="card__top">
          <h3>${repo.name}</h3>
          <span class="card__period">${timeAgo(repo.pushed_at)}</span>
        </div>
        <p>${repo.description ? repo.description : "No description provided."}</p>
        <div class="chips">
          ${repo.language ? `<span class="chip">${repo.language}</span>` : ""}
          <span class="chip">★ ${repo.stargazers_count}</span>
        </div>
        <a class="card__link" href="${repo.html_url}" target="_blank" rel="noreferrer">View on GitHub →</a>
      `;
      listEl.appendChild(card);
    });
  } catch (err) {
    statusEl.textContent = "Couldn't load repos right now — try again later.";
    statusEl.classList.add("error");
  }
}

loadRepos();
