import crypto from 'crypto';

function generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
}

export const forgotPassword = async (req, res, db, decrypt, nodemailer) => {
    const { email } = req.body;
    
    try {
        const user = await db('login').where('email', '=', email).first();
        if(!user) {
            return res.status(404).json('Email not found');
        }

        const token = generateResetToken();
        const expiration = new Date(Date.now() + 3600000); // 1 hour

        await db('login').where('id', '=', user.id).update({reset_token: token, reset_expiration: expiration});
        const resetUrl = `https://smart-brain-hz3j.onrender.com/reset_password?token=${token}`;

        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_PROVIDER,
            auth: {
                user: decrypt(process.env.EMAIL_HASHED, process.env.SECRET_KEY, process.env.IV),
                pass: decrypt(process.env.PASSWORD_HASHED, process.env.SECRET_KEY, process.env.IV)
            }
        });

        const mailOptions = {
            from: decrypt(process.env.EMAIL_HASHED, process.env.SECRET_KEY, process.env.IV),
            to: email,
            subject: 'Smart Brain Password Reset Request',
            text: `Click the following link to reset your password: ${resetUrl}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if(error) {
                return res.status(500).json('Error sending email');
            }

            res.json('Password reset email has been sent');
        });
    } catch(error) {
        res.status(500).json('Internal Server Error');
    }
};


export const resetPassword = async(req, res, db, bcrypt) => {
    const { token, password } = req.body;

    try {
        const user = await db('login').where("reset_token", "=", token).first();
        if(!user || new Date() > user.reset_expiration) {
            return res.status(400).json('Invalid or expired token');
        }

        const minLength = 14;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if(password.length < minLength || !hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChars) {
            return res.status(400).json('Invalid password');
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        
        await db('login').where("id", "=", user.id).update({
             hash: hashedPassword, 
             reset_token: null, 
             reset_expiration: null
        });

        res.json('Your password has been updated!');
    } catch(error) {
        res.status(500).json('Internal Server error');     
    }
};