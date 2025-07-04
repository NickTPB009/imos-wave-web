import React from "react";
import Select from "react-select";
import { toast } from "react-toastify";

const CompareSelector = ({
    landmarks,
    selectedCompareSites,
    setSelectedCompareSites,
    setShowCompareChart,
}) => {
    const options = landmarks.map((site) => ({
        value: site.site_name,
        label: site.site_name,
    }));

    const handleChange = (selectedOptions) => {
        const selected = selectedOptions.map((opt) => opt.value);
        if (selected.length > 3) {
            toast.warn("maximum choose 3 different sites");
            return;
        }
        setSelectedCompareSites(selected);
    };

    return (
        <div
            style={{
                position: "absolute",
                top: 10,
                left: 10,
                zIndex: 1000,
                backgroundColor: "white",
                padding: "8px 12px",
                borderRadius: "6px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                minWidth: "300px",
            }}
        >
            <Select
                isMulti
                options={options}
                value={selectedCompareSites.map((name) => ({
                    value: name,
                    label: name,
                }))}
                onChange={handleChange}
                placeholder="Select up to 3 sites to compare"
            />
        </div>
    );
};

export default CompareSelector;
