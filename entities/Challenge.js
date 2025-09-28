// entities/Challenge.js

class ChallengeClass {
  static async filter(query) {
    console.log(`Filtering Challenges with query:`, query);
    // Replace with your API call to fetch challenges
    return [];
  }
}

export const Challenge = ChallengeClass;