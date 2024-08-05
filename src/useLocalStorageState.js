import { useState,useEffect } from "react";

export function useLocalStorageState(initialState,key) {

    const [value, setValue] = useState(function () {
        /*So whenever the initial value of the use data depends on some sort of computation we should always pass in a function like this. So function that React can execute on its initial render. So we should not call a function inside useState(like this=> useState(localStorage.getItem('watched'))*/
        const storedValue = localStorage.getItem("key");
        // console.log(storedValue);
        return storedValue ? JSON.parse(storedValue) : initialState;
        // so we use this ternary here coz if we had no data before then the local storage was null but here if the storageValue is null then it would return the initialState which we passed an empty array[] during initialisation in app.js
    });
    
    useEffect(
        function () {
          localStorage.setItem("key", JSON.stringify(value));
          //                                        here 👆 we can just use 'value' coz its in useeffect coz it runs only when the effect is updated
        },
        [value,key]
    );
    
    return [value, setValue];
}