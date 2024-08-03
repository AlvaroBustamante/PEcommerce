import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { loadStripe } from "@stripe/stripe-js";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

function StripePayment() {
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetch("https://hackaton-final-rzlk.onrender.com/products",{
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error al obtener los productos:", error));

      const token = Cookies.get("auth-session");
      if (token) {
        try {
          const decoded = jwt_decode(token);
          setUserId(decoded.id); // Usa el ID del token decodificado
        } catch (error) {
          console.error("Error al decodificar el token:", error);
        }
      }
    }, []);

  const makePayment = async (productId) => {
    const stripe = await loadStripe("pk_test_51PcTSlDWNazGz068ndkoqzjamL383kudNSNygpqaU6349OxCIJBxJvYaGJ0sHeoDFOM1aWfC1n383Nwv0HWYZa8R00oNaR4RPP");
    const body = { productId, userId };
    const token = Cookies.get("auth-session");
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };

    const response = await fetch("https://hackaton-final-rzlk.onrender.com/api/create-checkout-session", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const session = await response.json();

    const result = stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.log(result.error);
    } else {
        window.location.href = session.success_url;
      }
    
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button variant="secondary" onClick={() => window.location.href = "https://hackaton-final-rzlk.onrender.com/miscompras"}>
          Mis Compras
        </Button>
      </div>
      <div className="d-flex flex-wrap">
        {products.map((product) => (
          <Card style={{ width: "20rem", margin: "10px" }} key={product._id}>
            <Card.Img variant="top" src={product.img} />
            <Card.Body>
              <Card.Title>{product.name}</Card.Title>
              <Card.Text>{product.description}</Card.Text>
              <Button variant="primary" onClick={() => makePayment(product._id)}>
                Comprar {product.price}
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default StripePayment;
