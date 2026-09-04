'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '@/lib/LanguageContext';

export default function DashboardChart() {
    const { t } = useLanguage();

    const data = [
        { name: t('month_jan', 'Jan'), approved: 4000, escrowed: 2400, disbursed: 2400 },
        { name: t('month_feb', 'Feb'), approved: 3000, escrowed: 1398, disbursed: 2210 },
        { name: t('month_mar', 'Mar'), approved: 2000, escrowed: 9800, disbursed: 2290 },
        { name: t('month_apr', 'Apr'), approved: 2780, escrowed: 3908, disbursed: 2000 },
        { name: t('month_may', 'May'), approved: 1890, escrowed: 4800, disbursed: 2181 },
        { name: t('month_jun', 'Jun'), approved: 2390, escrowed: 3800, disbursed: 2500 },
        { name: t('month_jul', 'Jul'), approved: 3490, escrowed: 4300, disbursed: 2100 },
    ];

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
                    <Tooltip
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="escrowed" fill="#4f46e5" radius={[4, 4, 0, 0]} name={t('chart_escrowed_funds', 'Escrowed Funds')} />
                    <Bar dataKey="disbursed" fill="#10b981" radius={[4, 4, 0, 0]} name={t('chart_disbursed_funds', 'Disbursed Funds')} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
