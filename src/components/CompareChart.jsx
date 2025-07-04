import React, { useState, useRef, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { toast } from "react-toastify";

const CompareChart = ({ data, onClose }) => {
    const [metric, setMetric] = useState("WHTH"); // WHTH or WPDI
    const chartRef = useRef(null);
    const [quickRange, setQuickRange] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");


    const now = Date.now();
    let cutoff = quickRange != null ? now - quickRange * 24 * 60 * 60 * 1000 : null;

    const minTime = startDate ? Date.parse(startDate) : null;
    const maxTime = endDate ? Date.parse(endDate) : null;

    const filteredData = {};
    for (const [siteName, records] of Object.entries(data)) {
        filteredData[siteName] = records.filter((r) => {
            const time = Date.parse(r.TIME);
            if (isNaN(time)) return false;

            if (quickRange != null) {
                return time >= cutoff;
            }

            if (minTime && time < minTime) return false;
            if (maxTime && time > maxTime) return false;

            return true;
        });
    }


    const series = Object.entries(filteredData).map(([siteName, records]) => ({
        name: siteName,
        data: records.map((record) => [
            new Date(record.TIME).getTime(),
            record[metric],
        ]),
    }));

    const options = {
        title: {
            text: metric === "WHTH" ? "Wave Height Comparison" : "Wave Direction Comparison",
        },
        xAxis: {
            type: "datetime",
            title: { text: "Time" },
        },
        yAxis: {
            title: {
                text: metric === "WHTH" ? "Wave Height (m)" : "Wave Direction (°)",
            },
        },
        tooltip: {
            xDateFormat: "%Y-%m-%d %H:%M",
            shared: true,
        },
        series: series,
        chart: {
            height: 400,
        },
    };


    useEffect(() => {
        if (chartRef.current && chartRef.current.chart) {
            chartRef.current.chart.reflow();
        }
    }, [metric, data]);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            if (chartRef.current && chartRef.current.chart) {
                chartRef.current.chart.reflow();
            }
        });

        const chartContainer = chartRef.current?.container.current;
        if (chartContainer) {
            resizeObserver.observe(chartContainer);
        }

        return () => {
            if (chartContainer) resizeObserver.unobserve(chartContainer);
        };
    }, []);

    return (
        <div className="p-4">
            {/* 顶部标题 + 关闭按钮 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ margin: 0 }}>Wave Data Comparison</h2>
            </div>
            <div className="mb-4 flex gap-4">
                <button
                    onClick={() => setMetric("WHTH")}
                    className={`px-4 py-2 rounded ${metric === "WHTH" ? "bg-blue-700 text-white" : "bg-gray-200 text-gray-800"}`}
                >
                    Wave Height
                </button>
                <button
                    onClick={() => setMetric("WPDI")}
                    className={`px-4 py-2 rounded ${metric === "WPDI" ? "bg-blue-700 text-white" : "bg-gray-200 text-gray-800"}`}
                >
                    Wave Direction
                </button>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                        setQuickRange(null); // 互斥逻辑
                        setStartDate(e.target.value);
                    }}
                    className="border rounded px-2 py-1 text-sm"
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                        setQuickRange(null); // 互斥逻辑
                        setEndDate(e.target.value);
                    }}
                    className="border rounded px-2 py-1 text-sm"
                />
                <button
                    onClick={() => {
                        if (!startDate || !endDate) {
                            toast.warn("Please fill in the start and end dates");
                            return;
                        }
                        const min = Date.parse(startDate);
                        const max = Date.parse(endDate);
                        if (min >= max) {
                            toast.error("The start time cannot be greater than or equal to the end time！");
                            return;
                        }
                        setQuickRange(null); // 应用自定义时清除 quick range
                    }}
                    className="bg-blue-700 text-white px-3 py-1 rounded"
                >
                    Apply
                </button>

                <button
                    onClick={() => {
                        setStartDate("");
                        setEndDate("");
                        setQuickRange(null);
                    }}
                    className="bg-gray-300 text-black px-3 py-1 rounded"
                >
                    Reset
                </button>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
                {[1, 3, 7, 30].map((d) => (
                    <button
                        key={d}
                        onClick={() => setQuickRange(d)}
                        className={`px-3 py-1 rounded text-sm font-semibold ${quickRange === d
                            ? "bg-blue-700 text-white"
                            : "bg-gray-200 text-gray-800"
                            }`}
                    >
                        Last {d} {d === 1 ? "Day" : "Days"}
                    </button>
                ))}
                <button
                    onClick={() => setQuickRange(null)}
                    className={`px-3 py-1 rounded text-sm font-semibold ${quickRange === null
                        ? "bg-blue-700 text-white"
                        : "bg-gray-200 text-gray-800"
                        }`}
                >
                    View All Wave Data
                </button>
            </div>

            <HighchartsReact
                highcharts={Highcharts}
                options={options}
                ref={chartRef}
                containerProps={{ style: { height: "100%", width: "100%" } }}
            />
        </div>
    );
};

export default CompareChart;
