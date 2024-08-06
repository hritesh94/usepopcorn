import { useState, useEffect, useRef } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "e6082e4f";
export default function App() {
  const [query, setQuery] = useState("");

  //------refactored on lec 170 and used in useMovies------------------------------------------------
  // const [movies, setMovies] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, SetError] = useState("");
  //---------------------------------------------------------------------------

  const [selectedId, setSelectedId] = useState(null);
  // const [watched, setWatched] = useState([]);

  //using the refactored -=------useMovies--------------------------here
  const { movies, isLoading, error } = useMovies(query);
  //------------------------------------------------------------------------------------

  //so we made this custom hook coz it👇  not only saves the data in localStorage but also gets the data on first mount so kind of two functionality in one 
  const [watched, setWatched] = useLocalStorageState([], "watched");
  ////----Moved this into a different file i.e useLocalStorageState----------------------------------////////////////////////////////////////////////////////////////////////////////////
  // //so as we now want to get a stored value we can pass in a callback function(also called lazy evaluation) which here gets the storedValue
  // const [watched, setWatched] = useState(function () {
  //   /*So whenever the initial value of the use data depends on some sort of computation we should always pass in a function like this. So function that React can execute on its initial render. So we should not call a function inside useState(like this=> useState(localStorage.getItem('watched'))*/
  //   const storedValue = localStorage.getItem("watched");
  //   return JSON.parse(storedValue);
  // });
  /////////////////////////////////////////////////////////////////////////////////////

  // useEffect(function () {//it will only execute at first that is when  the component mounts(or first time component comes to life) and nothing else
  //   console.log("After initial render");
  // }, []);

  // useEffect(function () {//it executes every time the component gets re-rendered like everytime we reload the page or state updates
  //   console.log("After every render");
  // });

  // useEffect(//it will executte whenever the "query" changes
  //   function () {
  //     console.log("D");
  //   },
  //   [query]
  // );

  // console.log("During render");//it's the top level code so it executes everytime the component re-renders

  function handleSelectMovie(id) {
    //        this👇 callback here implemens the fucntionality that if the id is selected and is once again clicked the updated state will be back to null
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }
  function handleCLoseMovie() {
    setSelectedId(null);
  }

  function handleAddWatch(movie) {
    setWatched((watched) => [...watched, movie]);

    //here directly accessing watched cannot happen as this is async so watched is in stale state so that means we will have the old value of watched so that's why we did this => [...watched,movie]
    // localStorage.setItem('watched', JSON.stringify([...watched, movie]));
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
    //this was in lec 152 at 21:00
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //moved this part into uselocalStorageState
  // useEffect(
  //   function () {
  //     localStorage.setItem("watched", JSON.stringify(watched));
  //     //                                        here 👆 we can just use 'watched' coz its in useeffect coz it runs only when the effect is updated
  //   },
  //   [watched]
  // );
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //exported and refactored this code to a seperate file useMovies at lecture 170
  // useEffect(
  //   function () {
  //     //here we are declaring another function for async coz then eslint gives us a warning that use effect is synchronous so inside synchronous async function is present

  //     const controller = new AbortController();
  //     //    👆 comes from browser API not from react
  //     async function fetchMovies() {
  //       try {
  //         setIsLoading(true);
  //         SetError(""); //resetting the error coz then we will be able to fetch
  //         const res = await fetch(
  //           `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
  //           { signal: controller.signal }
  //           //                                                     👆 connecting the controller
  //         );

  //         if (!res.ok)
  //           throw new Error("Something went wrong with fetching movies");

  //         const data = await res.json();
  //         if (data.Response === "False") throw new Error("Movie not found");

  //         setMovies(data.Search);
  //         // console.log(data)
  //         //as setMovies is async fuction so we will not get the latest values of state movies here so we will get only old state
  //         // console.log(movies);<-- but after like sometime it also produces result after giving the old empty array as state value
  //         //so instead of logging movies we log data.search👇
  //         // console.log(data.Search);

  //         // setIsLoading(false); we want to set load false after loading has been complete but due to error throwing it would not work here so we will include this in the finally block
  //       } catch (err) {
  //         // console.error(err.message);

  //         if (err.name !== "AbortError") {
  //           //as js sees the abort as an error
  //           SetError(err.message);
  //         }
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     }

  //     if (query.length < 2) {
  //       setMovies([]);
  //       SetError("");
  //       return;
  //     }
  //     handleCLoseMovie(); //becoz if we search the current movieDetails will will close
  //     fetchMovies();

  //     //👇 basically this is a cleanup function wher we are using the controller.abort
  //     return function () {
  //       controller.abort();
  //       //👆 so what this will do is whenever there is a new keyword in search that means the search query gets updated so the state changes and thats why the component gets re-rendered and whenever there is a re-render the controller.abort()  aborts the current fetch request and so it helps in cancelling multiple fetch request and gives the fetch of only the required one (lec 156 at 6:00)
  //     };
  //   },
  //   [query]
  // );
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //writing this👇 function using async👆
  //this👇 function only runs after the component has been rendered
  // useEffect(function () {//contains the code we want to run as a sideEffect
  //   fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`)
  //     .then((res) => res.json())
  //     .then((data) => setMovies(data.Search));//now it does not goes into infinite loop
  // }, []);
  //👆 2nd argument which is called dependency array

  //this👇 is a side effect coz in render logic we are trying to communicate with outside the render logic(i.e outside world)
  // fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`)
  // .then((res) => res.json())
  // .then((data) => console.log(data.Search));
  // .then((data) => setMovies(data.Search));//here we are setting/updating the state so it goes into an infinite loop coz updating causes it to re-render and to go into infinite loop so its a bad practice to do it here
  //setMovies() <--- also updating the state directly here gives us a warning by react that it will go into infinite loop
  ///so to overcome these problems👆  we use useEffect hook

  return (
    <>
      {/* <NavBar so we dont need this (👇passed directly as you can see below )prop drilling -></NavBar>movies={movies}> as we can directly pass the prop into component which actually needs it*/}
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      {/* <Main movies={movies} /> same will be done with this main component to solve prop-drilling */}
      <Main>
        {/*lec 114-> as you can see 👇 below this is the method of passing elements as element prop(also the name "element" to pass as element prop is not neccessary we can write anything(like lauda) and pass the elements ) */}
        {/* <Box element={<MovieList movies={movies} />} />
        <Box
          element={
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} />
            </>
          }
        /> */}

        {/*this 👇can be one method i.e passing children prop but we can also use Passing elements as prop👆 */}
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}

          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        {/* <WatchedBox /> instead we created the reusable box👇 component*/}
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCLoseMovie}
              onAddWatched={handleAddWatch}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading ...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}

