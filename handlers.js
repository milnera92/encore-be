const zlib = require("zlib");
const axios = require("axios");

const { v4: uuidv4 } = require("uuid");

const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const { query, response } = require("express");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const setlistKey = process.env.SETLIST_KEY;
const mapsKey = process.env.MAPS_KEY;
const ticketKey = process.env.TICKET_KEY;
const getArtist = async (req, res) => {
  try {
    const artistId = req.params.id;
    const options = {
      headers: { Accept: "application/json", "x-api-key": `${setlistKey}` },
    };

    const url = `https://api.setlist.fm/rest/1.0/artist/${artistId}`;

    const result = await axios.get(url, options);

    res.status(200).json({
      status: 200,
      data: result.data,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err,
    });
  }
};

const getAllSetlist = async (req, res) => {
  try {
    const artistId = req.params.id;
    const options = {
      headers: { Accept: "application/json", "x-api-key": `${setlistKey}` },
      decompress: true,
    };

    const url = `https://api.setlist.fm/rest/1.0/artist/${artistId}/setlists?p=1`;

    const result = await axios.get(url, options);

    res.status(200).json({
      status: 200,
      data: result.data,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err,
    });
  }
};

const getSetlist = async (req, res) => {
  try {
    const setlistId = req.params.id;
    const options = {
      headers: { Accept: "application/json", "x-api-key": `${setlistKey}` },
      decompress: true,
    };

    const url = `https://api.setlist.fm/rest/1.0/setlist/${setlistId}`;

    const result = await axios.get(url, options);

    res.status(200).json({
      status: 200,
      data: result.data,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err,
    });
  }
};

const getSearchArtist = async (req, res) => {
  try {
    const search = req.params.id;
    const options = {
      headers: { Accept: "application/json", "x-api-key": `${setlistKey}` },
      decompress: true,
    };

    const url = `https://api.setlist.fm/rest/1.0/search/artists?artistName=${search}&p=1&sort=sortName`;

    const result = await axios.get(url, options);

    res.status(200).json({
      status: 200,
      data: result.data,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err,
    });
  }
};

const postFavorite = async (req, res) => {
  const id = uuidv4();
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("finalproject");

  const result = db
    .collection("favorites")
    .insertOne({ _id: id, data: req.body });

  res.status(200).json({
    status: 200,
    data: result,
  });
};

const getFavorites = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("finalproject");

  const result = await db.collection("favorites").find().toArray();

  res.status(200).json({
    status: 200,
    data: result,
  });
};

const deleteFavorite = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("finalproject");
  const _id = req.body._id;
  console.log(_id);
  const result = await db.collection("favorites").deleteOne(_id);

  result.deletedCount > 0
    ? res.status(200).json({
        status: 200,
        data: result,
        message: "Item DELETED from FAVORITES",
      })
    : res.status(404).json({ status: 404, message: "Not Found" });
  client.close();
};

const getVideos = async (req, res) => {
  try {
    const search = req.params.id;
    const options = {
      params: {
        key: mapsKey,
        part: "snippet",
        maxResults: 5,
      },
      headers: { Accept: "application/json" },
    };

    const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${search}&key=${mapsKey}`;

    const result = await axios.get(url, options);

    res.status(200).json({
      status: 200,
      data: result.data,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err,
    });
  }
};

const getInfo = async (req, res) => {
  try {
    const search = req.params.id;
    const options = {
      params: {
        key: ticketKey,
      },
      headers: { Accept: "application/json" },
    };

    const url = `https://app.ticketmaster.com/discovery/v2/attractions?apikey=${ticketKey}&keyword=${search}&locale=*`;

    const result = await axios.get(url, options);
    console.log(result);
    res.status(200).json({
      status: 200,
      data: result.data,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err,
    });
  }
};

module.exports = {
  getArtist,
  getAllSetlist,
  getSetlist,
  getSearchArtist,
  postFavorite,
  getFavorites,
  getVideos,
  getInfo,
  deleteFavorite,
};
