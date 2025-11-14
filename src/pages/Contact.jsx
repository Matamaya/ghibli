// Formulario sencillo para practicar eventos onSubmit 
export default function Contact() { 
  function handleSubmit(e) { 
    e.preventDefault() // evita recarga de la página 
    alert('Mensaje enviado') 
  } 
 
  return ( 
    <section> 
      <h2>Contacto</h2> 
      <form onSubmit={handleSubmit}> 
        <input type="text" placeholder="Tu nombre" required /> 
        <input type="email" placeholder="Tu email" required /> 
        <textarea placeholder="Escribe tu mensaje" required /> 
        <button type="submit">Enviar</button> 
      </form> 
    </section> 
  ) 
} 