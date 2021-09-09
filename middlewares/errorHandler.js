module.exports = (err, req, res, next) => {
    const error = err
    console.error(error)
    if(error.name === 'SequelizeValidationError'){
        const messages = []
        for(let i = 0; i < error.errors.length; i++){
            messages.push(error.errors[i].message)
        }
        res.status(400).json({
            err : messages
        })
    }
    else if(error.name === 'transactionError'){
        res.status(400).json({
            err : error.message
        })
    }
    else if(error.name === 'loginError'){
        res.status(400).json({
            err : 'email / password is wrong'
        })
    }
    else if(error.name === 'dataNotFound'){
        res.status(404).json({
            err : 'Cannot find Data'
        })
    }
    else if(error.name === 'NotAuthorized'){
        res.status(401).json({
            err : error.message
        })
    }
    else if(error.name === 'SequelizeDatabaseError'){
        res.status(500).json({
            err : 'Internal Server Error'
        })
    }
    else if(error.name === 'JsonWebTokenError'){
        res.status(401).json({
            err : error.message
        })
    }
    else{
        res.status(500).json({
            err : 'Internal Server Error'
        })
    }
}