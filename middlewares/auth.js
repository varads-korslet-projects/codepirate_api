const jwt = require('jsonwebtoken');

exports.authCheckMember = async (req, res, next) =>{
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - Missing Authorization header' });
    }
    jwt.verify(token, process.env.signingkey, (err, member) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden - Invalid token' });
        }
        if(member.role == "member"){
            req.member = member;
            next();
        }else{
            return res.status(403).json({ error: 'Forbidden - Unauthorized' });
        }
    });
};
