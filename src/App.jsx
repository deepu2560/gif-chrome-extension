import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";

const GifExtension = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [gifs, setGifs] = useState([]);
  const [selectedGif, setSelectedGif] = useState(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const requestDataTimer = useRef();

  const fetchGifs = async () => {
    try {
      const response = await axios.get(
        `https://api.giphy.com/v1/gifs/search?api_key=TcYyhOSfy8eMrUvfqXGUYMm2iSyECBM1&q=${searchQuery}&limit=25&offset=0&rating=g&lang=en&bundle=messaging_non_clips`
      );
      console.log("gif data recevided success", response.data.data);
      setGifs(response.data.data);
      setLoadingSearch(false);
    } catch (error) {
      console.error("Error fetching GIFs:", error);
      setLoadingSearch(false);
    }
  };

  useEffect(() => {
    setLoadingSearch(() => true);
    if (searchQuery.length > 1) {
      if (requestDataTimer.current != null) {
        clearTimeout(requestDataTimer.current);
        requestDataTimer.current = null;
      }
      requestDataTimer.current = setTimeout(() => {
        fetchGifs();
      }, 1000);
      return;
    } else {
      setGifs([]);
    }
  }, [searchQuery]);

  const handleGifClick = (gif) => {
    setSelectedGif(gif);
  };

  const handleShareButtonClick = () => {
    navigator.clipboard
      .writeText(selectedGif.images.original.url)
      .then(() => {
        alert("Text copied to clipboard!");
      })
      .catch((err) => {
        console.error("Unable to copy text: ", err);
      });
  };

  if (selectedGif != null) {
    return (
      <div className="App">
        <div className="selected-gif-display-container">
          <img
            key={selectedGif.id}
            src={selectedGif.images.original.url}
            alt={selectedGif.title}
            title={selectedGif.title}
          />
          <div>
            <button onClick={() => handleShareButtonClick()}>Copy Link</button>
            <button onClick={() => setSelectedGif(() => null)}>Go Back</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <input
        type="text"
        placeholder="Search GIFs"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery.length > 1 ? (
        loadingSearch ? (
          <div className="fetched-gif-display-container">
            <h2>Fetching gifs...</h2>
          </div>
        ) : (
          <div className="fetched-gif-display-container">
            {gifs.map((gif) => (
              <img
                key={gif.id}
                src={gif.images.original.url}
                alt={gif.title}
                title={gif.title}
                onClick={() => handleGifClick(gif)}
              />
            ))}
          </div>
        )
      ) : (
        <div className="fetched-gif-display-container">
          <h2>Nothing Searched...</h2>
        </div>
      )}
    </div>
  );
};

export default GifExtension;
