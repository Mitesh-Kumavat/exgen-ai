import { AdminAuthContext } from '@/context/admin-context'
import { API_ENDPOINTS } from '@/utils/api-path'
import { axiosInstance } from '@/utils/axios-instance'
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ProtectedAdmin = ({ children }: {
    children: React.ReactNode
}) => {

    const navigate = useNavigate()
    const { logout, setAdmin } = useContext(AdminAuthContext);
    useEffect(() => {
        const verifyAdmin = async () => {
            try {
                const response = await axiosInstance.get(API_ENDPOINTS.AUTH.ADMIN.PROFILE, {
                    withCredentials: true
                })
                if (response.data.statusCode !== 200) {
                    logout();
                    navigate('/login')
                } else {
                    setAdmin({
                        _id: response.data.data._id,
                        email: response.data.data.email,
                        name: response.data.data.name,
                    })
                }
            } catch (error) {
                console.log(error);
                logout();
                navigate('/login')
            }
        }
        verifyAdmin()
    }, [])

    return (
        <>
            {children}
        </>
    )
}

export default ProtectedAdmin