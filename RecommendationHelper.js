var data = require('./src/recommendation-data.json');
var LA = require('look-alike');
var knn = require('alike');

// console.log(data.length);

console.log('****--------------------------------------------****');
console.log('****----------- Recommendation TEST ------------****');
console.log('****--------------------------------------------****');


process.stdout.write("\n Query features: \n");
var features = {
  pages:0,
  type:0,
  theme:0,
  mood:0,
  images:0
};
console.log(features);

console.time('test1');
process.stdout.write("\n \n \n k-Nearest Neighbour queries: \n\n");
var tree = new LA(data, {attributes: ['pages', 'type', 'theme', 'mood', 'images' ]});

try {
  var recommendation = tree.query(features, {k:3});
  console.log(JSON.stringify(recommendation));
} catch(err) {
  console.log(err);
}
process.stdout.write("\n");
console.timeEnd('test1');
process.stdout.write("\n");

console.time('test2');
process.stdout.write("\n\n k-Nearest Euclidean \n\n");
try {
  var alikeRecommendation = knn(features, data, {k: 3});
  console.log(JSON.stringify(alikeRecommendation));
} catch(err) {
  console.log(err);
}
process.stdout.write("\n");
console.timeEnd('test2');
process.stdout.write("\n");