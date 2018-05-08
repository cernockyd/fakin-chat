var fs = require('fs');
var data = require('./raw.data.json');
var fetch = require('node-fetch');
var outputFile = './src/data.json';
const args = process.argv;
const apiKey = args[2];

if (!apiKey) {
  console.log('pls add api key');
  return process.exit();
}

var apiUrl = 'https://www.googleapis.com/books/v1/volumes?key='+apiKey+'&maxResults=1&q=';

console.log('///–––––––––––––––––––––––-///');
console.log('///–––––Fetch Metadata––––-///');
console.log('///–––––––––––––––––––––––-///');

var newData = data.map((async (item, i) => {
    var query = encodeURI(apiUrl+item.name+' '+item.author);
    const res = await fetch(query);
    const json = await res.json();
    let newItem = item;

    var volumeInfo = json.items[0].volumeInfo;

    //console.log(volumeInfo);

    try {
      newItem['description'] = volumeInfo.description;
    }
    catch(err) {
      console.log(i, err);
    }

    try {
      newItem['selfLink'] = volumeInfo.selfLink;
    }
    catch(err) {
      console.log(i, err);
    }

    try {
      newItem['smallThumbnail'] = volumeInfo.imageLinks.smallThumbnail;
    }
    catch(err) {
      console.log(i, err);
    }

    try {
      newItem['thumbnail'] = volumeInfo.imageLinks.thumbnail;
    }
    catch(err) {
      console.log(i, err);
    }

    return newItem;

  }));

console.log('///–––––––––––––––––––––––-///');
console.log('///-----Write output-––––-///');
console.log('///–––––––––––––––––––––––-///');

Promise.all(newData).then((completed) => {

  fs.writeFile(outputFile, JSON.stringify(completed), function (err) {
    if (err) return console.log(err);
    console.log('writing to ' + outputFile);
  });

});