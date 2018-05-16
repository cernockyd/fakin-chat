import recommendationData from '../recommendation-data.json';
import pureData from '../data.json';
import alike from 'alike';

export default async function Recommend(features, k) {
  try {
    const results = await alike(features, recommendationData, {k: k, weights: {id:0, pages:1/6, type:1/6, category:1/6, theme:1/6, mood:1/6, images:1/6}});
    const result = results[k-1];

    const fullResult = pureData.find(function(book) {
      return book.id === result.id;
    });

    return fullResult;

  } catch(err) {
    console.log('recommendation failed:', err);
  }
}