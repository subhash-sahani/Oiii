// This will eventually be moved to a database (SQLite),
// but for the prototype, we'll use a clean object.

export const friendRegistry = {
    "Daniel": {
        name: "Daniel",
        location: "Montreal",
        sticker: require('./assets/stickers/batman.png'),
        speed: 5,
        size: 120,
    },
    "Nao": {
        name: "Nao",
        location: "Home",
        sticker: require('./assets/stickers/girl.jpeg'),
        speed: 3,
        size: 80,
    },
    // Adding myself for testing!
    "Subhash": {
        name: "Subhash",
        location: "Work",
        sticker: require('./assets/stickers/lelouch.png'),
        speed: 6,
        size: 100,
    }
};