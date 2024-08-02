import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

function Success() {
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const orderId = query.get("order_id");
    if (orderId) {
      fetch(`http://localhost:8080/ordenes/${orderId}/pagar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          console.log('Pago completado:', data);
        })
        .catch(error => {
          console.error('Error completando el pago:', error);
        });
    }
  }, [location]);

  return (
    <>
      <h2>Gracias por tu orden!</h2>
      <h4>Tu pago se ha realizado satisfactoriamente.</h4>
      <p>
        Si tienes alguna duda contactarnos al:
        <a href="mailto:orders-prueba@prueba.com">orders-prueba@prueba.com</a>.
      </p>
      <div>
      </div>
    </>
  );
}

export default Success;
