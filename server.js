//configurar o servidor
const express = require("express")
const server  = express()

//configurar o servidor para apresentar arquivos estaticos
server.use(express.static('public'))

//habilitar do formulário
server.use(express.urlencoded({extended: true}))

//configurar conexão com a base
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'sysadmin',
    host: 'localhost',
    port: 5432,
    database: 'doe'

})
//configurar a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./",{
    express: server,
    noCache: true,
})

/*const donors = [
    {
        name: "Douglas Nunes",
        blood: "AB+"
    },
    {
        name: "Kelen Matos",
        blood: "B+"
    },
    {
        name: "July Matos",
        blood: "O+"
    },
    {
        name: "Miguel Matos",
        blood: "A-"
    },
]*/

//Configura a apresentação da pagina
server.get("/", function(req, res){
    db.query("SELECT * FROM donors", function(err, result){
        if(err) return res.send("Erro de banco de dados.")

        const donors = result.rows
        return res.render("index.html", { donors })
    })
    
})

server.post("/", function(req, res){
    //pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood= req.body.blood

    if(name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatórios.")
    }
    //Coloca valores dentro do banco
    const query = `
        INSERT INTO donors("name", "email", "blood")
        VALUES ($1, $2, $3)`
    const values = [name, email, blood]
    db.query(query, values, function(err){
        if(err) return res.send("Erro no banco de dados.")

        //fluxo ideal
        return res.redirect("/")
    })
//Coloco valores dentro do array
/*    donors.push({
        name: name,
        blood: blood,
    })*/
    
})



//Liga o server e permite o acesso na porta 3000
server.listen(3000, function(){
    console.log("iniciei o servidor.")
})