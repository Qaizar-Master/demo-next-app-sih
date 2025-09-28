// entities/GameSession.js

class GameSessionClass {
  static async create(data) {
    console.log("Creating GameSession:", data);
    // Replace with your API call to create a game session
    return { id: `gs_${Date.now()}`, ...data };
  }

  static async filter(query, sortBy, limit) {
    console.log(`Filtering GameSessions with query:`, query);
    // Replace with your API call to fetch game sessions
    return [];
  }
}

export const GameSession = GameSessionClass;
