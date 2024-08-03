import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";

function Success() {
  const token = Cookies.get("auth-session");
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const orderId = query.get("order_id");

    if (orderId) {
      fetch(`https://hackaton-final-rzlk.onrender.com/order/${orderId}/pagar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
      })
        .then(response => response.text()) // Obtén la respuesta como texto
        .then(text => {
          console.log('Respuesta del servidor:', text); // Imprime el texto de la respuesta
          try {
            const data = JSON.parse(text); // Intenta parsear el texto como JSON
            console.log('Pago completado:', data);
          } catch (e) {
            console.error('Error parseando JSON:', e);
          }
        })
        .catch(error => {
          console.error('Error completando el pago:', error);
        });
    }
  }, [location, token]);

  return (
    <div>
      <h1>Pago Completo</h1>
      <p>Tu pago ha sido procesado con éxito.</p>
    </div>
  );
}

export default Success;
