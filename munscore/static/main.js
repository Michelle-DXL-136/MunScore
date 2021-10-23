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
    var a=scores.contestants[0];
    for (var i=0;i<=a.length-1;i++)
    {
        console.log(a[i]);
        document.getElementById('mytableA').innerHTML += '<tr><td>'+(i+1)+'号'+'</td><td>'+a[i].name+'</td><td onclick="myFunction(this)" id="'+a[i].id+'">'+a[i].score.value+'</td><td>'+a[i].party+'</td></tr>';
 
    }
    var b=scores.contestants[1];
    for (var i=0;i<=b.length-1;i++)
    {
        console.log(b[i]);
        document.getElementById('mytableB').innerHTML += '<tr><td>'+(i+1)+'号'+'</td><td>'+b[i].name+'</td><td onclick="myFunction(this)" id="'+b[i].id+'">'+b[i].score.value+'</td><td>'+b[i].party+'</td></tr>';
 
    }
    var c=scores.contestants[2];
    for (var i=0;i<=c.length-1;i++)
    {
        console.log(c[i]);
        document.getElementById('mytableC').innerHTML += '<tr><td>'+(i+1)+'号'+'</td><td>'+c[i].name+'</td><td onclick="myFunction(this)" id="'+c[i].id+'">'+c[i].score.value+'</td><td>'+c[i].party+'</td></tr>';
    }
    console.log(scores);
    document.getElementById('A_Party_Score').innerHTML = scores.parties[0].score.value;
    document.getElementById('B_Party_Score').innerHTML = scores.parties[1].score.value;
    document.getElementById('VenueA_score').innerHTML = scores.venues[0].score.value;
    document.getElementById('VenueB_score').innerHTML = scores.venues[1].score.value;
    document.getElementById('VenueC_score').innerHTML = scores.venues[2].score.value;
 
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
