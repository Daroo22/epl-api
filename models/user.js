
import mongoose, { Schema } from "mongoose";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,

  },
  password: {
    type: String,
    required: true,
  },
  favorites: [{type: mongoose.Schema.Types.ObjectId, ref: 'Player'}]

});


const User = mongoose.model("User", userSchema);

export default User
