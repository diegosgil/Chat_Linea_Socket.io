var express = require('express')
const bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io =require('socket.io')(http)

//Servir contenido estatico
app.use(express.static(__dirname))

//body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

var mensajes = [
    {
        nombre: "admin",
        mensaje: "Bienvenido"
    }
]
var usuarios = [
    {
        nombre: "admin"
    }
]

//endpoints/recursos
//Recibir mensaje
app.get('/mensajes', (req, res) => {
    res.send(mensajes)
})

app.get('/usuarios',(req,res)=>{
    res.send(usuarios)
});

//Enviar mensaje
app.post('/mensajes', (req, res) => {
    
    mensajes.push(req.body)
    //Emitir evento 'mensaje'
    io.emit('mensaje', req.body)
    
    res.sendStatus(200)
})

//Escuchar/emitir eventos con socket.io por consola
io.on('connection', (socket) => {
    var newUser = ""
    socket.on('nuevouserNombre', function(nickName){
        newUser = nickName + "_" + usuarios.length
        usuarios.push({nombre: newUser})
        console.log("Usuario conectado: " + newUser);
        //Avisar a los clientes que un nuevo usuario se conecto
        io.emit("clienteconectado", usuarios)
        
    });
    socket.on('disconnect', () => {
        eliminarUsuario(newUser);
        console.log("Usuario desconectado: " + newUser);
        //Avisar a los clientes que un nuevo usuario se desconecto
        io.emit('usuariodesconectado', 'desconectado: ' + newUser)
    })
})

function eliminarUsuario(val) {
    for(var i=0; i<usuarios.length; i++){
        if(usuarios[i].nombre == val){
            usuarios.splice(i, 1)
            break;
        }
    }
}

var server =http.listen(3000, () => {
    console.log("Servidor esta iniciado en el puerto: ", 
    server.address().port);
})