// function NavBar({movies}) { //here fixing the prop-drilling problem with component composition
function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />

      {/*here as you can see we just included search and logo only here coz they are stateless(dont need state) and only numResults needed state so thats why its in App component as children */}
      {/* <Logo />
      <Search />
      <NumResults movies={movies} /> 
      here 👇 as you can see we used children prop(component composition) to solve the problem of prop-drilling*/}
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function NumResults({ movies }) {
  //here we also did prop-drilling and its solution is component composition
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

//Actaully we are splitting the componenets here which was previously very huge so into more logical and reusable parts
function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useKey('Enter',function () {
    if (document.activeElement === inputEl.current) return;

    inputEl.current.focus();

          setQuery("");
  })

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // useEffect(extracting this whole into a single useKey function
  //   function () {
  //     function callback(e) {
  //       if (e.code === "ENTER") {
  //         //here👇 what this means is if the input element is already selected then dont focus it again or dont do setQuery('')
  //         if (document.activeElement === inputEl.current) return;

  //         //we have already the selected the inputEL as input element tag by just passing the ref to input tag and here we are focusing it whenever the component mounts
  //         inputEl.current.focus();

  //         setQuery("");
  //       }
  //     }

  //     document.addEventListener("keydown", callback);

  //     return () => document.addEventListener("keydown", callback);

  //     //why this👇 is needed ->lec 167 at 9:26
  //   },
  //   [setQuery]
  // );
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //but its not the right way👇
  // useEffect(function () {
  //   const el = document.querySelector('.search');
  //   // console.log(el);
  //   el.focus();//so here we are focusing(cursor blinks directly without clicking) on search bar as soon as the search component mounts
  // },[])

  // const [query, setQuery] = useState("");
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
      // 👆 here as you can see we included the "ref"(i.e the inputEl) here that means we have passed the useRef here so as we have done it in the input element so that means have selected the element without the use of query selector(i.e the declarative way) and so now we can focus it using useEffect
    />
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}
//here these two components listbox and watchedbox basically contains the same material so we will create a new reusable component(Box) to reduce the repeated code
// function ListBox({ children }) {
//   const [isOpen1, setIsOpen1] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen1((open) => !open)}
//       >
//         {isOpen1 ? "–" : "+"}
//       </button>
//       {isOpen1 && children}
//     </div>
//   );
// }
/*function WatchedBox() {
  
  const [watched, setWatched] = useState(tempWatchedData);
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && (
        <>
          <WatchedSummary watched={watched} />
          <WatchedMoviesList watched={watched} />
        </>
      )}
    </div>
  );
} */

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  //here as you can see the prop {movie } was needed here but we needed this also in the search bar for numResults so we lifted the state and we found that we needed this prop from App to deep down to MovieList so we needed to prop-drilling that means we just needed the prop here and not into Main ->ListBox->only in movieList and Numresults so this prop-drilling can become quite cumbersome lec110
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

