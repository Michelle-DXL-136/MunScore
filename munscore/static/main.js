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
    
    // var formdata = new FormData();
    // var theScore=document.querySelector('#score');
    // var scoreId=theScore.dataset.score_id;
    // console.log(scoreId);
    // formdata.append("score_id", scoreId);
    // formdata.append("value", "80");

    // var requestOptions = {
    //   method: 'POST',
    //   body: formdata,
    //   redirect: 'follow'
    // };

    // fetch("/api/score/set", requestOptions)
    // .then(response => response.json())
    // .then(json => {
    //     console.log('Success!!!',json);
    //     document.getElementById('score').innerHTML = json.formdata.value;
    // ;});
}

function myFunction(obj)
{
    var scoreId=obj.id;
    console.log(scoreId);
    var formdata = new FormData();
    formdata.append("score_id", scoreId);
    formdata.append("value", "88");

    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    }
    fetch("/api/score/set", requestOptions)
    .then(response => response.json())
    .then(json => {
        console.log('Success again:',json);
        document.getElementById(scoreId).innerHTML = json.data.value;
    ;});
}


var k1=0;
Aform.addEventListener("submit",(ev) => {
    k1++;
    ev.preventDefault();
    var name1=document.getElementById('namea').value;
    var party1=document.getElementById('partya').value;
    var venue1=document.getElementById('venueA').innerHTML;
    var data=new FormData();
    data.append("name",name1)
    data.append("venue", venue1)
    data.append("party",party1)
    console.log(data);
    fetch('/api/contestant/add', {
        method: 'POST',
        body: data,
        redirect:'follow'
    })
    .then(response => response.json())
    .then(json => {
        console.log('Success:',json);
        var id=json.data.score.id;
        console.log(id);
        document.getElementById('mytableA').innerHTML += '<tr><td>'+k1+'号'+'</td><td>'+json.data.name+'</td><td onclick="myFunction(this)" id="'+id+'">'+json.data.score.value+'</td><td>'+json.data.party+'</td></tr>';
    ;});
});

var k2=0;
Bform.addEventListener("submit",(ev) => {
    k2++;
    ev.preventDefault();
    var name1=document.getElementById('nameb').value;
    var party1=document.getElementById('partyb').value;
    var venue1=document.getElementById('venueB').innerHTML;
    var data=new FormData();
    data.append("name",name1)
    data.append("venue", venue1)
    data.append("party",party1)
    console.log(data);
    fetch('/api/contestant/add', {
        method: 'POST',
        body: data,
        redirect:'follow'
    })
    .then(response => response.json())
    .then(json => {
        console.log('Success:',json);
        var id=json.data.score.id;
        console.log("The id is:",id);
        document.getElementById('mytableB').innerHTML += '<tr><td>'+k2+'号'+'</td><td>'+json.data.name+'</td><td onclick="myFunction(this)" id="'+id+'">'+json.data.score.value+'</td><td>'+json.data.party+'</td></tr>';
    ;});
});

var k3=0;
Cform.addEventListener("submit",(ev) => {
    k3++;
    ev.preventDefault();
    var name1=document.getElementById('namec').value;
    var party1=document.getElementById('partyc').value;
    var venue1=document.getElementById('venueC').innerHTML;
    var data=new FormData();
    data.append("name",name1)
    data.append("venue", venue1)
    data.append("party",party1)
    console.log(data);
    fetch('/api/contestant/add', {
        method: 'POST',
        body: data,
        redirect:'follow'
    })
    .then(response => response.json())
    .then(json => {
        console.log('Success:',json);
        var id=json.data.score.id;
        console.log(id);
        document.getElementById('mytableC').innerHTML += '<tr><td>'+k3+'号'+'</td><td>'+json.data.name+'</td><td onclick="myFunction(this)" id="'+id+'">'+json.data.score.value+'</td><td>'+json.data.party+'</td></tr>';
    ;});
});
