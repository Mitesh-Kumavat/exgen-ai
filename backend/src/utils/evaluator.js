export function evaluateMcqAnswers(mcqAnswers = [], mcqQuestions = []) {
    const marksPerQuestion = {};

    mcqQuestions.forEach((q, idx) => {
        marksPerQuestion[q._id.toString()] = {
            correctOption: q.correctOption,
            marks: q.marks,
        };
    });

    return mcqAnswers.map((ans) => {
        const { correctOption, marks } = marksPerQuestion[ans.questionId];
        const isCorrect = ans.selectedOption === correctOption;
        return {
            ...ans,
            isCorrect,
            marksAwarded: isCorrect ? marks : 0,
        };
    });
}

export function findSubjectiveQuestions(subjectiveAnswers = [], subjectiveQuestions = []) {
    const questionAndAnswer = [];

    subjectiveAnswers.forEach((ans) => {
        const question = subjectiveQuestions.find(q => q._id.toString() === ans.questionId);
        if (question) {
            questionAndAnswer.push({
                ...ans,
                question: question.text,
                marks: question.marks || 0,
            });
        }
    });

    subjectiveQuestions.forEach((q) => {
        if (!questionAndAnswer.some(ans => ans.questionId === q._id.toString())) {
            questionAndAnswer.push({
                questionId: q._id.toString(),
                question: q.question,
                answer: '',
                marks: q.marks || 0,
            });
        }
    });

    return questionAndAnswer;
}

export function findCodingQuestions(codingAnswers = [], codingQuestions = []) {
    const questionAndAnswer = [];

    codingAnswers.forEach((ans) => {
        const question = codingQuestions.find(q => q._id.toString() === ans.questionId);
        if (question) {
            questionAndAnswer.push({
                ...ans,
                question: question.text,
                marks: question.marks || 0,
            });
        }
    });

    codingQuestions.forEach((q) => {
        if (!questionAndAnswer.some(ans => ans.questionId === q._id.toString())) {
            questionAndAnswer.push({
                questionId: q._id.toString(),
                question: q.question,
                answer: '',
                marks: q.marks || 0,
            });
        }
    });

    return questionAndAnswer;
}
