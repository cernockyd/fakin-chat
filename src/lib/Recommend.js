import recommendationData from '../recommendation-data.json';
import pureData from '../data.json';
import alike from 'alike';

export default async function Recommend(features, k) {
  try {
    const results = await alike(features, recommendationData, {k: k});
    const result = results[k-1];

    const fullResult = pureData.find(function(book) {
      return book.id === result.id;
    });

    return fullResult;

  } catch(err) {
    console.log('recommendation failed:', err);
  }
}