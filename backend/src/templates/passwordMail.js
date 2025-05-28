export const mailPasswordTemplate = (name, enrollmentNumber, password) => {
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
                    .credentials-box {
                        background-color: #f1f1f1;
                        padding: 15px 20px;
                        border-left: 4px solid #004080;
                        border-radius: 6px;
                        margin: 20px 0;
                    }
                    .credentials-box p {
                        margin: 8px 0;
                        font-size: 16px;
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
                        LJ University Examination Portal
                    </div>
                    <div class="email-body">
                        <p>Dear ${name},</p>
                        <p>We hope you are well. Please find below your login credentials for the upcoming online examination.</p>

                        <div class="credentials-box">
                            <p>📘 Enrollment Number: <span class="highlight">${enrollmentNumber}</span></p>
                            <p>🔐 Password: <span class="highlight">${password}</span></p>
                        </div>

                        <p><strong>Important:</strong> Please save this information securely and do not share it with others. You will be required to use these credentials to log in on the day of the examination.</p>
                        <p>We wish you the very best in your preparation and success in your exam.</p>
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
