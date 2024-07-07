import React, { useState, useEffect } from 'react';
import './styles/commentStyle.css'
import { commentApi, useDoCommentMutation, useGetCommentMutation } from '../../api/commentApi';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
export default function Comments({videoDetail}) {

console.log("videoDetail for videoId",videoDetail)
    const dispatch = useDispatch();

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState({
        commentType:2,
        commentMessage:String,
        courseId:null,
        sectionId:null,
        videoId:videoDetail

    });
    const [isCompleteDoComment,setIsCompleteDoComment]=useState(false);



    const [doComment] = useDoCommentMutation();
    const [getComments] = useGetCommentMutation();

    useEffect( ()  => {
        async function GetComments()
        {
            const getCommentModel = {
                commentType:newComment.commentType,
                courseId:null,
                sectionId:null,
                videoId:videoDetail
            }

            await getComments(getCommentModel).then((response) => {
                    setComments(response.data.result?.comments || [])
                    console.log("trigger",response)})
            
        }

       GetComments();

    }, [videoDetail,isCompleteDoComment]);

    // const handleCommentChange = (e) => {
    //     setNewComment((prevState) => {return{...prevState,commentMessage:e.target.va}});
    // };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        const commentModel = {
            commentType:newComment.commentType,
            commentMessage:newComment.commentMessage,
            courseId:newComment.courseId,
            sectionId:newComment.sectionId,
            videoId:videoDetail
        }
        console.log("trigger handle comment submit",commentModel)


        await doComment(commentModel).then((response) => { 
            if (response.data.isSuccess) {
                setIsCompleteDoComment(!isCompleteDoComment)
                toast.success(response.data.messages[0])
            }    
        })
    };

    return (
        <div className="comments-section">
            <h2>Comments</h2>
            <form onSubmit={handleCommentSubmit} className="comment-form">
                <textarea
                    value={newComment.commentMessage}
                    onChange={(e) => setNewComment((prevState) => {return {...prevState,commentMessage:e.target.value}})}
                    placeholder="Add a comment"
                    className="comment-input"
                />
                <button type="submit" className="comment-submit-btn">Submit</button>
            </form>
            <div className="comments-list">
                {comments.map((comment, index) => (
                    <div key={index} className="comment-item">
                        <p style={{color:"blue"}} >{comment.user.userName}</p><p>{comment.commentMessage}</p> 
                    </div>
                ))}
            </div>
        </div>
    );
}
