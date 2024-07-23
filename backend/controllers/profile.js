export const handleProfileGetById = (req, res, db) => {
    const { id } = req.params;
    // don't need res.json because we are not sending through HTTP
    db.select('*').from('users').where({
        id: id
    }).then(user => {
        if(user.length) {
            res.json(user[0]);
        }
        else {
            res.status(400).json('Not found');
        }
    })
    .catch(err => res.status(400).json('Error getting user'));
};

export const handleProfileDeletion = (req, res, db, bcrypt) => {
    const { email, password } = req.body;

    db.transaction(trx => {
        trx
        .select('*')
        .from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);

            if(isValid) {
                // now we need to delete first from login
                return trx('login')
                .where('email', '=', data[0].email)
                .del()
                .returning('email')
                .then(userEmail => {
                    return trx('users')
                    .where('email', '=', userEmail[0].email)
                    .del()
                    .returning('*')
                    .then(deletedUser => {
                        res.json(deletedUser[0]);
                    })
                    .catch(err => res.status(400).json('Could not delete user from users database'))
                }).catch(err => res.status(400).json('Could not delete user from login table'))
            }
            else {
                res.status(400).json('Incorrect password');
            }
        })
        .then(trx.commit)
        .catch(trx.rollback);
    }).catch(err => res.status(400).json('could not delete account'));
};