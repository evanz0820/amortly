import type { SchedulePeriod } from '../types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import './AmortizationChart.css';

interface Props {
  schedule: SchedulePeriod[];
}

export default function AmortizationChart({ schedule }: Props) {
  const data = schedule.map((s) => ({
    period: s.period,
    balance: Number(s.remaining_balance),
    principal: Number(s.principal_portion),
    interest: Number(s.interest_portion),
  }));

  const formatCurrency = (val: number) =>
    `$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Amortization Schedule</h3>
        <div className="chart-legend">
          <span className="legend-item">
            <span className="legend-dot" style={{ background: '#6C63FF' }} />
            Balance
          </span>
        </div>
      </div>
      <div className="chart-body">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6C63FF" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#6C63FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F1F4" vertical={false} />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip
              formatter={(val) => [formatCurrency(Number(val)), 'Balance']}
              contentStyle={{
                background: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                fontSize: 13,
              }}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#6C63FF"
              strokeWidth={2.5}
              fill="url(#balanceGradient)"
              dot={false}
              activeDot={{ r: 5, stroke: '#6C63FF', strokeWidth: 2, fill: 'white' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
