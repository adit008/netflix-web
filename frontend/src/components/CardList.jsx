import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router"

const CardList = ({ title, category }) => {
  const [data, setData] = useState([]);
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NTgzMDFlZGQ2MGEzN2Y3NDlmMzhlNGFmMTJjZDE3YSIsIm5iZiI6MTc0NTQxNjIyNS44NzY5OTk5LCJzdWIiOiI2ODA4ZjAyMTI3NmJmNjRlNDFhYjY0ZWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.NA_LMt6-MUBLAvxMRkZtBoUif4p9YQ6aYZo-lv4-PUE",
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First try to fetch from TMDB API
        const tmdbRes = await fetch(
          `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`,
          options
        );
        if (!tmdbRes.ok) throw new Error("TMDB API failed");
        const tmdbData = await tmdbRes.json();

        // If successful, set TMDB data
        setData(tmdbData.results);
      } catch (error) {
        console.error("TMDB API failed, trying OMDB...", error);

        // Fallback to OMDB API
        try {
          const omdbRes = await fetch(
            `https://www.omdbapi.com/?s=adventure&apikey=4718526`
          );
          if (!omdbRes.ok) throw new Error("OMDB API failed");
          const omdbData = await omdbRes.json();

          // OMDB data is under `Search` key
          if (omdbData.Search) {
            // Adapt OMDB structure to match your UI
            const adaptedData = omdbData.Search.map((item) => ({
              id: item.imdbID,
              original_title: item.Title,
              backdrop_path: item.Poster, // OMDB poster as backdrop_path
            }));
            setData(adaptedData);
          } else {
            console.error("No data found in OMDB fallback");
            setData([]);
          }
        } catch (omdbError) {
          console.error("Both APIs failed", omdbError);
        }
      }
    };

    fetchData();
  }, [category]);


  return (
    <div className="text-white md:px-4">
      <h2 className="pt-10 pb-5 text-lg font-medium">{title}</h2>

      <Swiper slidesPerView={"auto"} spaceBetween={10} className="mySwiper">
        {data.map((item, index) => (
          <SwiperSlide key={index} className="max-w-72">
            <Link to={`/movie/${item.id}`}>
              <img
                src={
                  item.backdrop_path?.startsWith("http")
                    ? item.backdrop_path
                    : `https://image.tmdb.org/t/p/w500/${item.backdrop_path}`
                }
                alt=""
                className="h-44 w-full object-center object-cover"
              />
              <p className="text-center pt-2">
                {item.original_title}
              </p>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CardList;
