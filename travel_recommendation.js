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
            let resultsToDisplay = [];

            if (keyword === 'beach' || keyword === 'beaches') {
                data.beaches.forEach(item => resultsToDisplay.push({ item, tz: '' }));
            } else if (keyword === 'temple' || keyword === 'temples') {
                data.temples.forEach(item => resultsToDisplay.push({ item, tz: '' }));
            } else if (keyword === 'country' || keyword === 'countries') {
                if (data.countries && data.countries.length >= 2) {
                    const country1 = data.countries[0]; 
                    const country2 = data.countries[1]; 
                    
                    if (country1.cities && country1.cities.length > 0) {
                        resultsToDisplay.push({ item: country1.cities[0], tz: 'Australia/Sydney' });
                    }
                    if (country2.cities && country2.cities.length > 0) {
                        resultsToDisplay.push({ item: country2.cities[0], tz: 'Asia/Tokyo' });
                    }
                }
            } else {
                const foundCountry = data.countries.find(c => c.name.toLowerCase() === keyword);
                if (foundCountry) {
                    let tz = '';
                    if (keyword === 'australia') tz = 'Australia/Sydney';
                    if (keyword === 'japan') tz = 'Asia/Tokyo';
                    if (keyword === 'brazil') tz = 'America/Sao_Paulo';

                    foundCountry.cities.forEach(item => resultsToDisplay.push({ item, tz }));
                }
            }

            if (resultsToDisplay.length > 0) {
                resultsToDisplay.forEach(({ item, tz }) => {
                    const card = document.createElement('div');
                    card.className = 'result-card';
                    
                    let timeHTML = '';
                    if (tz) {
                        const options = { timeZone: tz, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
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
                resultsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No matching recommendations found. Try searching "beach", "temple", "country", "japan", "brazil" or "australia".</p>';
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
