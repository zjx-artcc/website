"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Button, CircularProgress } from '@mui/material';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();


  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/live/payment-confirmation",
      },
    });
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "accordion",
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <Button variant="contained" sx={{ backgroundColor: '#0A4040', color: 'white', mt: 2 }} fullWidth disabled={isLoading || !stripe || !elements} id="submit" type="submit" startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}>
        {isLoading ? 'Processing...' : 'Pay now'}
      </Button>
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}

export default function CheckoutForm({ clientSecret }) {
  const appearance = {
    theme: 'night',
    inputs: 'spaced',
    variables: {
      colorText: 'white',
      colorPrimary: '#C1DBF5',
      colorBackground: '#0A2540',

    },
  };
  return (
    <Elements stripe={stripePromise} options={{ appearance, clientSecret }}>
      <PaymentForm />
    </Elements>
  )
}