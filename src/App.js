import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = 'http://localhost:8000';

const App = () => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [imageURl, setImageUrl] = useState("");
  const [commentText, setCommentText] = useState("");

  const getSignedrequest = async file => {
    try {
      return await axios.get(
        `${API_URL}/sign-s3?file-name=${file.name}&file-type=${file.type}`
      );
    } catch (error) {
      console.log(error);
    }
  };

  const uploadFile = async (signedRequest, file) => {
    await axios.put(signedRequest, file, {
      headers: {
        "Content-Type": file.type
      }
    });
  };

  const onFileSelected = e => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
    }
  };

  const onSubmit = async e => {
    e.preventDefault();

    const response = await getSignedrequest(image);
    await uploadFile(response.data.signedRequest, image);
    setImageUrl(response.data.url);

    await axios
      .post(
        `${API_URL}/articles`,
        {
          title,
          text,
          coverImageUrl: response.data.url,
          author: {
            id: "e586f450-5ee5-11ea-8c79-6369f763d335"
          },
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

  const postComment = async e => {
    e.preventDefault();

    await axios
      .post(
        `${API_URL}/articles/95ba2270-6eae-11ea-b9dd-8779de227448/comments`,
        {
          author: {
            id: "e586f450-5ee5-11ea-8c79-6369f763d335"
          },
          text: commentText.trim()
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdC50IiwicGFzc3dvcmQiOiJ6aGVwYSIsImlhdCI6MTU4MzQxNTIzM30.KNDAiDKLK7AL2ZhAqUlmnrXmB4PXZqrkRoeMJbpObuA"
          }
        }
      )
      .catch(function(error) {
        console.log(error);
      });
  };

  const getReport = async e => {
    e.preventDefault()

    const { data } = await axios
      .get(
        `${API_URL}/articles/95ba2270-6eae-11ea-b9dd-8779de227448/report`,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdC50IiwicGFzc3dvcmQiOiJ6aGVwYSIsImlhdCI6MTU4MzQxNTIzM30.KNDAiDKLK7AL2ZhAqUlmnrXmB4PXZqrkRoeMJbpObuA"
          }
        }
      )
      .catch(function(error) {
        console.log(error);
      });

    window.open(`${API_URL}/${data}`, '__blank')
  }

  return (
    <>
      <form onSubmit={onSubmit} className="App">
        {imageURl && <img style={{ width: "100%" }} src={imageURl} alt="" />}
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
          onChange={onFileSelected}
          type="file"
          placeholder="Select article cover"
        />
        <button type="submit">Publish</button>
      </form>
      <form style={{ margin: "20px auto", width: 400 }} onSubmit={postComment}>
        <input
          type="textarea"
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
        />
        <button type="submit">Send comment</button>
        <button type="button" onClick={getReport}>Get report</button>
      </form>
    </>
  );
};

export default App;
