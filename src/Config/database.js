const mongoose = require("mongoose")

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://sivanshu8_db_user:WIarlJytB9TUsiah@clusters.awaf9as.mongodb.net/?retryWrites=true&w=majority&appName=Clusters/DevTinder"
    );
};

module.exports = { connectDB };
