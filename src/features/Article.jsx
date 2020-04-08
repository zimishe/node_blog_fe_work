import React, { useState } from "react";
import axios from "axios";
import StripeForm from '../StripeForm';
import { API_URL, USER_ID_KEY, ACCESS_TOKEN_KEY } from '../App';

const Article = () => {
  const [commentText, setCommentText] = useState("");

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
              `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
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
              `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
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
  )
}

export default Article
