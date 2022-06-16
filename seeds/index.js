const mongoose = require('mongoose');
const cities = require('./indian-cities');
const hImgs = require('./hotel-imgs');
const { places, descriptors } = require('./seedHelpers');
const Hotel = require('../models/hotel');
const { urlencoded } = require('express');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const MAPBOX_TOKEN = '';
const mapBoxToken = MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

async function give_location(location) {
    const geoData = await geocoder.forwardGeocode({
        query: location,
        limit: 1
    }).send()
    return geoData.body.features[0].geometry;
}

const DB_URL = '';
// const DB_URL = 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Database Connected !!!");
    })
    .catch(error => {
        console.log("Oh no MONGOOSE Error !!!");
        console.log(error);
    });

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Hotel.deleteMany({});
    for (let i = 0; i < 70; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 8000) + 1000;
        const camp = new Hotel({
            // your user id
            author: '62290832d083a21d58781368',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,

            geometry: await give_location(`${cities[random1000].city}, ${cities[random1000].state}, India`),

            images: [
                sample(hImgs),
                sample(hImgs),
                sample(hImgs)
            ],

            // images: [
            //     {
            //         url: 'https://res.cloudinary.com/daxy8axxm/image/upload/v1646034569/HotelPedia/ubrfxwnziyuyonyzmzvz.jpg',
            //         filename: 'HotelPedia/ubrfxwnziyuyonyzmzvz',
            //     },
            //     {
            //         url: 'https://res.cloudinary.com/daxy8axxm/image/upload/v1646034570/HotelPedia/oxk7qmuphkbncibhvsgs.jpg',
            //         filename: 'HotelPedia/oxk7qmuphkbncibhvsgs',
            //     },
            //     {
            //         url: 'https://res.cloudinary.com/daxy8axxm/image/upload/v1646034570/HotelPedia/mh5ihdp9vbpfz9qaeq3s.jpg',
            //         filename: 'HotelPedia/mh5ihdp9vbpfz9qaeq3s',
            //     },
            //     {
            //         url: 'https://res.cloudinary.com/daxy8axxm/image/upload/v1646034570/HotelPedia/fbpdjnbffqgi7rfhbenu.jpg',
            //         filename: 'HotelPedia/fbpdjnbffqgi7rfhbenu',
            //     }
            // ],

            description: "The night brought such a silence that the crackle of the campfire was all that could be heard, a natural music in the black-duvet night. Flames sent red sparks dancing into the breeze. River sat close on a mossy log, his face toasted warm, mesmerised, relaxed. The smoke twirled heavenward charming his worries away.",
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
    console.log('Seeded successfully !!!');
});