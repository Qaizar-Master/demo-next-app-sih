// entities/User.js

// Placeholder for your actual User logic (e.g., fetching from an API or auth service)
class UserClass {
  /**
   * Fetches the currently authenticated user.
   * @returns {Promise<Object|null>} A promise that resolves to the user object.
   */
  static async me() {
    console.log("Fetching current user...");
    // Replace this with your actual authentication logic
    return {
      email: "eco.warrior@example.com",
      full_name: "Eco Warrior",
    };
  }
}

export const User = UserClass;