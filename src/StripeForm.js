import React from 'react';
import axios from 'axios';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { API_URL } from './App'

const style = {
  base: {
    fontSize: '16px',
    color: '#424770',
    '::placeholder': {
      color: '#aab7c4',
    },
  },
  invalid: {
    color: '#9e2146',
  },
};

const StripeForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handlePayment = async () => {
    const { data } = await axios
      .get(
        `${API_URL}/articles/95ba2270-6eae-11ea-b9dd-8779de227448/donate`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdC50IiwicGFzc3dvcmQiOiJ6aGVwYSIsImlhdCI6MTU4MzQxNTIzM30.KNDAiDKLK7AL2ZhAqUlmnrXmB4PXZqrkRoeMJbpObuA"
          }
        }
      )
      .catch(function(error) {
        console.log(error);
      });

      const result = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: 'Yevhen Shuliakivskyi',
          },
        }
      });

      if (result.error) {
        console.log(result.error.message);
      } else {
        // The payment has been processed!
        if (result.paymentIntent.status === 'succeeded') {
          console.log('payment succeed')
        }
      }
  }

  return (
    <div style={{ width: 400, margin: '30px auto' }}>
      <h3>Donate here!</h3>
      <CardElement options={{ style}} />
      <button onClick={handlePayment}>
        Donate 0.50 USD
      </button>
    </div>
  )
}

export default StripeForm;