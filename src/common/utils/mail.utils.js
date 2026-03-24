import nodemailer from 'nodemailer';

export function sendEmail({to, subject, html}) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    
    });
    transporter.sendMail({
        from: `"IncogChat" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    });
}