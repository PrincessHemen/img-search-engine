import React, { useState, useRef } from 'react';
import './Search.css';

const Search = () => {
  const searchForm = useRef(null);
  const searchBox = useRef(null);
  const searchResult = useRef(null);
  const searchMore = useRef(null);

  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [searchBoxValue, setSearchBoxValue] = useState('');
  const [images, setImages] = useState([]);

  const accessKey = '8zPkKwky_zxvO7EkqbG3PJKq_Sdm8CmXhOOu8BPyiwM'; // Replace with your actual Unsplash access key

  const searchImage = async () => {
    setKeyword(searchBoxValue);
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${searchBoxValue}&client_id=${accessKey}&per_page=12`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        const results = data.results;
        const newImages = results.map((result) => ({
          id: result.id,
          url: result.urls.small,
          alt: result.alt_description,
          htmlLink: result.links.html
        }));
        if (page === 1) {
          // Clear existing images if it's the first page for the current keyword
          setImages([]);
        }
        // Append new images to existing images
        setImages((prevImages) => [...prevImages, ...newImages]);
        // Display the show more button
        if (searchMore.current) {
          searchMore.current.style.display = "block";
        }
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchBoxValue(event.target.value);
  };

  const handleSearchFormSubmit = (event) => {
    event.preventDefault();
    setPage(1); // Reset page to 1
    // Clear existing images when submitting the form with a new keyword
    setImages([]);
    searchImage();
  };

  const handleShowMoreClick = () => {
    setPage((prevPage) => prevPage + 1); // Increment page
    searchImage(); // Fetch more images
  };

  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  return (
    <div className='container'>
      <h1>Image Search Engine</h1>
      <form className="search-form" ref={searchForm} onSubmit={handleSearchFormSubmit}>
        <input type="text" id='search-box' ref={searchBox} placeholder='Search for images here...' onChange={handleSearchInputChange} /> 
        <button type="submit">Search</button>
      </form>
      <div id="search-result" ref={searchResult}> 
        {images.map((image) => (
          <img key={image.id} src={image.url} alt={image.alt} onClick={() => openInNewTab(image.htmlLink)} />
        ))}
      </div>
      <button id="show-more-btn" ref={searchMore} style={{ display: 'none' }} onClick={handleShowMoreClick}>Show More</button>
    </div>
  );
};

export default Search;
