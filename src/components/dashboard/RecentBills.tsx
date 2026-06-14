type Transaction = {
  id: string;
  customer: string;
  amount: string;
  paymentMethod: string;
  date: string;
  status: "Completed" | "Pending";
};

const mockTransactions: Transaction[] = [
  {
    id: "#TRX-8921",
    customer: "Eleanor Vance",
    amount: "$450.00",
    paymentMethod: "Credit Card",
    date: "Oct 24, 2026",
    status: "Completed",
  },
  {
    id: "#TRX-8920",
    customer: "Jackson Rivers",
    amount: "$1,200.50",
    paymentMethod: "Digital Wallet",
    date: "Oct 24, 2026",
    status: "Completed",
  },
  {
    id: "#TRX-8919",
    customer: "Sophia Chen",
    amount: "$85.00",
    paymentMethod: "Cash",
    date: "Oct 23, 2026",
    status: "Pending",
  },
  {
    id: "#TRX-8918",
    customer: "Marcus Wright",
    amount: "$320.00",
    paymentMethod: "Credit Card",
    date: "Oct 23, 2026",
    status: "Completed",
  },
];

export function RecentBills() {
  return (
    <div className="premium-card flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h3 className="font-headline text-headline-md text-on-surface">Recent Transactions</h3>
        <button className="btn-secondary text-[12px] py-2 px-4 cursor-pointer">View All</button>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/30">
              <th className="font-mono text-label-mono text-secondary py-4 px-2 uppercase tracking-wider font-normal">
                Transaction ID
              </th>
              <th className="font-mono text-label-mono text-secondary py-4 px-2 uppercase tracking-wider font-normal">
                Customer
              </th>
              <th className="font-mono text-label-mono text-secondary py-4 px-2 uppercase tracking-wider font-normal">
                Amount
              </th>
              <th className="font-mono text-label-mono text-secondary py-4 px-2 uppercase tracking-wider font-normal">
                Payment Method
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
            {mockTransactions.map((trx, index) => (
              <tr
                key={trx.id}
                className={`border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors ${
                  index === mockTransactions.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="py-4 px-2 font-mono text-secondary">{trx.id}</td>
                <td className="py-4 px-2 font-medium text-on-surface">{trx.customer}</td>
                <td className="py-4 px-2 font-medium text-on-surface">{trx.amount}</td>
                <td className="py-4 px-2 text-secondary">{trx.paymentMethod}</td>
                <td className="py-4 px-2 text-secondary">{trx.date}</td>
                <td className="py-4 px-2">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase border border-outline-variant/30 px-3 py-1 rounded-full bg-surface-container-lowest">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        trx.status === "Completed" ? "bg-tertiary" : "bg-primary"
                      }`}
                    />
                    {trx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