// let count = 0;
function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const countRef = useRef(0);

  useEffect(
    function () {
      //we are actually counting the no of times a user changes the rating👇 here
      if (userRating) countRef.current = countRef.current + 1;
      // if(userRating) count++;we can use it as a external scope variable though to stay persistent but this means breaking the rules and it means then that this is side effect
      //but here we cannot not use the normal variable coz its get reset everytime the function/component is re-rendered so that's why we use useRef as it stays persistent accross each re-render and does not trigger the re-render
    },
    [userRating]
  );

  // from lec 161 we get to know that if here in this line like before this line we have three useState hooks and after this line we have three useeffect hooks so here if we conditionally declare a hook or return statement here then the order of hooks gets broken and then the react gets confused and creates a bug so this is why we should always define hooks at the top level and not in some conditionals
  const {
    Title: title,
    //eslint-disable-next-line
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecisions: countRef.current,
      // count,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  // console.log(isWatched);
  // console.log(prevUserRating);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId //this comparision will return object
  )?.userRating; //then we will look into the objects' userRating

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  useKey('Escape', onCloseMovie);
  // useEffect(this whole 👆 is used as this
  //   function () {
  //     function callback(e) {
  //       if (e.code === "Escape") {
  //         onCloseMovie();
  //         // console.log("CLOSING");
  //       }
  //     }

  //     document.addEventListener("keydown", callback);

  //     /*each time that a new MovieDetails component mounts, a new event listener is added to the document, so basically always an additional one to the ones that we already have. So again, each time that this effect here is executed, it'll basically add one more event listener to the document. And so if we open up 10 movies and then close them all, we will end up with 10 of the same event listeners attached to the document, which, of course, is not what we want. And so what this means is that here we also need to clean up our event listeners, */
  //     return function () {
  //       //we need to remove evet listeners
  //       document.removeEventListener("keydown", callback);
  //     };
  //   },
  //   [onCloseMovie]
  // );
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();

        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );
  //👆 explanation of why we are including this here is at lec151 at 12:20

  useEffect(
    function () {
      //adding the movie's title to web-page's title
      if (!title) return;
      document.title = `Movie | ${title}`;

      //this👇 is cleanup function (runs when the component is unmounted)
      return function () {
        document.title = "usePopcorn";
        // console.log(`Clean up effect for movie ${title}`)
        //                                          👆 can access this variable after the component is destroyed coz of closure
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {/* {prevUserRating?.[0] ? <p>You rated this movie {prevUserRating?.[0]} stars</p>:<StarRating maxRating={10} size={24} onSetRating={setUserRating}/>} */}
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      +Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated this movie {watchedUserRating}
                  <span>🌟</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          //this was in lec 152 at 21:00
          onClick={() => onDeleteWatched(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}
