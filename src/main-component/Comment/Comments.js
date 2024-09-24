import React, { useState, useEffect } from "react";
import "./styles/commentStyle.css";
import {
  commentApi,
  useDoCommentMutation,
  useGetCommentMutation,
} from "../../api/commentApi";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import CommentIcon from "../../icons/CommentIcon";

export default function Comments({ videoDetail }) {

  console.log("trigger comments",videoDetail)

  const dispatch = useDispatch();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    commentType: 2,
    commentMessage: String,
    courseId: null,
    sectionId: null,
    videoId: videoDetail,
  });
  const [isCompleteDoComment, setIsCompleteDoComment] = useState(false);
  const [doComment] = useDoCommentMutation();
  const [getComments] = useGetCommentMutation();

  useEffect(() => {
    async function GetComments() {
      const getCommentModel = {
        commentType: newComment.commentType,
        courseId: null,
        sectionId: null,
        videoId: videoDetail,
      };

      await getComments(getCommentModel).then((response) => {
        setComments(response.data.result?.comments || []);
      });
    }

    GetComments();
  }, [videoDetail, isCompleteDoComment]);

  // const handleCommentChange = (e) => {
  //     setNewComment((prevState) => {return{...prevState,commentMessage:e.target.va}});
  // };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const commentModel = {
      commentType: newComment.commentType,
      commentMessage: newComment.commentMessage,
      courseId: newComment.courseId,
      sectionId: newComment.sectionId,
      videoId: videoDetail,
    };

    await doComment(commentModel).then((response) => {
      if (response.data.isSuccess) {
        setIsCompleteDoComment(!isCompleteDoComment);
        toast.success(response.data.messages[0]);
      }
    });
  };

  return (
    <div className="comments-section px-4 flex flex-col gap-3 ">
      <div className="flex gap-2">
        {" "}
        <CommentIcon /> <h2>Comments</h2>
      </div>
      <form onSubmit={handleCommentSubmit} className="comment-form">
        <textarea
          value={newComment.commentMessage}
          onChange={(e) =>
            setNewComment((prevState) => {
              return { ...prevState, commentMessage: e.target.value };
            })
          }
          placeholder="Share your questions and thoughts."
          className="comment-input "
        />
        <button type="submit" className="comment-submit-btn">
          Submit
        </button>
      </form>
      <div className="comments-list flex flex-col gap-2 shadow-md">
        {comments.map((comment, index) => (
          <div key={index} className="comment-item bg-white rounded-md">
            <p className="text-black font-semibold">{comment.user.userName}</p>
            <p>{comment.commentMessage}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
