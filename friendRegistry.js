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
    "Vince": {
        name: "Vince",
        location: "Bengaluru",
        sticker: require('./assets/stickers/girl.jpeg'),
        speed: 3,
        size: 80,
    },
    "Anupam": {
        name: "Anupam",
        location: "Kolkata",
        sticker: require('./assets/stickers/lelouch.png'),
        speed: 6,
        size: 100,
    },
    // "Lelouch" added separately for the test button in App.tsx
    "Ajith Bro": {
        name: "Ajith Bro",
        location: "Test",
        sticker: require('./assets/stickers/lelouch.png'),
        speed: 6,
        size: 100,
    }
};
