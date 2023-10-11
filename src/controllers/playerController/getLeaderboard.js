import Player from "../../models/player.model.js";

export const getLeaderboard = async (req, res) => {
  try {
    // Fetch players from the database and sort them by In-Game Tokens in descending order
    const leaderboard = await Player.find({}).sort({ inGameTokens: -1 }).limit(10);

    // Send the sorted list of players as a response
    res.status(200).json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
