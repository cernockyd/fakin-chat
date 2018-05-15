var fs = require('fs');
var fetch = require('node-fetch');
var outputFile = './src/data.json';
var outputFileProcessed = './src/recommendation-data.json';
const args = process.argv;
const command = args[2];
const apiKey = args[3];


/**
 * CLI - Command Router
 */
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
    case 'steal':
      StealBookCover();
      break;
    case 'process':
      ProcessMetadata();
      break;
    default:
      return process.exit();
  }
}


/**
 * StealBookCover
 * take data.json, scrape data from obalkyknih.cz and save it :-D
 */
function StealBookCover() {
  console.log('///–––––––––––––––––––––––-///');
  console.log('///–––– Steal Covers --–––-///');
  console.log('///–––––––––––––––––––––––-///');

  const Loader = require('bulk-html-loader');
  const _ = require('lodash');
  let data = require('./src/data.json');

  let queue = [];
  data.forEach(function(book, i) {
    queue.push('https://www.obalkyknih.cz/view?isbn='+book.isbn);
    // if (i < 9) {
    // }
  });


  const loader = new Loader()

    .setMaxConcurrentConnections(1)

    .onWarning(function(loaderItem, next){
      console.log(this.getProgressPercent() + '% ' + loaderItem._url); // [Object LoaderItem] Error {code} {description} {url}
      next(loaderItem);
    })

    .onError(function(loaderItem, next){
      console.log(this.getProgressPercent() + '% ' + loaderItem._url); // [Object LoaderItem] Error {code} {description} {url}
      next(loaderItem);
    })

    .onItemLoadComplete(function(loaderItem, next){
      next(loaderItem);
    })

    /**
    * Final callback once the queue completes
    */
    .load(queue, (err, loaderItems) => {

      if(err){
      throw err;
      }

      var results = [];
      _.each(loaderItems, function(loaderItem) {

      //console.log(loaderItem);

      // Only process successful LoaderItems
      if (loaderItem.getStatus() === Loader.LoaderItem.COMPLETE) {

        // Results are essentially jQuery objects
        var $cheerio = loaderItem.getResult();

        // Print out the anchor text for all links on the loaded page
        $cheerio('#text a[data-lightbox="book-cover"]').filter(function() {
          var text = $cheerio(this).find('img').attr('src');

          if (text.includes('thumbnail')) {
            let url = loaderItem._url.substr(36);
            let obj = {};
            obj[url] = text;
            if (text.length) {
              results.push(obj);
            }
          }
        });
      }
    } // end of load()
  );

  console.log('///–––––––––––––––––––––––-///');
  console.log('///-----Write output-––––-///');
  console.log('///–––––––––––––––––––––––-///');

  fs.writeFile('./src/stealed-data.json', JSON.stringify(results), function (err) {
    if (err) return console.log(err);
      console.log('writing to ' + './src/stealed-data.json');
    });
  });

}

/**
 * ProcessMetadata
 */
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
    let { name, pages, type, categories, theme, mood, year, images } = book;

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

    // split themes
    var parsedThemes = theme.split(', ');
    // assign ThemeID
    var currentThemes = [];
    parsedThemes.forEach(function(theme) {
      if (possibleThemes.indexOf(theme) === -1) {
        possibleThemes.push(theme);
      }
      currentThemes.push(possibleThemes.indexOf(theme));
    });


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

    // Todo: (hack) reduce array and create standalone item with each category

    return {
      name,
      pages,
      type,
      categories: currentCategories[0],
      theme: currentThemes[0],
      mood,
      images
    };

  });

  fs.writeFile(outputFileProcessed, JSON.stringify(newData), function (err) {
    if (err) return console.log(err);
    console.log('------------------');
    console.log('possibleCategories:');
    var jsonSomething = [];
    possibleCategories.forEach((cat, i) => {
      jsonSomething.push({value: i, label: cat, trigger: 'loop'});
    });
    console.log(jsonSomething);
    console.log('------------------');
    console.log('possibleTypes:', possibleTypes);
    console.log('------------------');
    console.log('possibleMood:', possibleMood);
    console.log('------------------');
    console.log('possiblThemes:', possibleThemes);
    console.log('------------------');
    var randomIndex = Math.floor(Math.random() * data.length);
    console.log('Old Data Sample:', data[randomIndex]);
    console.log('New Data Sample:', newData[randomIndex]);
    console.log('------------------');
    console.log('writing to ' + outputFileProcessed);
  });

}


/**
 * FetchMetadata
 */
function FetchMetadata() {
  var data = require('./raw.data.json');
  var apiUrl = 'https://www.googleapis.com/books/v1/volumes?key='+apiKey+'&maxResults=1&q=';

  console.log('///–––––––––––––––––––––––-///');
  console.log('///–––––Fetch Metadata––––-///');
  console.log('///–––––––––––––––––––––––-///');

  var newData = data.map((async (item, i) => {

      /*if (i !== 82) {
        return item;
      }*/

      var query = encodeURI(apiUrl+item.name+' '+item.author);
      console.log(query);
      const res = await fetch(query);
      const json = await res.json();
      let newItem = item;

      var volumeInfo = json.items[0].volumeInfo;

      //console.log(volumeInfo);

      let errors = [];

      try {
        newItem['isbn'] = !item.isbn ? volumeInfo.industryIdentifiers[0].identifier : item.isbn;
      } catch(err) {
        errors.push('isbn_error');
      }

      try {
        newItem['description'] = volumeInfo.description;
      }
      catch(err) {
        errors.push('description_error');
      }

      try {
        newItem['selfLink'] = volumeInfo.selfLink;
      }
      catch(err) {
        errors.push('selfLink_error');
      }

      try {
        newItem['smallThumbnail'] = volumeInfo.imageLinks.smallThumbnail;
      }
      catch(err) {
        errors.push('smallThumbnail_error');
      }

      try {
        newItem['thumbnail'] = volumeInfo.imageLinks.thumbnail;
      }
      catch(err) {
        errors.push('thumbnail_error');
      }

      if (errors.length !== 0) {
        console.log('');
        console.log(item.name);
        console.log(query);
        console.log(errors);
        console.log('');
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