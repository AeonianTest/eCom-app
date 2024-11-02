import React, { useState, useEffect } from 'react';

function SuccessMessage({ message }) {
  const [visible, setVisible] = useState(true);

  /*
  useEffect(()=>{
    console.log('message changed');
    setVisible(true);
  }, [message]);


*/

// since it didnt work on the error box I'm not sure if this will work but ill leave it in since its not breaking anything
// -dan
  const handleClose = () => {
    setVisible(false);
  };



      
  console.log(visible);

  return visible ? (
    <div className="success-box">
      <span>{message}</span>
      <button onClick={handleClose} style={{ marginLeft: '10px', backgroundColor: 'white' }}>
        X
        </button>
    </div>
  ) : null;
}

export default SuccessMessage;
