import React from "react";
import styled from "styled-components";
import {CategoryValueDescription} from "./FeaturesToTextMapping";

const StyledText = styled.text`
    transition: 0.5s;
`

class WordCloud extends React.PureComponent<{
    allLabels: string[];
    strongestLabels: string[];
    strongestFeatures: number[];
    maxExplanationValue: number;
    colorPalette: string[];
    categoryActivationsObject: CategoryValueDescription;

}> {
    render() {
        const {strongestLabels, strongestFeatures, maxExplanationValue, allLabels, colorPalette, categoryActivationsObject} = this.props;

        return (
            <svg style={{width: "40%", height: "40%"}} transform="scale(2)">
                {allLabels.map((category, index) => {
                    const sortedIndex = strongestLabels.indexOf(category);
                    const scalar = sortedIndex > -1 ? strongestFeatures[sortedIndex] / maxExplanationValue : 0;
                    if (sortedIndex === -1 || sortedIndex > 4) {
                        return (
                            <StyledText
                                key={category}
                                fill={colorPalette[index % colorPalette.length]}
                                style={{
                                    transform: "scale(0)",
                                    fontSize: "15px",
                                    fontWeight: 300,
                                    opacity: 0
                                }} />
                        );
                    }
                    const activation = categoryActivationsObject.categoryActivations
                        .find(value => value.categoryId === category)?.mainActivationAsText
                    const transform = [
                        "translate(40px, 50px)",
                        "translate(80px, 20px)",
                        "rotate(90deg) translate(20px, 20px)",
                        "translate(80px, 70px)",
                        "translate(50px, 85px)",
                    ][sortedIndex];
                    const fontSize = `${15 + 20 * Math.round(scalar * 5) / 5}px`;
                    const fontWeight = 300 + 600 * Math.round(scalar * 5) / 5;
                    const transformOrigin = "20px 20px";

                    return (
                        <StyledText
                            key={category}
                            fill={colorPalette[index % colorPalette.length]}
                            style={{
                                transform,
                                transformOrigin,
                                fontSize,
                                fontWeight
                            }}>{activation}</StyledText>
                    );
                })}
            </svg>
        );
    }
}

export default WordCloud;
