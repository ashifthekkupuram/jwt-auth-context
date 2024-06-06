import mongoose from "mongoose";

const Schema = mongoose.Schema

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        maxLength: 25,
        minLength: 4
    },
    profile: {
        type: String,
        default: 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg'
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true})

export default mongoose.model('User', UserSchema)