import mongoose from "mongoose";
const Schema = mongoose.Schema;

const likedSongsSchema = new mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        songs: [
            {
                type: Schema.Types.ObjectId,
                ref: "Song", 
                required: true,
            }
        ],
    },
   
);

const LikedSongs = mongoose.model("LikedSongs", likedSongsSchema);
export default LikedSongs;

