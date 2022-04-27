var socket = io()
//Solicitar nombre/correo/username
var nickName = prompt('Cual es tu nombre: ')
var correo = prompt('Cual es tu correo: ')        //*******
var userName = prompt('Cual es tu user-name: ')   //*******

const APP_VUE = {
    
    data() {
        
        return {
            nickName: nickName,
            correo: correo,
            userName: userName,
            listaUsuarios: [],
            listaMensajes:[],
            mensajeText:""

        }
    },
    methods:{
        agregarUsuarios(data) {
            this.listaUsuarios.push(data.nombre)
        },
        getUsuarios(){
            this.listaUsuarios=[]
            $.get("http://localhost:3000/usuarios", (data) => {
            data.forEach(this.agregarUsuarios)
            });
        },
        enviarMensaje(){
            var mensaje = {
                nombre: this.nickName,
                mensaje: this.mensajeText
            }
            //Enviar mensaje al servidor
            this.postMensaje(mensaje);
            this.mensajeText=""
            
        },
        postMensaje(data){
            $.post("http://localhost:3000/mensajes", data);
        },
        agregarMensajes(data){
            
            this.listaMensajes.push(` ${data.nombre}: ${data.mensaje}`)
            
            $("#mensajes").animate({
                scrollTop: $('#mensajes').get(0).scrollHeight
            },100);
        },
        getMensajes(){
            this.listaMensajes=[]
            $.get("http://localhost:3000/mensajes", (data) => {
            data.forEach(this.agregarMensajes)
            });
            
        }
        
        
    },
    mounted(){
        
        socket.emit('nuevouserNombre', nickName)
        socket.emit('nuevouserCorreo', correo)
        socket.emit('nuevouserUserName', userName)
        socket.on('mensaje', (data)=>{
            
            this.agregarMensajes(data)
            
        }) 
        socket.on('clienteconectado', (data) => {
            
            this.getUsuarios()
        });
        socket.on('usuariodesconectado', (data) => {
            //Actualizar usuarios
            
            this.getUsuarios();
        })
        
        
    }
    

}
Vue.createApp(APP_VUE).mount("#app")



