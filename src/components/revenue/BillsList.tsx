import { format } from "date-fns";

interface Bill {
  id: string;
  invoiceNumber: string;
  customerName: string | null;
  total: string;
  paymentMethod: string;
  createdAt: Date | null;
}

export function BillsList({ bills }: { bills: Bill[] }) {
  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden mt-8">
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface-hover">
        <h3 className="font-display text-title-md text-on-surface">Bills in Range</h3>
        <p className="text-sm text-secondary">{bills.length} bills found</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-secondary uppercase bg-surface-hover sticky top-0">
            <tr>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Invoice #</th>
              <th className="px-6 py-3 font-medium">Customer</th>
              <th className="px-6 py-3 font-medium">Method</th>
              <th className="px-6 py-3 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {bills.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-secondary">
                  No bills found in this date range.
                </td>
              </tr>
            ) : (
              bills.map((bill) => (
                <tr key={bill.id} className="border-b border-border hover:bg-surface-hover/50">
                  <td className="px-6 py-4 text-secondary whitespace-nowrap">
                    {bill.createdAt ? format(new Date(bill.createdAt), "MMM dd, yyyy HH:mm") : "—"}
                  </td>
                  <td className="px-6 py-4 font-medium text-on-surface">
                    {bill.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 text-secondary">
                    {bill.customerName || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-border">
                      {bill.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-on-surface">
                    ₹{Number(bill.total).toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
