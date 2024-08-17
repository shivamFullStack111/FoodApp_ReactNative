declare module 'react-native-razorpay' {
  export interface RazorpayOptions {
    description: string;
    image: string;
    currency: string;
    key: string;
    amount: string;
    name: string;
    order_id: string;
    prefill: {
      email: string;
      contact: string;
      name: string;
    };
    theme: {
      color: string;
    };
  }

  interface RazorpayPaymentSuccessCallbackResult {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  }

  interface RazorpayPaymentErrorCallbackResult {
    code: number;
    description: string;
  }

  class RazorpayCheckout {
    static open(options: RazorpayOptions): Promise<RazorpayPaymentSuccessCallbackResult>;
  }

  export default RazorpayCheckout;
}
