document.getElementById('btnSearch').addEventListener('click', searchRecommendations);
document.getElementById('btnClear').addEventListener('click', clearResults);

document.getElementById('linkHome').addEventListener('click', () => switchView('home'));
document.getElementById('linkAbout').addEventListener('click', () => switchView('about'));
document.getElementById('linkContact').addEventListener('click', () => switchView('contact'));

function switchView(viewName) {
    const homeView = document.getElementById('homeView');
    const aboutView = document.getElementById('aboutView');
    const contactView = document.getElementById('contactView');
    const searchGroup = document.getElementById('navSearchGroup');

    if (viewName === 'home') {
        homeView.style.display = 'block';
        aboutView.style.display = 'none';
        contactView.style.display = 'none';
        searchGroup.style.display = 'flex';
    } else if (viewName === 'about') {
        homeView.style.display = 'none';
        aboutView.style.display = 'block';
        contactView.style.display = 'none';
        searchGroup.style.display = 'none';
    } else if (viewName === 'contact') {
        homeView.style.display = 'none';
        aboutView.style.display = 'none';
        contactView.style.display = 'block';
        searchGroup.style.display = 'none';
    }
}

function searchRecommendations() {
    const keyword = document.getElementById('searchKeyword').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('recommendationResults');
    resultsContainer.innerHTML = '';

    if (!keyword) {
        return;
    }

    fetch('./travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            console.log("Fetched API Data successfully:", data);
            let matchedItems = [];
            let timeZoneStr = '';

            if (keyword === 'beach' || keyword === 'beaches') {
                matchedItems = data.beaches;
            } else if (keyword === 'temple' || keyword === 'temples') {
                matchedItems = data.temples;
            } else {
                const foundCountry = data.countries.find(c => c.name.toLowerCase() === keyword);
                if (foundCountry) {
                    matchedItems = foundCountry.cities;
                    if (keyword === 'australia') timeZoneStr = 'Australia/Sydney';
                    if (keyword === 'japan') timeZoneStr = 'Asia/Tokyo';
                    if (keyword === 'brazil') timeZoneStr = 'America/Sao_Paulo';
                }
            }

            if (matchedItems.length > 0) {
                matchedItems.forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'result-card';
                    
                    let timeHTML = '';
                    if (timeZoneStr) {
                        const options = { timeZone: timeZoneStr, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
                        const localTime = new Date().toLocaleTimeString('en-US', options);
                        timeHTML = `<div class="time-badge">Local Time: ${localTime}</div>`;
                    }

                    card.innerHTML = `
                        <img src="${item.imageUrl}" alt="${item.name}" onerror="this.src='https://picsum.photos/600/400?blur=1';">
                        <div class="result-info">
                            <div>
                                <h3>${item.name}</h3>
                                <p>${item.description}</p>
                            </div>
                            ${timeHTML}
                        </div>
                    `;
                    resultsContainer.appendChild(card);
                });
            } else {
                resultsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No matching recommendations found. Try searching "beach", "temple", "japan", "brazil" or "australia".</p>';
            }
        })
        .catch(error => {
            console.error('Error loading JSON context:', error);
        });
}

function clearResults() {
    document.getElementById('searchKeyword').value = '';
    document.getElementById('recommendationResults').innerHTML = '';
}
