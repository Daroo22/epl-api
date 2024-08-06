const baseUrl = 'https://api.sportradar.com/soccer/trial/v4/en/seasons/sr%3Aseason%3A93741/players.json'

//Get Players
const getAllPlayers = async () => {
    const path = `?api_key=${process.env.SOCCER_API_KEY}`
    const response = await fetch(baseUrl + path)

    return response.json()
}

export {
    getAllPlayers
}