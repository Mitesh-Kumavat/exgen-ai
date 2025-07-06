export const mailQueryResolveTemplate = (
  name,
  enrollmentNumber,
  response,
  frontendBaseUrl,
  examId,
  answerSheetId
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
            font-weight: bold;
            color: #000000;
          }
          .query-box {
            background-color: #f1f1f1;
            padding: 15px 20px;
            border-left: 4px solid #004080;
            border-radius: 6px;
            margin-top: 20px;
          }
          .query-box p {
            margin: 8px 0;
            font-size: 16px;
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
            Query Resolution Notification
          </div>
          <div class="email-body">
            <p>Dear ${name},</p>
            <p>We are pleased to inform you that your query has been resolved. Below are the details:</p>

            <div class="query-box">
              <p>📘 <strong>Enrollment Number:</strong> <span class="highlight">${enrollmentNumber}</span></p>
              <p>💬 <strong>Response:</strong> <span class="highlight">${response}</span></p>
            </div>

            <a class="view-button" href="${resultLink}" target="_blank">🔍 View Updated Result</a>

            <p style="margin-top: 20px;">If you have any further questions or concerns, please do not hesitate to reach out.</p>
            <p>Thank you for your patience and understanding.</p>
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
