

export const getExamPapers = async (req, res) => {
    // get all the exam papers for the particular exam
}

export const generateExamPaperForStudent = async (req, res) => {
    //generate exam paper for each student by making request to the exam paper service on the python fastapi server

    // HOW TO DO THIS?
    // 1. Get the exam ID from the request parameters
    // 2. Fetch the exam details from the database
    // 3. Fetch the question paper schema and PDF links of the chapter 
    // 4. Generate the exam paper using the exam paper ai service
    // 5. Save the generated exam paper to the database along with the student ID
    // 6. Return the generated exam paper to the student with minimal details so that cheating is not possible via viewing the api response
    // NOTE: The exam paper should be generated only once for each student and should not be regenerated if it already exists in the database, and also make sure to handle the case where the exam paper generation fails, and if the exam paper generated successfully then store it with proper relation so that it is connected to the student and exam and the question paper schema.

}