import mongoose from "mongoose";

const Schema = mongoose.Schema

const PostSchema = new Schema({
    title: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 50
    },
    description: {
        type: String,
        required: true,
        minLength: 6
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: {
        type: String,
        default: 'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=360'
    }
},{timestamps: true})

export default mongoose.model('Post', PostSchema)