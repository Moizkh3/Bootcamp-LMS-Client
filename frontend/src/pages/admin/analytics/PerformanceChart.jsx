import { useGetAllSubmissionsQuery } from '../../../features/submission/submissionApi';

const PerformanceChart = () => {
    // Fetch a larger dataset for the chart to show real trends without breaking pagination elsewhere
    const { data: submissionsResponse, isLoading } = useGetAllSubmissionsQuery({ limit: 100 });
    const submissions = submissionsResponse?.submissions || [];

    // Aggregation logic for the chart to show real trends
    const getChartData = () => {
        if (isLoading) return new Array(10).fill(0);
        
        // Define the time range (last 10 days)
        const dayBuckets = [];
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        
        for (let i = 9; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            date.setHours(0, 0, 0, 0);
            dayBuckets.push({
                date,
                count: 0,
                label: date.toLocaleDateString('en-US', { weekday: 'short' })
            });
        }

        // Fill buckets with real submission counts
        submissions.forEach(sub => {
            const subDate = new Date(sub.createdAt);
            const bucketIndex = dayBuckets.findIndex(bucket => 
                subDate.getDate() === bucket.date.getDate() &&
                subDate.getMonth() === bucket.date.getMonth() &&
                subDate.getFullYear() === bucket.date.getFullYear()
            );
            if (bucketIndex !== -1) {
                dayBuckets[bucketIndex].count += 1;
            }
        });

        // Normalize data to percentages for visual height (0-100%)
        const maxCount = Math.max(...dayBuckets.map(b => b.count), 5); // Minimum max of 5 for scaling
        return dayBuckets.map(bucket => ({
            value: (bucket.count / maxCount) * 100,
            count: bucket.count,
            label: bucket.label
        }));
    };

    const chartData = getChartData();

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-base font-bold text-slate-800 uppercase tracking-tight">Student Engagement Trends</h3>
                    <p className="text-xs text-slate-500 font-medium">Activity patterns based on {submissions.length} submissions</p>
                </div>
                <div className="flex gap-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-[#3636e2]"></span> Submissions
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-slate-200"></span> Projects
                    </span>
                </div>
            </div>

            {/* Visual Placeholder for Chart */}
            <div className="h-48 w-full flex items-end justify-between gap-2 px-2 pb-2 border-b border-l border-slate-100">
                {chartData.length > 0 ? chartData.map((item, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
                        <div
                            className="w-full bg-[#3636e2]/10 group-hover:bg-[#3636e2]/20 transition-all rounded-t-sm relative flex flex-col justify-end"
                            style={{ height: `${Math.max(item.value, 5)}%` }}
                        >
                            <div
                                className="w-full bg-[#3636e2] rounded-t-sm transition-all duration-500"
                                style={{ height: item.count > 0 ? '100%' : '0%' }}
                            />
                        </div>
                        <span className="text-[8px] font-bold text-slate-300 uppercase">{item.label}</span>

                        {/* Tooltip */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all transform scale-95 group-hover:scale-100 pointer-events-none whitespace-nowrap z-10 shadow-xl border border-white/10">
                            <div className="font-bold">{item.count} Submissions</div>
                            <div className="text-[8px] text-slate-400">{item.label}</div>
                        </div>
                    </div>
                )) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-[10px] italic">
                        No activity data found
                    </div>
                )}
            </div>

            <div className="mt-4 flex justify-between">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider italic">
                    {isLoading ? 'Processing latest data...' : 'Live activity feed active'}
                </p>
                <button className="text-[10px] font-bold text-[#3636e2] hover:underline">View Detailed Report</button>
            </div>
        </div>
    );
};

export default PerformanceChart;
