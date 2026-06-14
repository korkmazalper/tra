document.getElementById('btnSearch').addEventListener('click', searchRecommendations);
document.getElementById('btnClear').addEventListener('click', clearResults);

document.getElementById('linkHome').addEventListener('click', () => handleNavbarSearchVisibility('#home'));
document.getElementById('linkAbout').addEventListener('click', () => handleNavbarSearchVisibility('#about'));
document.getElementById('linkContact').addEventListener('click', () => handleNavbarSearchVisibility('#contact'));

function handleNavbarSearchVisibility(hash) {
    const searchGroup = document.getElementById('navSearchGroup');
    if (hash === '#about' || hash === '#contact') {
        searchGroup.style.opacity = '0';
        searchGroup.style.pointerEvents = 'none';
    } else {
        searchGroup.style.opacity = '1';
        searchGroup.style.pointerEvents = 'auto';
    }
}

function handleRouting() {
    const hash = window.location.hash || '#home';
    handleNavbarSearchVisibility(hash);
    const element = document.querySelector(hash);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

window.addEventListener('load', handleRouting);
window.addEventListener('hashchange', handleRouting);

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
                if (data.countries) {
                    data.countries.forEach(c => {
                        let tz = '';
                        if (c.name.toLowerCase() === 'australia') tz = 'Australia/Sydney';
                        if (c.name.toLowerCase() === 'japan') tz = 'Asia/Tokyo';
                        if (c.name.toLowerCase() === 'brazil') tz = 'America/Sao_Paulo';
                        
                        if (c.cities) {
                            c.cities.forEach(city => {
                                resultsToDisplay.push({ item: city, tz: tz });
                            });
                        }
                    });
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
