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

    // document.querySelector('#mytableA > tbody').innerHTML = '';
    // document.querySelector('#mytableB > tbody').innerHTML = '';
    // document.querySelector('#mytableC > tbody').innerHTML = '';

    var a=scores.contestants[0];
    for (var i=0;i<=a.length-1;i++)
    {
        console.log(a[i]);
        let row = document.createElement('tr');
        row.innerHTML = '<th scope="row">'+(i+1)+' 号'+'</th><td>'+a[i].name+'</td><td onclick="myFunction(this)" id="'+a[i].id+'">'+a[i].score.value+'</td><td>'+a[i].party+'</td>';
        // document.querySelector('#mytableA > tbody').appendChild(row);
 
    }
    var b=scores.contestants[1];
    for (var i=0;i<=b.length-1;i++)
    {
        console.log(b[i]);
        let row = document.createElement('tr');
        row.innerHTML = '<th scope="row">'+(i+1)+' 号'+'</th><td>'+b[i].name+'</td><td onclick="myFunction(this)" id="'+b[i].id+'">'+b[i].score.value+'</td><td>'+b[i].party+'</td>';
        // document.querySelector('#mytableB > tbody').appendChild(row);
    }
    var c=scores.contestants[2];
    for (var i=0;i<=c.length-1;i++)
    {
        console.log(c[i]);
        let row = document.createElement('tr');
        row.innerHTML = '<th scope="row">'+(i+1)+' 号'+'</th><td>'+c[i].name+'</td><td onclick="myFunction(this)" id="'+c[i].id+'">'+c[i].score.value+'</td><td>'+c[i].party+'</td>';
        // document.querySelector('#mytableC > tbody').appendChild(row);
    }
    console.log(scores);
    A_Party_Score.addEventListener("click",(ev) => {
        var value=prompt("输入新的政府执行力指数");
        scores.parties[0].score.value=value;
        console.log(scores.parties[0].score.value);
        document.getElementById('A_Party_Score').innerHTML = value;
      });
    B_Party_Score.addEventListener("click",(ev) => {
        var value=prompt("输入新的政府执行力指数");
        scores.parties[1].score.value=value;
        console.log(scores.parties[1].score.value);
        document.getElementById('B_Party_Score').innerHTML = value;
      });
    VenueA_score.addEventListener("click",(ev) => {
        var value=prompt("输入新的国会矛盾指数");
        scores.venues[0].score.value=value;
        console.log(scores.venues[0].score.value);
        document.getElementById('VenueA_score').innerHTML = value;
      });
    VenueB_score.addEventListener("click",(ev) => {
        var value=prompt("输入新的国会矛盾指数");
        scores.venues[1].score.value=value;
        console.log(scores.venues[1].score.value);
        document.getElementById('VenueB_score').innerHTML = value;
      });
    VenueC_score.addEventListener("click",(ev) => {
        var value=prompt("输入新的国会矛盾指数");
        scores.venues[2].score.value=value;
        console.log(scores.venues[2].score.value);
        document.getElementById('VenueC_score').innerHTML = value;
      });
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
    var value=prompt("输入新的议员指数");
    console.log(value);
    formdata.append("value", value);
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
