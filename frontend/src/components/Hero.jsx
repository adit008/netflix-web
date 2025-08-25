import { Bookmark, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import jpPoster from "../assets/jp.jpg"; // ✅ fallback image

const Hero = () => {
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(false);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NTgzMDFlZGQ2MGEzN2Y3NDlmMzhlNGFmMTJjZDE3YSIsIm5iZiI6MTc0NTQxNjIyNS44NzY5OTk5LCJzdWIiOiI2ODA4ZjAyMTI3NmJmNjRlNDFhYjY0ZWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.NA_LMt6-MUBLAvxMRkZtBoUif4p9YQ6aYZo-lv4-PUE",
    },
  };

  useEffect(() => {
    fetch("https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1", options)
      .then((res) => res.json())
      .then((res) => {
        if (res.results && res.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * res.results.length);
          setMovie(res.results[randomIndex]);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true));
  }, []);

  // ✅ fallback movie if API fails
  const fallbackMovie = {
    id: "default-1",
    title: "Jurassic Park",
    backdrop: jpPoster,
  };

  const finalMovie = error || !movie ? fallbackMovie : {
    id: movie.id,
    title: movie.title,
    backdrop: `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`,
  };

  return (
    <div className="text-white relative">
      <img
        src={finalMovie.backdrop}
        alt={finalMovie.title}
        className="w-full rounded-2xl h-[480px] object-center object-cover"
      />

      {/* ✅ Movie Title */}
      <h2 className="absolute left-4 bottom-20 md:left-10 md:bottom-24 text-2xl md:text-4xl font-bold">
        {finalMovie.title}
      </h2>

      {/* ✅ Buttons */}
      <div className="flex space-x-2 md:space-x-4 absolute bottom-3 left-4 md:bottom-8 md:left-10 font-medium">
        <button className="flex justify-center items-center bg-white hover:bg-gray-200 text-[#e50914] py-3 px-4 rounded-full cursor-pointer text-sm md:text-base">
          <Bookmark className="mr-2 w-4 h-5 md:w-5 md:h-5" /> Save for Later
        </button>
        <Link to={`/movie/${finalMovie.id}`}>
          <button className="flex justify-center items-center bg-[#e50914] text-white py-3 px-4 rounded-full cursor-pointer text-sm md:text-base">
            <Play className="mr-2 w-4 h-5 md:w-5 md:h-5" /> Watch Now
          </button>
        </Link>
      </div>
      {error && (
        <h1 className="text-white absolute top-4 left-4 text-lg font-semibold">
          Failed to fetch data ❌
        </h1>
      )}

    </div>
  );
};

export default Hero;
