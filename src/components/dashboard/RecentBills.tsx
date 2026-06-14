type RecentBillData = {
  id: string;
  invoiceNumber: string;
  customerName: string | null;
  total: string;
  paymentMethod: string;
  createdAt: Date | null;
};

type RecentBillsProps = {
  bills: RecentBillData[];
};

export function RecentBills({ bills }: RecentBillsProps) {
  return (
    <div className="premium-card flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h3 className="font-headline text-headline-md text-on-surface">Recent Transactions</h3>
        <a href="/billing" className="btn-secondary text-[12px] py-2 px-4 cursor-pointer">View All</a>
      </div>

      {bills.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
          <span className="font-mono text-label-mono text-secondary uppercase tracking-wider">No transactions yet</span>
          <p className="font-body text-body-md text-secondary max-w-[280px]">
            Transactions will appear here once bills are created through the POS.
          </p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30">
                <th className="font-mono text-label-mono text-secondary py-4 px-2 uppercase tracking-wider font-normal">
                  Invoice
                </th>
                <th className="font-mono text-label-mono text-secondary py-4 px-2 uppercase tracking-wider font-normal">
                  Customer
                </th>
                <th className="font-mono text-label-mono text-secondary py-4 px-2 uppercase tracking-wider font-normal">
                  Amount
                </th>
                <th className="font-mono text-label-mono text-secondary py-4 px-2 uppercase tracking-wider font-normal">
                  Payment
                </th>
                <th className="font-mono text-label-mono text-secondary py-4 px-2 uppercase tracking-wider font-normal">
                  Date
                </th>
                <th className="font-mono text-label-mono text-secondary py-4 px-2 uppercase tracking-wider font-normal">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="font-body text-body-md">
              {bills.map((bill, index) => (
                <tr
                  key={bill.id}
                  className={`border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors ${
                    index === bills.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  <td className="py-4 px-2 font-mono text-secondary">{bill.invoiceNumber}</td>
                  <td className="py-4 px-2 font-medium text-on-surface">{bill.customerName || "Walk-in Customer"}</td>
                  <td className="py-4 px-2 font-medium text-on-surface">
                    ₹{Number(bill.total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 px-2 text-secondary">{bill.paymentMethod}</td>
                  <td className="py-4 px-2 text-secondary">
                    {bill.createdAt
                      ? new Date(bill.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="py-4 px-2">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase border border-outline-variant/30 px-3 py-1 rounded-full bg-surface-container-lowest">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
