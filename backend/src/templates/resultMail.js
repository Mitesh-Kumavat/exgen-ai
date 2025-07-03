export const mailResultTemplate = (
    name,
    enrollmentNumber,
    answerSheetId,
    examId,
    examTitle,
    totalMarks,
    subject,
    achievedMarks,
    category,
    feedbackSummary,
    frontendBaseUrl
) => {
    const resultLink = `${frontendBaseUrl}/${examId}/result/${answerSheetId}`;
    return `
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }
          .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .email-header {
            background-color: #004080;
            color: #ffffff;
            padding: 24px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 0.5px;
          }
          .email-body {
            padding: 30px;
            color: #333333;
          }
          .email-body p {
            font-size: 16px;
            line-height: 1.6;
            margin: 12px 0;
          }
          .highlight {
            font-weight: 600;
            color: #000000;
          }
          .result-box {
            background-color: #f1f1f1;
            padding: 15px 20px;
            border-left: 4px solid #004080;
            border-radius: 6px;
            margin: 20px 0;
          }
          .result-box p {
            margin: 8px 0;
            font-size: 16px;
          }
          .feedback {
            margin-top: 20px;
            font-style: italic;
            color: #555555;
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 6px;
          }
          .view-button {
            display: inline-block;
            margin-top: 25px;
            padding: 12px 20px;
            background-color: #004080;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: bold;
          }
          .email-footer {
            padding: 20px 30px;
            background-color: #f9f9f9;
            color: #555555;
            font-size: 14px;
            text-align: center;
            border-top: 1px solid #eeeeee;
          }
          .footer-brand {
            font-weight: bold;
            color: #004080;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            Examination Result Notification
          </div>
          <div class="email-body">
            <p>Dear ${name},</p>
            <p>Your results for the recent exam have been published. Please find the summary below:</p>

            <div class="result-box">
              <p>📘 <strong>Exam:</strong> ${examTitle}</p>
              <p>📚 <strong>Subject:</strong> ${subject}</p>
              <p>🧑‍🎓 <strong>Enrollment Number:</strong> <span class="highlight">${enrollmentNumber}</span></p>
              <p>📊 <strong>Scored:</strong> ${achievedMarks} / ${totalMarks}</p>
              <p>📈 <strong>Category:</strong> <span class="highlight">${category.toUpperCase()}</span></p>
            </div>

            <div class="feedback">
              <strong>Feedback Summary:</strong><br/>
              ${feedbackSummary}
            </div>

            <a class="view-button" href="${resultLink}" target="_blank">🔍 View Full Result Analysis</a>

            <p style="margin-top: 20px;">We wish you the best for your future assessments.</p>
          </div>
          <div class="email-footer">
            Regards,<br/>
            <span class="footer-brand">LJ University Examination Cell</span>
          </div>
        </div>
      </body>
    </html>
  `;
};
