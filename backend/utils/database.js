const mongoose = require("mongoose");
require("dotenv").config();

main().catch((err) => console.log(err));
console.log(process.env.DB_URL);

async function main() {
  await mongoose.connect(process.env.DB_URl);
}

module.exports = main;
