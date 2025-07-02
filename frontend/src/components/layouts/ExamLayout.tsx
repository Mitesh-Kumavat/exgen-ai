import ProtectedStudent from '@/components/protected/ProtectedStudent'

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