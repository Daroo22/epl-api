import mongoose from "mongoose";

const playerSchema = mongoose.Schema({
    playerName: {
        type: String
    }
})


const Player = mongoose.model("Player", playerSchema)

export default Player