import ProtectedStudent from '@/components/protected/ProtectedStudent'

const ExamLayout = () => {
    return (
        <ProtectedStudent>
            <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
                <div className='text-2xl font-bold mb-4'>Exam Portal</div>
            </div>
        </ProtectedStudent>
    )
}

export default ExamLayout