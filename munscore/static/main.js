const socket = io.connect('/');
socket.on('scores', formatScores);
let pageInitialized = false;


function initializePage(scores) {
    // 填充党派选择选项
    let parties = scores.parties.map(p => p.name);
    let partiesText = parties.map(p => `<option>${p}</option>`).join('');
    document.querySelectorAll('.party-select').forEach(el => {
        el.innerHTML = partiesText;
    })
}


function formatScores(scores) {
    if (!pageInitialized) {
        initializePage(scores);
        pageInitialized = true;
    }
    
    // 将数据填充进 HTML 页面
	console.log(scores);
}


var k1=0;
Aform.addEventListener("submit",(ev) => {
    k1++;
    ev.preventDefault();
    var name1=document.getElementById('namea').value;
    var party1=document.getElementById('partya').value;
    console.log(party1);
    var data={};
    data['name']=name1;
    data['party']='Party '+party1;
    console.log(data);
    fetch('/api/contestant/add', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(json => {
        console.log('Success:',json);
        document.getElementById('mytableA').innerHTML += '<tr><td>'+k1+'号'+'</td><td>'+json.data.name+'</td><td>70</td><td>'+json.data.party+'</td></tr>';
    ;});
});

var k2=0;
Bform.addEventListener("submit",(ev) => {
    k2++;
    ev.preventDefault();
    var name1=document.getElementById('nameb').value;
    var party1=document.getElementById('partyb').value;
    console.log(party1);
    var data={};
    data['name']=name1;
    data['party']='Party '+party1;
    console.log(data);
    fetch('/api/contestant/add', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(json => {
        console.log('Success:',json);
        document.getElementById('mytableB').innerHTML += '<tr><td>'+k2+'号'+'</td><td>'+json.data.name+'</td><td>70</td><td>'+json.data.party+'</td></tr>';
    ;});
});

var k3=0;
Cform.addEventListener("submit",(ev) => {
    k3++;
    ev.preventDefault();
    var name1=document.getElementById('namec').value;
    var party1=document.getElementById('partyc').value;
    console.log(party1);
    var data={};
    data['name']=name1;
    data['party']='Party '+party1;
    console.log(data);
    fetch('/api/contestant/add', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(json => {
        console.log('Success:',json);
        document.getElementById('mytableC').innerHTML += '<tr><td>'+k3+'号'+'</td><td>'+json.data.name+'</td><td>70</td><td>'+json.data.party+'</td></tr>';
    ;});
});
