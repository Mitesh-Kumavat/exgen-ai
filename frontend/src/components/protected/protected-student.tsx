import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '@/utils/axios-instance'
import { API_ENDPOINTS } from '@/utils/api-path'
import { StudentAuthContext } from '@/context/student-context'

const ProtectedStudent = ({ children }: {
    children: React.ReactNode
}) => {
    const navigate = useNavigate();
    const { logout, setStudent } = useContext(StudentAuthContext);

    useEffect(() => {
        const verifyStudent = async () => {
            try {
                const response = await axiosInstance.get(API_ENDPOINTS.AUTH.STUDENT.PROFILE, {
                    withCredentials: true
                })
                if (response.data.statusCode != 200) {
                    logout();
                    navigate('/login')
                } else {
                    setStudent({
                        _id: response.data.data._id,
                        mobile: response.data.data.mobile,
                        name: response.data.data.name,
                        email: response.data.data.email,
                        enrollmentNumber: response.data.data.enrollmentNumber,
                        semester: response.data.data.semester,
                        branch: response.data.data.branch,
                        createdAt: response.data.data.createdAt
                    })
                }
            } catch (e) {
                logout();
                console.error(e);
                navigate('/login')
            }
        }
        verifyStudent()
    }, [])

    return (
        <>
            {children}
        </>
    )
}

export default ProtectedStudent