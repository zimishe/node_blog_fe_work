import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { API_URL, ACCESS_TOKEN_KEY } from '../App'

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
  const [fetching, setFetching] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  const params = useParams();

  const handlePayment = async () => {
    try {
      setFetching(true);
      const response = await axios
      .get(
        `${API_URL}/articles/${params.id}/donate`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
          }
        }
      );

      const result = await stripe.confirmCardPayment(response.data.client_secret, {
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
          setConfirmationVisible(true);
        }
      }
      setFetching(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div style={{ width: 400, margin: '30px auto' }}>
      <CardElement options={{ style }} />
      <div style={{ marginTop: 10, paddingTop: 20, textAlign: 'right', borderTop: '1px solid #2c2c2c' }}>
        <Button
          type="button"
          variant="contained"
          onClick={handlePayment}
          color="secondary"
          size="large"
          disabled={fetching}
        >
          Donate 0.50 USD
        </Button>
        {confirmationVisible && (
          <Typography style={{ marginTop: 20, textAlign: 'right' }} variant="h6">
            Success! Thanks for donation.
          </Typography>
        )}
      </div>
    </div>
  )
}

export default StripeForm;
