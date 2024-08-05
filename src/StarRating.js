import { useState } from "react";
import PropTypes from 'prop-types';//these prop-types helps us to do type checking

const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const starContainerStyle = {
  display: "flex",
  // gap: "4px",
};

//PropTypes also helps in documentating👇 coz we can expect what type of data we can recieve
StarRating.propTypes = {
  //here it helps us to check what should the prop accept like only number is accepted and not string so this helps to catch bugs or mistakes
  maxRating: PropTypes.number,
  color: PropTypes.string,
  defaultRating: PropTypes.number,
  size: PropTypes.number,
  messages: PropTypes.array,
  className: PropTypes.string,
  onSetRating: PropTypes.func,
  //we also have .bool .object .isRequired  
}

export default function StarRating({
  maxRating = 5, //setting default props (or actually we are initialisng so many default props coz if we want to make this as publicAPI where consumers can change it according to their need)
  color = "#fcc419",
  size = 48,
  className = "",
  messages = [],
  defaultRating = 0,
  onSetRating,//this passed prop is a function which can contain state like setState like suppose if someone wants to show the rating on their own paragraph so that means the number should be passed from stars to their para so to do this we include this prop which will set their external state and display the external rated number(lec 119 at 14:00)
}) {
  /* Now, maybe you heard or read that we should 👇never initialize state from props. However, this is only true if you want the state variable to stay in sync with that passed in props, or in other words, if you want the state value to update in case that the prop value is also updated. However, that is clearly not the case here. So, we are really only using this defaultRating here basically as seed data, so really just as the initial state, and we don't care whether this value here maybe changes somewhere else in the application, so outside this component. And, therefore, this is perfectly fine and normal to do. All right, so it's really no problem to initialize your state based on a prop.*/
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(0);

  function handleRating(rating) {
    setRating(rating);
    if (onSetRating) onSetRating(rating);//here we check if the function is passed or not coz if its not passed then the code will break
  }

  const textStyle = {
    lineHeight: "1",
    margin: "0",
    color,
    fontSize: `${size / 1.5}px`,
  };
  return (
    <div style={containerStyle} className={className}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i} //so here 👇 we are registering the click event so if one star is clicked then rating will be 1 or more
            onRate={() => handleRating(i + 1)}
            //      👇is the current 'rating' is >= index+1 Which is always the rating for the currently generated star.
            // full={rating >= i + 1}
            full={tempRating ? tempRating >= i + 1 : rating >= i + 1} //this will handle the hover and rating both
            //so here like kya karegi yeh as like jaise setRating(mai pass huya 2) so rating=2 then so like becoz of array 5 tak jayega but 2 tak rating set hai so condition(rating>=i+1) bas 2 tak true rahega baaki ke liye false so iss true and false ke hisab se full star and empty star svg render hoga in Star componenet

            //these here will handle the hover effect
            onHoverIn={() => setTempRating(i + 1)}
            onHoverOut={() => setTempRating(0)}
            color={color}
            size={size}
          />
        ))}
      </div>
      <p style={textStyle}>
        {/* so👇 here we are checking if the 'messages' prop is sent then if they are appropriate length(their length is equal to maxRating) then the messsages will display and also to check if the messages can be displayed during hover effect(tempRating) */}
        {messages.length === maxRating
          ? messages[tempRating ? tempRating - 1 : rating - 1]
          : tempRating || rating || ""}
      </p>
    </div>
  );
}

function Star({ onRate, full, onHoverIn, onHoverOut, color, size }) {
  const starStyle = {
    width: `${size}px`,
    height: `${size}px`,
    display: "block",
    cursor: "pointer",
  };

  return (
    <span
      role="button"
      style={starStyle}
      // so here 👇as you can see we can only listen to onClick event in a true jsx element i.e div or span and not in components like <Star/> so we needed to pass in the prop  onRate
      onClick={onRate}
      //these👇 will handle the hover effect lec117
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
    >
      {full ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={color}
          stroke={color}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={color}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}

/*
FULL STAR

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 20 20"
  fill="#000"
  stroke="#000"
>
  <path
    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
  />
</svg>


EMPTY STAR

<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke="#000"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="{2}"
    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
  />
</svg>

*/
