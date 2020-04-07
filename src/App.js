import React, { useState } from "react";
import axios from "axios";
import StripeForm from './StripeForm';
import "./App.css";

const USER_ID_KEY = 'user_id';
export const API_URL = 'http://localhost:8000';

const WEBSOCKET_URL = `ws://localhost:8001/?${USER_ID_KEY}=${localStorage.getItem(USER_ID_KEY)}`;

// connect to websocket channel only after login
const connection = new WebSocket(WEBSOCKET_URL);

connection.onerror = (error) => {
  console.log(`WebSocket error: ${error}`)
}

connection.onmessage = (e) => {
  console.log(e.data)
}

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
            id: localStorage.getItem(USER_ID_KEY)
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
        `${API_URL}/articles/7228d890-78d8-11ea-ab7a-273da230e9f8/comments`,
        {
          author: {
            id: localStorage.getItem(USER_ID_KEY)
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
        <h3>Publish article</h3>
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
        <h3>Send some comment!</h3>
        <input
          type="textarea"
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
        />
        <button type="submit">Send comment</button>
        <h3>Get article .pdf report!</h3>
        <button type="button" onClick={getReport}>Get report</button>
      </form>
      <StripeForm />
    </>
  );
};

export default App;
