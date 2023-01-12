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

  .listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
