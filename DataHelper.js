var fs = require('fs');
var fetch = require('node-fetch');
var outputFile = './src/data.json';
var outputFileProcessed = './src/recommendation-data.json';
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

  /**
   * Book Schema
   * @param author string
   * @param name string
   * @param pages int
   * @param type string ['próza', 'drama', 'poezie']
   * @param categories string
   * @param theme string
   * @param mood string ['neutrální', 'šťastný', 'smutný']
   * @param year int
   * @param images string ['TRUE', 'FALSE']
   * @param description string
   * @param smallThumbnail string
   * @param thumbnail string
  */

  var possibleTypes = [];
  var possibleCategories = [];
  var possibleMood = [];
  var possibleThemes = [];

  var newData = data.map(function(book, i) {
    let { pages, type, categories, theme, mood, year, images } = book;

    pages = (pages > 200) ? 0 : 1;
    images = (images === 'TRUE') ? 0 : 1;

    // assign MoodId
    if (possibleMood.indexOf(mood) === -1) {
      possibleMood.push(mood);
    }
    mood = possibleMood.indexOf(mood);

    // assign TypeID
    if (possibleTypes.indexOf(type) === -1) {
      possibleTypes.push(type);
    }
    type = possibleTypes.indexOf(type);

    // assign ThemeID
    if (possibleThemes.indexOf(theme) === -1) {
      possibleThemes.push(theme);
    }
    theme = possibleThemes.indexOf(theme);

    // split categories
    var parsedCategories = categories.split(', ');
    // assign categoryID
    var currentCategories = [];
    parsedCategories.forEach(function(category) {
      if (possibleCategories.indexOf(category) === -1) {
        possibleCategories.push(category);
      }
      currentCategories.push(possibleCategories.indexOf(category));
    });

    return {
      pages,
      type,
      categories: currentCategories,
      theme,
      mood,
      images
    };

  });

  fs.writeFile(outputFileProcessed, JSON.stringify(newData), function (err) {
    if (err) return console.log(err);
    console.log('------------------');
    console.log('possibleCategories:', possibleCategories);
    console.log('------------------');
    console.log('possibleTypes:', possibleTypes);
    console.log('------------------');
    console.log('possibleMood:', possibleMood);
    console.log('------------------');
    var randomIndex = Math.floor(Math.random() * data.length);
    console.log('Old Data Sample:', data[randomIndex]);
    console.log('New Data Sample:', newData[randomIndex]);
    console.log('------------------');
    console.log('writing to ' + outputFileProcessed);
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
      console.log(query);
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

  Promise.all(newData).then((completed) => {

    console.log('///–––––––––––––––––––––––-///');
    console.log('///-----Write output-––––-///');
    console.log('///–––––––––––––––––––––––-///');

    fs.writeFile(outputFile, JSON.stringify(completed), function (err) {
      if (err) return console.log(err);
      console.log('writing to ' + outputFile);
    });

  });
}