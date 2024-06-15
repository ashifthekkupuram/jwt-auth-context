import React, { useEffect, useState,useContext } from 'react'
import { useNavigate } from 'react-router-dom'
// import { ToastContainer, toast } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css';

import axios from '../api/axios'
import { authContext } from '../context/authProvider'

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g

const Register = () => {

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null) 
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  })
  const {user, setUser} = useContext(authContext)

  const onChange = (e) => {
    setForm({...form, [e.target.id]:e.target.value})
  }

  const handleSubmit = async (e) => {
    setLoading(true)
    setError(null)
    e.preventDefault()
    try{
      const response = await axios.post('/auth/register', form)
      navigate('/login')
      // toast.success('Account Created')
    }catch(err){
      if(err?.response){
        setError(err.response.data.message)
      }else{
        setError('Internal Server Error')
      }
    }
    setLoading(false)
  }

  return (
    <>
    <div className='form-container'>
      <form className='form' onSubmit={handleSubmit}>
        <h1>Register Page</h1>
        {error ? <div className="alert alert-danger">{error}</div> : null}
        <label htmlFor="email">Username : </label>
        <input value={form.username} autoComplete='off' type="text" id='username' onChange={onChange}  required />
        <label htmlFor="email">Email : </label>
        <input value={form.email} autoComplete='off' type="email" id='email' onChange={onChange}  required />
        <label htmlFor="password">Password : </label>
        <input value={form.password} type="password" id='password' onChange={onChange} required  />
        <button disabled={!(form.email.match(EMAIL_REGEX) && form.password && form.username) || loading}>{loading ? 'Loading...' : 'Register'}</button>
      </form>
    </div>
    {/* <ToastContainer /> */}
    </>
  )
}

export default Register
