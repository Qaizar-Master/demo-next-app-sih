// entities/ChallengeSubmission.js

class ChallengeSubmissionClass {
  static async create(data) {
    console.log("Creating ChallengeSubmission:", data);
    // Replace with your API call
    return { id: `cs_${Date.now()}`, ...data };
  }
}

export const ChallengeSubmission = ChallengeSubmissionClass;
