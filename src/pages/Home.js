import React, { useState, useEffect } from "react";
import { GrNext, GrPrevious } from "react-icons/gr";
import useSpotifyToken from "../TokenProvider";
import { Link } from "react-router-dom";

const Home = () => {
  const token = useSpotifyToken();
  const playlistsId = [
    "0kHzBtoH1jc0gxoczQGqFr",
    "4Sx7lGh5E60jagtCMkERJ3",
    "7jHyvYBb2wHlfhB8Jy0fMi",
    "2SM6rniZl84fEyMCB5KMQB",
    "5bFy3kAaPdZcisE340Rfdm",
    "2fr6RIECuS6iqRSGuz6N8g",
    "1FROg3Jj1PACIRgkTlIEih",
    "4eEvBVP6omEoCP8hSAp4Dt"
  ];

  const [playlistsData, setPlaylistsData] = useState({});

  const [currentIndex, setCurrentIndex] = useState(0); // To track the current set of playlists

  const playlistsPerPage = 4; // Number of playlists to show per page

  // Function to fetch playlist data from Spotify API
  async function fetchPlaylistData(playlistId) {
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch playlist data for ${playlistId}`);
    }
    return await response.json();
  }

  // Fetch playlist data once token is available
  useEffect(() => {
    async function fetchData() {
      if (token) {
        try {
          const updatedData = {};

          for (let playlistId of playlistsId) {
            const data = await fetchPlaylistData(playlistId);
            updatedData[playlistId] = {
              id: data.id,
              name: data.name,
              description: data.description,
              image: data.images[0]?.url,
              tracks: data.tracks.total,
            };
          }
          setPlaylistsData(updatedData);
        } catch (error) {
          console.error("Error fetching playlist data:", error);
        }
      }
    }

    fetchData();
  }, [token]);

  // Handler to move to the next set of playlists
  const handleNext = () => {
    if (currentIndex + playlistsPerPage < playlistsId.length) {
      setCurrentIndex(currentIndex + playlistsPerPage);
    }
  };

  // Handler to move to the previous set of playlists
  const handlePrevious = () => {
    if (currentIndex - playlistsPerPage >= 0) {
      setCurrentIndex(currentIndex - playlistsPerPage);
    }
  };

  // Render only the current set of playlists
  const currentPlaylists = playlistsId.slice(
    currentIndex,
    currentIndex + playlistsPerPage
  );

  return (
    <div className="home-container">
      <h1>Home</h1>
      <h3>Top Picks for You</h3>

      <div className="flex space-between">
        <button onClick={handlePrevious} disabled={currentIndex === 0}>
          <GrPrevious />
        </button>
        <div className="playlist-images flex center">
          {currentPlaylists.map((playlistId) => {
            const playlist = playlistsData[playlistId];
            if (!playlist) return null;

            return (
              <Link
                to={`/playlist/${playlistId}`}
                state={{ playlistData: playlist }} // Pass entire playlist data
                key={playlistId}
              >
                <div className="playlist-card">
                  <img
                    src={playlist.image}
                    alt={`Playlist ${playlist.name}`}
                    className="playlist-image"
                  />
                </div>
              </Link>
            );
          })}
        </div>
        <button
          onClick={handleNext}
          disabled={currentIndex + playlistsPerPage >= playlistsId.length}
        >
          <GrNext />
        </button>
      </div>
    </div>
  );
};

export default Home;
