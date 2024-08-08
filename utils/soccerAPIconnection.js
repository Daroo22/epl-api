const baseUrl = 'https://api.sportradar.com/soccer/trial/v4/en/seasons/sr%3Aseason%3A93741/players.json'

//Get Players
const getAllPlayers = async () => {
    const path = `?api_key=${process.env.SOCCER_API_KEY}`
    const response = await fetch(baseUrl + path)

    return response.json()
}


export async function searchPlayers(playerName) {
    try {
      const path = `?api_key=${process.env.SOCCER_API_KEY}`;
      const response = await fetch(baseUrl + path);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
  
      // Log the full response data in a readable format
      console.log("API data:", JSON.stringify(data, null, 2));
  
      // Filter players based on playerName
      const players = data.season_players.filter(player =>
        (player.first_name && player.first_name.toLowerCase().includes(playerName.toLowerCase())) ||
        (player.name && player.name.toLowerCase().includes(playerName.toLowerCase())) ||
        (player.last_name && player.last_name.toLowerCase().includes(playerName.toLowerCase()))
      ); 
  console.log('this is player ' + players)
      return players;
    } catch (error) {
       
      console.error("Error fetching players:", error);
      throw error;
    }
  }
  

export {
    getAllPlayers
}