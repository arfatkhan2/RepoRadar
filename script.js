let currentPage = 1;
let repositoriesPerPage = 10;

function changePage(delta) {
    currentPage += delta;
    if (currentPage < 1) {
        currentPage = 1;
    }
    showLoader();
    fetchUserRepositories();
    updatePageNumber();
}

function updateRepositoriesPerPage() {
    repositoriesPerPage = parseInt(document.getElementById('repositoriesPerPage').value, 10) || 10;
    showLoader();
    fetchUserRepositories();
}

function updatePageNumber() {
    document.getElementById('currentPage').textContent = currentPage;
}

function showLoader() {
    const loader = document.getElementById('loaderRepos');
    if (loader) {
        loader.style.display = 'inline-block';
    }
}

function hideLoader() {
    const loader = document.getElementById('loaderRepos');
    if (loader) {
        loader.style.display = 'none';
    }
}

document.getElementById('searchUser').addEventListener('input', function () {
    searchUserRepositories(this.value);
});

function searchUserRepositories(username) {
    const repositoriesContainer = document.getElementById('repositoryList');
    repositoriesContainer.innerHTML = '';
    showLoader();

    if (username.trim() === '') {
        hideLoader();
        return;
    }

    const userUrl = `https://api.github.com/users/${username}`;
    const repositoriesUrl = `https://api.github.com/users/${username}/repos?per_page=${repositoriesPerPage}&page=${currentPage}`;

    // Fetch user details
    fetch(userUrl)
        .then(response => response.json())
        .then(user => {
            hideLoader();
            displayUserDetails(user);
        })
        .catch(error => {
            console.error('Error fetching user information:', error);
            hideLoader();
        });

    // Fetch repositories with pagination
    fetch(repositoriesUrl)
        .then(response => response.json())
        .then(repositories => {
            hideLoader();
            displayRepositories(repositories);
        })
        .catch(error => {
            console.error('Error fetching user repositories:', error);
            hideLoader();
        });
}

function fetchUserRepositories() {
    const username = document.getElementById('searchUser').value;
    searchUserRepositories(username);
}

function displayUserDetails(user) {
    console.log('User Object:', user);

    const profileImage = document.getElementById('profileImage');
    profileImage.src = user.avatar_url || '';

    document.getElementById('bio').textContent = user.bio || 'Not available';
    document.getElementById('location').textContent = user.location || 'Not available';
    document.getElementById('publicRepos').textContent = user.public_repos || 0;
    document.getElementById('followers').textContent = user.followers || 0;
}

function displayRepositories(repositories) {
    const repositoriesContainer = document.getElementById('repositoryList');
    const loader = document.getElementById('loaderRepos');

    repositories.forEach(repo => {
        const repositoryCard = document.createElement('div');
        repositoryCard.className = 'repository-card';

        // Create a container for repository details (name, description, technologies)
        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'repository-details';

        // Repository Name
        const repoName = document.createElement('h3');
        repoName.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;

        // Repository Description
        const repoDescription = document.createElement('p');
        repoDescription.textContent = repo.description || 'No description available';

        // Repository Technologies
        const repoTechnologies = document.createElement('div');
        repoTechnologies.className = 'technologies';
        repoTechnologies.textContent = 'Technologies: ' + (repo.language || 'Not specified');

        // Append details to the container
        detailsContainer.appendChild(repoName);
        detailsContainer.appendChild(repoDescription);
        detailsContainer.appendChild(repoTechnologies);

        // Append the details container to the repository card
        repositoryCard.appendChild(detailsContainer);

        repositoriesContainer.appendChild(repositoryCard);
    });

    // Listen for the animationend event on the last repository card
    const lastRepositoryCard = repositoriesContainer.lastElementChild;
    lastRepositoryCard.addEventListener('animationend', () => {
        hideLoader(); // Hide loader when the animation is complete
    });

    loader.style.display = 'none'; // Make sure loader is initially hidden
}

fetchUserRepositories(); // Fetch user repositories on page load
