import { Bookmark, Play } from "lucide-react";
import HeroBg from "../assets/herobg2.jpg";
import { useEffect, useState } from "react";
import { Link } from "react-router";
const Hero = () => {
  const [movie, setMovie] = useState(null);
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZGQ5YWQwMzZlN2JmNjY1NjExODMyMWM4NmFlNGZiOSIsIm5iZiI6MTc0OTQ0NDEwOS43MjYsInN1YiI6IjY4NDY2NjBkYjI2MmJkNzVlNmZkNWRjNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.q1TdhnE-ew6IU0_0VdrqutaqzWuiLivGzPMaq024BJg'
    }
  };

  useEffect(() => {
    // First: try TMDB
    fetch(
      "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1",
      options
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.results && res.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * res.results.length);
          setMovie(res.results[randomIndex]);
        } else {
          // fallback to OMDB if TMDB returns no results
          fallbackToOMDB();
        }
      })
      .catch((err) => {
        console.error("TMDB fetch error:", err);
        // fallback to OMDB if TMDB fetch fails
        fallbackToOMDB();
      });
  }, []);

  // fallback function for OMDB
  const fallbackToOMDB = () => {
    fetch("https://www.omdbapi.com/?t=House%20of%20the%20Dragon&apikey=4718526")
      .then((res) => res.json())
      .then((omdbData) => {
        if (omdbData && omdbData.Title) {
          // adapt OMDB data to TMDB-like object
          const adaptedMovie = {
            id: omdbData.imdbID,
            original_title: omdbData.Title,
            backdrop_path: omdbData.Poster,
          };
          setMovie(adaptedMovie);
        } else {
          console.error("OMDB also returned no data");
        }
      })
      .catch((err) => console.error("OMDB fetch error:", err));
  };

  if (!movie) {
    return <p>Loading...</p>;
  }
  return (
    <div className="text-white relative">
      <img
        src={
          movie?.Poster
            ? movie.Poster
            : `https://image.tmdb.org/t/p/original/${movie?.backdrop_path}`
        }
        alt="bg-img"
        className="w-full rounded-2xl h-[480px] object-center object-cover"
      />

      {movie?.backdrop_path && (
        <div className="flex space-x-2 md:space-x-4 absolute bottom-3 left-4 md:bottom-8 md:left-10 font-medium">
          <button className="flex justify-center items-center bg-white hover:bg-gray-200 text-[#e50914] py-3 px-4 rounded-full cursor-pointer text-sm md:text-base">
            <Bookmark className="mr-2 w-4 h-5 md:w-5 md:h-5" /> Save for Later
          </button>
          <Link to={`/movie/${movie?.id}`}>
            <button className="flex justify-center items-center bg-[#e50914] text-white py-3 px-4 rounded-full cursor-pointer text-sm md:text-base">
              <Play className="mr-2 w-4 h-5 md:w-5 md:h-5" /> Watch Now
            </button>
          </Link>
        </div>
      )}

      {movie?.imdbID && (
        <div className="absolute bottom-3 left-4 md:bottom-8 md:left-10 flex space-x-2 md:space-x-4 font-medium">
          <a
            href={`https://www.imdb.com/title/${movie?.imdbID}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="flex justify-center items-center bg-[#e50914] text-white py-3 px-4 rounded-full cursor-pointer text-sm md:text-base">
              <Play className="mr-2 w-4 h-5 md:w-5 md:h-5" /> Watch on IMDb
            </button>
          </a>
        </div>
      )}
    </div>
  );
};

export default Hero;
