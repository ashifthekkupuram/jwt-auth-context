import { createContext, useEffect, useState } from 'react'

import axios from '../api/axios'
import Loading from '../components/Loading'

export const authContext = createContext()

const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        const verifyToken = async () => {
            const token = localStorage.getItem('token')
            if(token){
                try{
                    const response = await axios.post('/auth/verify', {token})
                    setUser(response.data.data)
                }catch(err){
                    localStorage.removeItem('token')
                    setUser(null)
                }
            }else{
                setUser(null)
            }
        }
        verifyToken()
        setLoading(false)
        
    },[])

    return (
        loading ? <Loading/> :<authContext.Provider value={{user, setUser}}>
        {children}
    </authContext.Provider>
    )
}

export default AuthProvider