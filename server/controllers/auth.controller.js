const login = async(req,res) =>{
    res.send("Hola Login")
}


const register = async(req,res) =>{
    res.send("Hola Post")
}


module.exports = {
    login,
    register
}