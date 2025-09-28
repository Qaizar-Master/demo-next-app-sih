// entities/UserProgress.js

class UserProgressClass {
  static async create(data) {
    console.log("Creating UserProgress:", data);
    // Replace with your API call
    return { id: `up_${Date.now()}`, ...data };
  }

  static async filter(query) {
    console.log("Filtering UserProgress with query:", query);
    // Replace with your API call
    return [];
  }
}

export const UserProgress = UserProgressClass;