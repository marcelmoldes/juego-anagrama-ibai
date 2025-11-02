import audioIbai from "../assets/ibaiaudio.mp3";

const btnEmpezar = document.getElementById("btn-empezar");
const btnReglas = document.getElementById("btn-reglas");
const btnCerrar = document.getElementById("cerrar-modal");
const chatContainer = document.getElementById("chat-container");
const inputContainer = chatContainer.querySelector(".mt-auto");
const inputMsg = document.getElementById("input-msg");
const btnEnviar = document.getElementById("btn-enviar");
const modalReglas = document.getElementById("modal-reglas");

const mensajeIbai = "¡Hola! Aquí tienes la pista para adivinar la frase secreta. ¡Buena suerte!";
const solucion = "CIRQUE DU SOL";

let intervaloTiempo = null;

// --- Funciones ---
function enviarMensajeAudio(texto, rutaAudio) {
  const msg = document.createElement("div");
  msg.className = "flex flex-col items-start space-y-2";

  const textoDiv = document.createElement("div");
  textoDiv.className = "bg-white p-3 rounded-lg shadow text-gray-900 max-w-xs";
  textoDiv.textContent = `🎤 Ibai: ${texto}`;
  msg.appendChild(textoDiv);

  if (rutaAudio) {
    const audioElement = document.createElement("audio");
    audioElement.controls = true;
    audioElement.className = "w-full mt-1 rounded";
    audioElement.src = rutaAudio;
    msg.appendChild(audioElement);

    audioElement.addEventListener("ended", () => iniciarJuego(msg, audioElement));
  }

  if (inputContainer) chatContainer.insertBefore(msg, inputContainer);
  else chatContainer.appendChild(msg);

  chatContainer.scrollTop = chatContainer.scrollHeight;
  return msg;
}

function validarRespuestaInput() {
  const respuesta = inputMsg.value.trim().toUpperCase().replace(/\s/g,'');
  const solucionNormalizada = solucion.replace(/\s/g,'').toUpperCase();
  if(respuesta === solucionNormalizada){
    alert("✅ ¡Correcto! Has completado la frase.");
    inputMsg.disabled = true;
    btnEnviar.disabled = true;
  } else {
    alert("❌ Incorrecto, inténtalo de nuevo.");
    inputMsg.value = "";
  }
}

function iniciarJuego(msg, audioElement){
  audioElement.controls = false;
  audioElement.style.opacity = "0.5";
  audioElement.disabled = true;

  const frase = solucion;
  const letrasDesordenadas = frase.replace(/\s/g,'').split('').sort(() => Math.random()-0.5);

  const contenedorLetras = document.createElement("div");
  contenedorLetras.id = "letras-container";
  contenedorLetras.className = "flex flex-wrap gap-2 mb-4";

  const contenedorFrase = document.createElement("div");
  contenedorFrase.id = "frase-usuario";
  contenedorFrase.className = "flex flex-wrap gap-2 mb-4 min-h-[2rem] border border-gray-300 p-2 rounded";

  msg.appendChild(contenedorFrase);

  let tiempo = 0;
  const contadorDiv = document.createElement("div");
  contadorDiv.className = "text-lg font-bold mb-2";
  msg.appendChild(contadorDiv);

  intervaloTiempo = setInterval(() => {
    tiempo++;
    contadorDiv.textContent = `Tiempo: ${tiempo} s`;
  }, 1000);

  const mensajeFinalDiv = document.createElement("div");
  mensajeFinalDiv.id = "mensaje-final";
  mensajeFinalDiv.className = "mt-2 font-semibold text-green-700";
  msg.appendChild(mensajeFinalDiv);

  const letrasUsadas = {};
  letrasDesordenadas.forEach(letra => letrasUsadas[letra] = (letrasUsadas[letra]||0)+1);

  letrasDesordenadas.forEach(letra => {
    const letraDiv = document.createElement("button");
    letraDiv.textContent = letra;
    letraDiv.dataset.letra = letra;
    letraDiv.className = "bg-gray-300 rounded p-2 w-10 h-10 text-center font-bold hover:bg-gray-400";

    letraDiv.addEventListener("click", () => {
      if(!letrasUsadas[letra] || letrasUsadas[letra]<=0) return;

      const span = document.createElement("span");
      span.textContent = letra;
      span.className = "font-bold text-lg";
      contenedorFrase.appendChild(span);

      letrasUsadas[letra]--;
      if(letrasUsadas[letra]<=0) letraDiv.disabled = true;

      comprobarFrase(contenedorFrase, mensajeFinalDiv, tiempo);
    });

    contenedorLetras.appendChild(letraDiv);
  });

  msg.appendChild(contenedorLetras);
}

function comprobarFrase(contenedorFrase, mensajeFinalDiv, tiempo){
  const fraseUsuario = Array.from(contenedorFrase.children).map(span=>span.textContent).join('');
  const usuarioNormalizado = fraseUsuario.replace(/\s/g,'').toUpperCase();
  const solucionNormalizada = solucion.replace(/\s/g,'').toUpperCase();

  if(usuarioNormalizado.length === solucionNormalizada.length){
    if(usuarioNormalizado === solucionNormalizada){
      clearInterval(intervaloTiempo);
      mensajeFinalDiv.textContent = `✅ ¡Juego ganado! Tiempo total: ${tiempo} s`;
      alert("✅ ¡Correcto! Has completado la frase.");
    } else {
      contenedorFrase.classList.add("animate-shake", "border-red-500");
      setTimeout(()=>{
        contenedorFrase.classList.remove("animate-shake", "border-red-500");
        contenedorFrase.innerHTML = "";
        const botones = contenedorFrase.parentElement.querySelectorAll("#letras-container button");
        botones.forEach(b => b.disabled = false);
      },800);
    }
  }
}

// --- Eventos ---
btnReglas.addEventListener("click", () => { if (!btnReglas.disabled) modalReglas.classList.remove("hidden"); });
btnCerrar.addEventListener("click", () => modalReglas.classList.add("hidden"));
btnEnviar.addEventListener("click", validarRespuestaInput);
inputMsg.addEventListener("keydown", (e)=>{if(e.key==="Enter"){e.preventDefault(); validarRespuestaInput();}});

btnEmpezar.addEventListener("click", ()=>{
  if(btnEmpezar.disabled) return;
  btnEmpezar.disabled = true;
  btnReglas.disabled = true;
  enviarMensajeAudio(mensajeIbai, audioIbai);
});
