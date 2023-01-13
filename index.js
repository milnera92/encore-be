const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const port = 8000;

const {
  getArtist,
  getAllSetlist,
  getSetlist,
  getSearchArtist,
  postFavorite,
  getFavorites,
  getVideos,
  getInfo,
  deleteFavorite,
} = require("./handlers");

express()
.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://encore-project.onrender.com"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})
  //Allows server to auto-parse REQ.BODY.
  //Normally, send as JSON string.
  //This makes it "already" and object
  .use(express.json())
  .use(helmet())
  .use(morgan("tiny"))

  //gets single artist based on id
  .get("/artist/:id", getArtist)
  //gets all setlists for an artist based on id
  .get("/artist/setlists/:id", getAllSetlist)
  //gets a setlist based on setlist ID
  .get("/setlist/:id", getSetlist)
  .get("/search/artist/:id", getSearchArtist)

  .post("/post-favorite", postFavorite)
  .get("/get-favorites", getFavorites)

  .get("/get-videos/:id", getVideos)
  .get("/artist-info/:id", getInfo)
// doesn't work
  .delete("/delete-favorite/:id", deleteFavorite)

  //test
  .get('/',(req,res)=>{
    res.send("hello from server");
  })

  .listen(process.env.PORT||4000, () => {
    console.log(`HELLO SERVER IS OK`);
  });
