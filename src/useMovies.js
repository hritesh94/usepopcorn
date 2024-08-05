import { useEffect, useState } from "react";
const KEY = "e6082e4f";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, SetError] = useState("");
  useEffect(
    function () {
      //here we are declaring another function for async coz then eslint gives us a warning that use effect is synchronous so inside synchronous async function is present



      const controller = new AbortController();
      //    👆 comes from browser API not from react
      async function fetchMovies() {
        try {
          setIsLoading(true);
          SetError(""); //resetting the error coz then we will be able to fetch
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
            //                                                     👆 connecting the controller
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
          // console.log(data)
          //as setMovies is async fuction so we will not get the latest values of state movies here so we will get only old state
          // console.log(movies);<-- but after like sometime it also produces result after giving the old empty array as state value
          //so instead of logging movies we log data.search👇
          // console.log(data.Search);

          // setIsLoading(false); we want to set load false after loading has been complete but due to error throwing it would not work here so we will include this in the finally block
        } catch (err) {
          // console.error(err.message);

          if (err.name !== "AbortError") {
            //as js sees the abort as an error
            SetError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 2) {
        setMovies([]);
        SetError("");
        return;
          }
          //here we will 👇 accept it in as argument as a callback function
      //   handleCLoseMovie(); //becoz if we search the current movieDetails will will close
      fetchMovies();

      //👇 basically this is a cleanup function wher we are using the controller.abort
      return function () {
        controller.abort();
        //👆 so what this will do is whenever there is a new keyword in search that means the search query gets updated so the state changes and thats why the component gets re-rendered and whenever there is a re-render the controller.abort()  aborts the current fetch request and so it helps in cancelling multiple fetch request and gives the fetch of only the required one (lec 156 at 6:00)
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
