import React, { useState } from 'react'
import axios from '../api/axios'
import { toast } from 'react-toastify'

const CommentInputSection = ({postId}) => {

    const [comment, setComment] = useState('')

    const onClick = async (e) => {
        e.preventDefault()
        try{
            await axios.post(`/comment/${postId}`, {content: comment}, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}})
            toast.success('Comment added')
        }catch(err){
            if(err?.response){
                toast.error(err.response.data.message)
            }else{
                toast.error("Internal Server Error")
            }
        }
    }

  return (
    <div className='comment-input-section'>
      <textarea value={comment} type="text" onChange={(e)=>setComment(e.target.value)}  required/>
      <button disabled={(comment.trim().length < 1)} onClick={onClick}>Comment</button>
    </div>
  )
}

export default CommentInputSection
