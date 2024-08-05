import { useEffect } from "react";

export function useKey(key,action) {
    useEffect(
        function () {
          function callback(e) {
              if (e.code.toLowerCase() === key.toLowerCase()) {
                
                  action();
            //   onCloseMovie(); as callback function action() here
              // console.log("CLOSING");
            }
          }
    
          document.addEventListener("keydown", callback);
    
          /*each time that a new MovieDetails component mounts, a new event listener is added to the document, so basically always an additional one to the ones that we already have. So again, each time that this effect here is executed, it'll basically add one more event listener to the document. And so if we open up 10 movies and then close them all, we will end up with 10 of the same event listeners attached to the document, which, of course, is not what we want. And so what this means is that here we also need to clean up our event listeners, */
          return function () {
            //we need to remove evet listeners
            document.removeEventListener("keydown", callback);
          };
        },
        [action,key]
      );
}