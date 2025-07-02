import ProtectedStudent from '@/components/protected/protected-student'

const ExamLayout = ({ children }: {
    children: React.ReactNode
}) => {
    return (
        <ProtectedStudent>
            {children}
        </ProtectedStudent>
    )
}

export default ExamLayout