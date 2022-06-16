const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

// https://res.cloudinary.com/daxy8axxm/image/upload/w_200/v1646038458/HotelPedia/f7uuxrkb1vglvkl4rsju.jpg
//                                                     ^
//                                                     |
//                                             all parameters here

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const HotelSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

HotelSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/hotels/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>
    `
});


// using 'findOneAndDelete' for findByIdAndDelete()
HotelSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Hotel', HotelSchema);