const jwt = require('jsonwebtoken');

exports.authCheckTeam = async (req, res, next) =>{
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - Missing Authorization header' });
    }
    jwt.verify(token, process.env.signingkey, (err, team) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden - Invalid token' });
        }
        if(team.role == "student"){
            req.student = student;
            next();
        }else{
            return res.status(403).json({ error: 'Forbidden - Unauthorized' });
        }
    });
};
