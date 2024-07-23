import { promises as dnsPromises }  from 'dns';
import fs from 'fs';

async function checkEmailDomain(email) {
    // get domain name from email
    const domain = email.split('@')[1];

    // check to see if domain name from email such as gmail.com is able to receive emails by checking mx records
    try {
        // see if this domain can receive emails by checking mx records
        const records = await dnsPromises.resolveMx(domain);
        if(!records || records.length === 0) {
            return false;
        }
        else {
            return true;
        }
    } catch(error){
        return false;
    }
}


export const handleRegister = async(req, res, db, bcrypt, decrypt, nodemailer) => {
    const { email, name, password } = req.body;
    
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if(!email || !name || !password) {
        return res.status(400).json('Invalid Registration 1');
    }

    // check if name is valid
    else if(name.length === 1) {
        return res.status(400).json('Invalid Registration 2');
    }

    else if (!emailPattern.test(email)) {
        return res.status(400).json('Invalid Registration 3');
    }

    // check password
    else if(password.length < minLength || !hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChars) {
        return res.status(400).json('Invalid Registration 4');
    }

    else {
        const isValidEmail = await checkEmailDomain(email);

        if(isValidEmail) {
            const saltRounds = 10;
            const hash = bcrypt.hashSync(password, saltRounds);
        
            db.transaction(trx => {
                trx.insert({
                    hash: hash,
                    email: email
                })
                .into('login')
                .returning('email')
                .then(loginEmail => {
                    return trx('users')
                    // .returning('*') means after we insert our user below return all columns
                    .returning('*')
                    .insert({
                        email: loginEmail[0].email,
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        // next try sending a welcome message with the welcome.html
                        fs.readFile('./welcome/welcome.html', 'utf8', (err, data) => {
                            if(err) {
                                return res.status(400).json('Invalid Registration 5');
                            }

                            else {
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
                                    subject: `Welcome to Smart Brain, ${name}!`,
                                    text: 'Hello! I just wanted to thank you for trying Smart Brain. I hope you have a great experience with the application. I plan on adding more features, so be on the lookout for updates in the future :). Please Note: This is portfolio project. I will not be sending any further updates at this time. All current users will be notified if I do decide to email updates with the option to subscribe. Thank you :).',
                                    html: data
                                };

                                transporter.sendMail(mailOptions, (error, info) => {
                                    if(error) {
                                        return res.status(400).json('Invalid Registration 6');
                                    }

                                    res.json(user[0]);
                                });
                            }
                        });
                    })
                }).then(trx.commit)
                .catch(trx.rollback);
            }).catch(error => res.status(400).json('Unable to register'));
        }

        else {
            res.status(400).json('Invalid Registration 7');
        }
    }
};