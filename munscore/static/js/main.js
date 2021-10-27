function initializePage(scores) {
    // 填充党派选择选项
    let parties = scores.parties.map(p => p.name);
    let partiesText = parties.map(p => `<option>${p}</option>`).join('');
    document.querySelectorAll('.party-select').forEach(el => {
        el.innerHTML = partiesText;
    });

    // 用分数 ID 覆盖元素 ID
    document.getElementById('A_Party_Score').id = scores.parties[0].score.id;
    document.getElementById('B_Party_Score').id = scores.parties[1].score.id;
    document.getElementById('VenueA_score').id = scores.venues[0].score.id;
    document.getElementById('VenueB_score').id = scores.venues[1].score.id;
    document.getElementById('VenueC_score').id = scores.venues[2].score.id;
}


function formatScores(scores) {
    if (!pageInitialized) {
        initializePage(scores);
        pageInitialized = true;
    }

    // 填充所有选手数据
    document.querySelectorAll('.contestant-scores > tbody').forEach(el => el.innerHTML = '');

    scores.contestants.forEach((venueContestants, i) => {
        venueContestants.forEach(contestant => {
            let row = document.createElement('tr');
            row.innerHTML = `
                <th scope="row">${contestant.id} 号</th>
                <td>${contestant.name}</td>
                <td class="score-editable" id="${contestant.id}">${contestant.score.value}</td>
                <td>
                    <button type="button" class="btn btn-primary score-button" data-scoreid="${contestant.id}">
                    +1
                    </button>
                    <button type="button" class="btn btn-primary score-button" data-scoreid="${contestant.id}">
                    -1
                    </button>
                </td>
                <td>${contestant.party}</td>
            `;
            document.querySelectorAll('.contestant-scores > tbody')[i].appendChild(row);
        });
    });

    // 填充党派与会场数据
    scores.parties.forEach((e, i) => {
        document.querySelectorAll('.party-score')[i].innerHTML = e.score.value;
    });
    scores.venues.forEach((e, i) => {
        document.querySelectorAll('.venue-score')[i].innerHTML = e.score.value;
    });

    // 绑定点击修改分数事件
    document.querySelectorAll('.score-editable').forEach(element => element.addEventListener('click', setScore));
    document.querySelectorAll('.score-button').forEach(e => e.addEventListener('click',changeScore));
    document.querySelectorAll('.delete-button').forEach(e => e.addEventListener('click',deleteContestant));
}


function setScore(element) {
    const scoreId = element.target.id;
    const currentValue = element.target.innerHTML;
    const formdata = new FormData();
    const value = prompt('输入新的分数数值', currentValue);

    if (value == null || !isNonnegativeInteger(value)) return;

    formdata.append('score_id', scoreId);
    formdata.append('value', value);

    const requestOptions = {
      method: 'POST',
      body: formdata,
    }
    fetch('/api/score/set', requestOptions)
    .then(response => response.json())
    .then(json => {
        console.log('Success again:', json);
    });
}

function changeScore(element)
{
    const scoreId = element.target.dataset.scoreid;
    const formdata = new FormData();
    formdata.append('score_id', scoreId);
    console.log(scoreId);
    if (element.target.innerHTML==+1)
    {
        formdata.append('change', 1);
    }else
    {
        formdata.append('change', -1);
    }
    var requestOptions = {
    method: 'POST',
    body: formdata,
    };
    fetch("/api/score/update", requestOptions)
    .then(response => response.json())
    .then(json => {
        console.log(json);
    });
}

// function deleteContestant(element)
// {
//     const contestantId = element.target.dataset.scoreid;
//     const formdata = new FormData();
//     formdata.append('id', contestantId);

//     var requestOptions = {
//     method: 'POST',
//     body: formdata,
//     };

//     fetch("/api/contestant/remove", requestOptions)
//     .then(response => response.json())
//     .then(json => {
//         console.log(json);
//     });
// }


function isNonnegativeInteger(str) {
    str = str.trim();
    if (!str) {
        return false;
    }
    str = str.replace(/^0+/, '') || '0';
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
}

function startRace()
{
    var requestOptions = {
        method: 'POST',
      };
    fetch("/api/contest/start", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

const socket = io.connect('/');
let pageInitialized = false;

socket.on('scores', formatScores);

document.querySelectorAll('.add-contestant-form').forEach(e => {
    e.addEventListener('submit', event => {
        event.preventDefault();
        const venueId = event.target.dataset.venueIndex;
        const name = event.target.querySelector('.name').value;
        const party = event.target.querySelector('.party').value;
        const venue = document.querySelectorAll('.venue-title')[venueId].innerHTML;

        var data = new FormData();
        data.append('name', name);
        data.append('venue', venue);
        data.append('party', party);
        fetch('/api/contestant/add', {
            method: 'POST',
            body: data,
        })
        .then(response => response.json())
        .then(json => {
            console.log('Response:', json);
        });
    });
});
