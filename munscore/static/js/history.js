const scores = {};
const scoreInfo = {};
let partyIds = [];
let venueIds = [];

let currentNavElement;

const ctx = document.getElementById('data-chart');
const dataChart = new Chart(ctx, baseChartSetting);


fetch('/api/scores')
.then(r => r.json())
.then(json => {
    initializePage(json);
    initializeInfo(json);
})
.then(() => {
    fetch('/api/scores/history')
    .then(r => r.json())
    .then(initializeData);
})


function initializePage(json) {
    const list = document.getElementById('scores-list');

    json.data.contestants.forEach(venueContestants => {
        let hr = document.createElement('hr');
        list.appendChild(hr);
        venueContestants.forEach(contestant => {
            let el = document.createElement('li');
            el.className = 'nav-item';
            el.innerHTML = `
                <a href="#" class="nav-link d-flex justify-content-between" aria-current="page" data-score-id="${contestant.score.id}">
                    <strong class="name">${contestant.name}</strong>
                    <span class="party">${contestant.party}</span>
                </a>
            `;
            list.appendChild(el);
        });
    });

    currentNavElement = document.querySelector('.nav-link');
    currentNavElement.classList.add('active');
    document.querySelectorAll('.nav-link').forEach(el => el.addEventListener('click', navClicked));
}


function initializeInfo(json) {
    let arr = json.data.contestants.flat();
    arr = arr.concat(json.data.parties);
    arr = arr.concat(json.data.venues);

    arr.forEach(entity => {
        scoreInfo[entity.score.id] = {
            scoreName: entity.score.name,
            ownerName: entity.name,
        };
    });

    partyIds = json.data.parties.map(e => e.score.id);
    venueIds = json.data.venues.map(e => e.score.id);
}


function initializeData(json) {
    const plotData = json.data.map(rawToScatter);
    for (let i = 0; i < json.data.length; i++) {
        const scoreId = json.data[i].id;
        const scoreName = json.data[i].name;
        if (!(scoreId in scoreInfo)) continue;
        scores[scoreId] = {
            name: scoreName,
            owner: scoreInfo[scoreId].ownerName,
            data: plotData[i],
        };
    }
    setChartData(currentNavElement);
}


function rawToScatter(rawData) {
    const xs = rawData.timestamps;
    const ys = rawData.values;
    const tsStart = xs[0];
    const scatterData = [];
    const prev = {x: null, y: null};
    const now = Math.ceil(Date.now() / 1000);
    
    for (let i = 0; i < xs.length; i++) {
        const x = xs[i] - tsStart;
        const y = ys[i];

        // if (now - xs[i] > 24 * 60 * 60) continue;
        
        if (i != 0 && x != prev.x && x != prev.x + 1) {
            scatterData.push({x: x - 1, y: prev.y});
        }
        scatterData.push({x: x, y: y});

        prev.x = x;
        prev.y = y;
    }
    scatterData.push({x: now - tsStart, y: prev.y});

    return scatterData;
}


function navClicked(event) {
    const target = event.currentTarget;
    if (target.classList.contains('active')) {return;}

    currentNavElement.classList.remove('active');
    event.currentTarget.classList.add('active');
    currentNavElement = event.currentTarget;

    setChartData(currentNavElement);
}


function setChartData(navElement) {
    let ids = [];
    if (navElement.classList.contains('party-scores')) {
        ids = partyIds;
    } else if (navElement.classList.contains('venue-scores')) {
        ids = venueIds;
    } else {
        ids.push(navElement.dataset.scoreId);
    }
    const legends = ids.map(id => scoreInfo[id].ownerName);
    
    dataChart.data.datasets = [];
    for (let i = 0; i < ids.length; i++) {
        dataChart.data.datasets.push(Object.assign({}, baseDatasetSetting));
        dataChart.data.datasets[i].label = legends[i];
        dataChart.data.datasets[i].data = scores[ids[i]].data;
        dataChart.data.datasets[i].backgroundColor = chartColors[i % chartColors.length];
        dataChart.data.datasets[i].borderColor = chartColors[i % chartColors.length];
    }
    dataChart.update();
}
