const socket = io.connect('/');
socket.on('scores', formatScores);


function formatScores(scores) {
	console.log(scores);
	let stringified = JSON.stringify(scores, null, 4);
	stringified = _syntaxHighlight(stringified);

	document.getElementById('json-output').innerHTML = stringified;
}


function _syntaxHighlight(json) {
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}



// const data = { 'name': 'George', 'party': 'Party A' };

// fetch('http://localhost:5000/api/contestant/add', {
//     method: 'POST',
//     headers: {'Content-Type': 'application/json'},
//     body: JSON.stringify(data),
// })
// .then(response => response.json())
// .then(json => {
//     console.log('Success:', json);
//     document.getElementById('title').innerHTML = json.data.name;
// });







// document.getElementById('fucking-form').onsubmit = (e) => {
//     e.preventDefault();

//     const formData  = new FormData();
//     const fileInput = document.getElementById('cute-image-input');
//     formData.append('cute-image', fileInput.files[0]);

//     fetch('/add', {
//         method: 'POST',
//         body: formData
//     })
//     .then(r => r.json())
//     .then(data => {
//         console.log(data);
//         // const imgElement = document.getElementById('result-image');
//         // imgElement.src = data['image_url'];
//         document.getElementById('image-container').innerHTML += `
//             <img src="${data['image_url']}" style="width: 600px;">
//         `;
//     });
// }
