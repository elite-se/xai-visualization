import React from "react";

const CHART_COLOR_PALETTE = [
    "darkblue",
    "darkgreen",
    "darkviolett",
    "darkcyan",
    "darkgoldenrod",
    "darkgreen",
    "darkred",
    "darkslategray",
];

class WordCloud extends React.Component<{
    allLabels: string[];
    strongestLabels: string[];
    strongestFeatures: number[];
    maxExplanationValue: number;
    colorPalette: string[];
}> {
    render() {
        const { strongestLabels, strongestFeatures, maxExplanationValue, allLabels, colorPalette } = this.props;

        return (
            <svg style={{ width: "40%", height: "40%" }} transform="scale(2)">
                {allLabels.map((value, index) => {
                    const sortedIndex = strongestLabels.indexOf(value);
                    const scalar = sortedIndex > -1 ? strongestFeatures[sortedIndex] / maxExplanationValue : 0;
                    if (sortedIndex === -1 || sortedIndex > 4) {
                        return (
                            <text
                                key={value}
                                fill={colorPalette[index % colorPalette.length]}
                                style={{
                                    transform: "scale(0)",
                                    fontSize: "15px",
                                    opacity: 0,
                                    transition: "0.5s",
                                }}
                            >
                                {value}
                            </text>
                        );
                    }
                    const transform = [
                        "translate(40px, 50px)",
                        "translate(80px, 20px)",
                        "rotate(90deg) translate(20px, 20px)",
                        "translate(80px, 70px)",
                        "translate(50px, 85px)",
                    ][sortedIndex];
                    const fontSize = `${15 + 20 * scalar}px`;
                    const fontWeight = 300 + 600 * scalar;
                    const transformOrigin = "20px 20px";

                    return (
                        <text
                            key={value}
                            fill={colorPalette[index % colorPalette.length]}
                            style={{
                                transform,
                                transformOrigin,
                                fontSize,
                                fontWeight,
                                transition: "0.5s",
                            }}
                        >
                            {value}
                        </text>
                    );
                })}
            </svg>
        );
    }
}

export default WordCloud;
