interface CartSummaryProps {
  subtotal: number;
  tax: number;
  total: number;
  onCheckout?: () => void;
}

export default function CartSummary({
  subtotal,
  tax,
  total,
  onCheckout,
}: CartSummaryProps) {
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-2 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      <button
        onClick={onCheckout}
        className="w-full rounded bg-zinc-900 py-3 text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
