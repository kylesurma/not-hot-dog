import React, { useState, useEffect, useRef } from "react";
import { modelLoader, getPrediction } from "./model";
import Button from "@material-ui/core/Button";
import Popover from "@material-ui/core/Popover";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import Box from "@material-ui/core/Box";

const App = () => {
  const [image, setImage] = useState(useRef(null));
  const [isHotDog, setIsHotDog] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);
  const imageUploader = useRef(null);

  const handleImage = (e) => {
    setIsHotDog("");
    const [newImage] = e.target.files;
    const reader = new FileReader();
    const { current } = image;
    current.file = newImage;
    reader.onload = (e) => {
      current.src = e.target.result;
    };
    setImageUploaded(true);
    reader.readAsDataURL(newImage);
  };

  const handlePredict = async () => {
    if (imageUploaded) {
      const results = await getPrediction(image.current);
      console.log(results)
      const hotDog = results[0] > results[1] ? "Hot Dog" : "Not Hot Dog";
      setIsHotDog(hotDog);
    }
  };

  useEffect(() => {
    modelLoader();
    return () => {
      setImage([]);
    };
  }, []);

  return (
    <div className="app-container">
      <input
        type="file"
        accept="image/*"
        onChange={handleImage}
        ref={imageUploader}
        style={{
          display: "none",
        }}
      />
      <div
        style={{
          display: "flex",
        }}
        onClick={() => imageUploader.current.click()}
      >
        <img
          ref={image}
          src="Hotdog.png"
          style={{
            width: "auto",
            height: "400px",
            position: "relative",
          }}
        />
      </div>

      <PopupState variant="popover" popupId="hot-dog-answer-reveal">
        {(popupState) => (
          <div>
          <div {...bindTrigger(popupState)} >
          <Button
          variant="outlined"
          onClick={() => handlePredict()}
          >
              Hot Dog?
            </Button>
            </div>
            <Popover
              {...bindPopover(popupState)}

              anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
            >
              <Box p={2}>
                <div style={{
                  fontSize: '40px'
                }}>{isHotDog ? isHotDog : 'Add an image'}</div>
              </Box>
            </Popover>
          </div>
        )}
      </PopupState>
    </div>
  );
};

export default App;
