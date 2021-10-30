const contestantScoreInfo = {};
const partyScoreInfo = {};
const venueScoreInfo = {};
const scores = {};

fetch('/api/scores')
.then(r => r.json())
.then(json => {
    initializePage(json);
    initializeInfo(json);
});


fetch('/api/scores/history')
.then(r => r.json())
.then(json => {
    console.log(json);
    const plotData = json.data.map(rawToScatter);

    console.log(plotData);
    setChartData(myChart, plotData, legends);
});


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
    json.data.contestants.forEach(venueContestants => {
        venueContestants.forEach(contestant => {
            contestantScoreInfo[contestant.score.id] = {
                scoreName: contestant.score.name,
                ownerName: contestant.name,
                ownerParty: contestant.party,
                ownerVenue: contestant.venue,
            };
        });
    });
    json.data.parties.forEach(party => {
        partyScoreInfo[party.score.id] = {
            scoreName: party.score.name,
            ownerName: party.name,
        };
    });
    json.data.venues.forEach(venue => {
        venueScoreInfo[venue.score.id] = {
            scoreName: venue.score.name,
            ownerName: venue.name,
        };
    });
}


function navClicked(event) {
    let target = event.currentTarget;
    if (target.classList.contains('active')) {return;}

    currentNavElement.classList.remove('active');
    event.currentTarget.classList.add('active');
    currentNavElement = event.currentTarget;

    setChartData(currentNavElement);
}


function rawToScatter(rawData) {
    const xRaw = rawData.timestamps;
    const yRaw = rawData.values;
    const tsStart = xRaw[0];
    const xFinal = [];
    const yFinal = [];
    let xPrev, yPrev;

    for (let i = 0; i < xRaw.length; i++) {
        const x = xRaw[i] - tsStart;
        const y = yRaw[i];
        
        if (i === 0) {
            // Do nothing
        } else if (x === xPrev) {
            // Note we assume no two updates are made in the same second,
            // So we will simply ignore this case and throw an error.
            // throw Error('Two updates in the same second');
            // Actually this is totally fine ;)
        } else if (x === xPrev + 1) {
            // Do nothing
        } else {
            xFinal.push(x - 1);
            yFinal.push(yPrev);
        }

        xFinal.push(x);
        yFinal.push(y);

        xPrev = x;
        yPrev = y;
    }

    return {x: xFinal, y: yFinal};
}


function setChartData(chart, datasets, legends) {
    currentNavElement
    
    chart.data.datasets = [];
    for (let i = 0; i < datasets.length; i++) {
        chart.data.datasets.push(Object.assign({}, baseDatasetSetting));
        chart.data.datasets[i].data = [];
        chart.data.datasets[i].label = legends[i];
        for (let j = 0; j < datasets[i].x.length; j++) {
            chart.data.datasets[i].data.push({x: datasets[i].x[j], y: datasets[i].y[j]});
        }
    }
    chart.update();
}

let currentNavElement;
initializePage();

const ctx = document.getElementById('myChart');

const myChart = new Chart(ctx, baseChartSetting);
