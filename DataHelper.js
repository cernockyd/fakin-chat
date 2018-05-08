var fs = require('fs');
var fetch = require('node-fetch');
var outputFile = './src/data.json';
const args = process.argv;
const command = args[2];
const apiKey = args[3];

// Command Routing
if (!command) {
  console.log('pls add command');
  return process.exit();
} else {
  switch(command) {
    case 'fetch':
      if (!apiKey) {
        console.log('pls add api key');
        return process.exit();
      }
      FetchMetadata();
      break;
    case 'process':
      ProcessMetadata();
      break;
    default:
      return process.exit();
  }
}

function ProcessMetadata() {
  console.log('///–––––––––––––––––––––––-///');
  console.log('///––––Process Metadata–––-///');
  console.log('///–––––––––––––––––––––––-///');

  var data = require('./src/data.json');

  var newData = data.map(function(book, i) {

    // nejake podminky

    return book;

  });

  fs.writeFile(outputFile, JSON.stringify(newData), function (err) {
    if (err) return console.log(err);
    console.log('writing to ' + outputFile);
  });

}

function FetchMetadata() {
  var data = require('./raw.data.json');
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
}