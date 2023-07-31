const path = require("path")

module.exports ={
    mode: "development",
    entry: "./script/chat.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    watch: true
}