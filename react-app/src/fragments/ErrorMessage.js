import React, { useState /*, useEffect*/ } from 'react';

function ErrorMessage({ message }) {

  //most of the logic from this box works with the state. all it does is conditionally render itself onto the top
  // of the page
  const [visible/*, setVisible*/] = useState(true);


  //commenting out the close button functionality for now because it's buggy and I can't figure it out -dan
  // box pop up should still work though
  

  /*
  useEffect(()=>{
    console.log('message changed');
    setVisible(true);
  }, [message]);*/


/*
  const handleClose = () => {
    setVisible(false);
  };*/

/*      <button onClick={handleClose} style={{ marginLeft: '10px', backgroundColor: 'white' }}>
        X
      </button>

      */
  console.log(visible);

  return visible ? (
    <div className="error-box">
      <span>{message}</span>

    </div>
  ) : null;
}

export default ErrorMessage;
