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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {bills.map((bill) => (
            <div key={bill.id} className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/20 hover:shadow-md hover:border-outline-variant/40 transition-all flex flex-col gap-3 relative group">
              <div className="flex justify-between items-start">
                 <div>
                    <span className="text-[10px] font-mono text-secondary bg-surface-container-lowest border border-outline-variant/30 px-2 py-0.5 rounded-md">{bill.invoiceNumber}</span>
                    <h4 className="font-medium text-on-surface mt-3">{bill.customerName || "Walk-in Customer"}</h4>
                 </div>
                 <div className="text-right">
                    <p className="font-semibold text-lg text-on-surface">₹{Number(bill.total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                 </div>
              </div>
              <div className="flex justify-between items-end mt-2 pt-3 border-t border-outline-variant/10">
                 <div className="flex flex-col gap-1 text-[11px] font-medium text-secondary tracking-wide uppercase">
                    <span>{bill.paymentMethod}</span>
                    <span>
                      {bill.createdAt
                        ? new Date(bill.createdAt).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </span>
                 </div>
                 <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase border border-outline-variant/30 px-2.5 py-1 rounded-full bg-surface-container-lowest text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Completed
                 </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
