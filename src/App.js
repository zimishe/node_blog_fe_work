import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("")
  const [imageVisible, setImageVisible] = useState(false)

  const getSignedrequest = async file => {
    try {
      const response = await axios.get(
        `http://localhost:8000/sign-s3?file-name=${file.name}&file-type=${file.type}`
      );

      setImageUrl(response.data.url);
      uploadFile(response.data.signedRequest, file);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadFile = async (signedRequest, file) => {
    await axios.put(signedRequest, file, {
      headers: {
        'Content-Type': file.type
      }
    });

    setImageVisible(true);
  };

  const onFileSelected = e => {
    const file = e.target.files[0];

    if (file) {
      setImage(e.target.value);
      getSignedrequest(file);
    }
  };

  const onSubmit = e => {
    e.preventDefault();

    axios
      .post(
        "http://localhost:8000/articles",
        {
          title,
          text
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdC50IiwicGFzc3dvcmQiOiJ6aGVwYSIsImlhdCI6MTU4MzIyNjE3MX0.-NAioRK8A1aXR0Rws6KFW0Mv62qr0_AKCRaY2PDX0iU"
          }
        }
      )
      .catch(function(error) {
        console.log(error);
      });
  };

  return (
    <form onSubmit={onSubmit} className="App">
      {imageUrl && imageVisible && <img src={imageUrl} alt="" />}
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        type="text"
        placeholder="Article title"
      />
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        type="textarea"
        placeholder="Article text"
      />
      <input
        value={image}
        onChange={onFileSelected}
        type="file"
        placeholder="Select article cover"
      />
      <button type="submit">Publish</button>
    </form>
  );
};

export default App;
