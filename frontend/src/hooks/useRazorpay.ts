import { useCallback, useEffect, useState } from 'react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  amount: number;
  currency?: string;
  name: string;
  description: string;
  orderId?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

interface PaymentResult {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  signature?: string;
  error?: string;
}

export const useRazorpay = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('🔄 Razorpay: Loading script...');
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('✅ Razorpay: Script loaded successfully');
      setIsLoaded(true);
    };
    script.onerror = () => {
      console.error('❌ Razorpay: Failed to load script');
    };
    document.body.appendChild(script);

    return () => {
      console.log('🧹 Razorpay: Cleaning up script');
      document.body.removeChild(script);
    };
  }, []);

  const initiatePayment = useCallback(async (options: RazorpayOptions): Promise<PaymentResult> => {
    console.log('🔄 Razorpay: Initiating payment', {
      amount: options.amount,
      currency: options.currency,
      name: options.name,
      orderId: options.orderId
    });

    return new Promise((resolve) => {
      if (!isLoaded) {
        console.error('❌ Razorpay: Script not loaded');
        resolve({ success: false, error: 'Razorpay not loaded' });
        return;
      }

      setIsLoading(true);
      console.log('⏳ Razorpay: Setting loading state to true');

      // Note: In production, you would generate order_id from your backend
      // For demo purposes, we're using test mode configuration
      const razorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_demo', // Use env var or fallback
        amount: options.amount * 100, // Razorpay expects amount in paise
        currency: options.currency || 'INR',
        name: options.name,
        description: options.description,
        order_id: options.orderId,
        prefill: options.prefill,
        theme: {
          color: options.theme?.color || '#000000'
        },
        handler: function(response: any) {
          console.log('✅ Razorpay: Payment successful', {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature
          });
          setIsLoading(false);
          resolve({
            success: true,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature
          });
        },
        modal: {
          ondismiss: function() {
            console.log('❌ Razorpay: Payment modal dismissed by user');
            setIsLoading(false);
            resolve({ success: false, error: 'Payment cancelled' });
          }
        }
      };

      console.log('🚀 Razorpay: Opening payment modal with options:', {
        key: razorpayOptions.key ? '***' + razorpayOptions.key.slice(-4) : 'not set',
        amount: razorpayOptions.amount,
        currency: razorpayOptions.currency,
        name: razorpayOptions.name
      });

      try {
        const razorpay = new window.Razorpay(razorpayOptions);
        razorpay.on('payment.failed', function(response: any) {
          console.error('❌ Razorpay: Payment failed', {
            code: response.error.code,
            description: response.error.description,
            source: response.error.source,
            step: response.error.step,
            reason: response.error.reason
          });
          setIsLoading(false);
          resolve({
            success: false,
            error: response.error.description || 'Payment failed'
          });
        });
        razorpay.open();
      } catch (error) {
        console.error('❌ Razorpay: Failed to initialize payment modal', error);
        setIsLoading(false);
        resolve({ success: false, error: 'Failed to initialize payment' });
      }
    });
  }, [isLoaded]);

  return { initiatePayment, isLoaded, isLoading };
};
