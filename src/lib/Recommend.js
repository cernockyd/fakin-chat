import recommendationData from '../recommendation-data.json';
import pureData from '../data.json';
import alike from 'alike';

export default async function Recommend(features, k) {
  try {
    const results = await alike(features, recommendationData, {k: k, weights: {id:0, pages:0.2, type:0.2, category:0.2, theme:0.2, mood:0.2, images:0.2}});
    const result = results[k-1];

    const fullResult = pureData.find(function(book) {
      return book.id === result.id;
    });

    return fullResult;

  } catch(err) {
    console.log('recommendation failed:', err);
  }
}