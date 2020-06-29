import React from "react";
import styled from "styled-components";
import WordCloud from "./WordCloud";
import FeatureActivationTextDescription from "./FeatureActivationTextDescription";
import { Gender } from "./FeaturesToTextMapping";
import { ENGAGEMENT_NEGATIVE_COLOR_PALETTE, ENGAGEMENT_POSITIVE_COLOR_PALETTE } from "./EngagementDefinitions";
import sortAndSelectTopmostFeatures from "./sortAndSelectTopmostFeatures";
import calculateBlur from "./calculateBlur";
import ExplanationsHeading from "./ExplanationsHeading";
import BarChart from "./BarChart";
import normalizeInput from "./normalizeInput";

const Container = styled.div`
    position: relative;
    flex: 55;
    height: 100%;

    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const Explanations = styled.div`
    display: flex;
    align-items: center;
    box-sizing: border-box;
    flex-direction: column;
    padding: 12px;
    height: 100%;
    overflow: hidden;
`;

const BasedOn = styled.div`
    align-items: center;
    margin: 8px 0;
    transition: 0.2s filter linear, 0.2s -webkit-filter linear;

    > span {
        margin: 0 3px 0 0;
    }
`;

const ChartContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    width: 60%;
    flex-grow: 1;
    overflow: hidden;
    transition: 0.2s filter linear, 0.2s -webkit-filter linear;
    filter: blur(0px);
`;

const Unsure = styled.div`
    position: absolute;
    display: flex;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    transition: 0.5s opacity;
    pointer-events: none;
    font-weight: bold;
    font-size: 50px;
    text-shadow: 1px 1px 10px #fff, 1px 1px 10px #ccc;
    justify-content: center;
    align-items: center;
`;

function ExplanationsContainer(props: {
    dataPoint: { input: number[]; output: number[]; explanations: number[][] } | null;
    labels: string[];
    maxExplanationValue: number;
    minInputValues: number[];
    maxInputValues: number[];
    mode: "bar" | "cloud";
    username: string;
    gender: Gender;
}) {
    const { maxInputValues, minInputValues, maxExplanationValue, dataPoint, username, gender, labels, mode } = props;
    if (!dataPoint) return <Container />;
    const { input, output, explanations } = dataPoint;
    const strongestOutputIdx = output.indexOf(Math.max(...output));
    const confidence = Math.round(output[strongestOutputIdx] * 1000) / 10;

    const inputNormalized = normalizeInput(input, minInputValues, maxInputValues);

    const strongestOutputExplanations = sortAndSelectTopmostFeatures(
        labels,
        inputNormalized,
        explanations[strongestOutputIdx],
        3,
        0.2,
        true
    );

    const blur = calculateBlur(confidence);
    const colorPalette = strongestOutputIdx < 2 ? ENGAGEMENT_NEGATIVE_COLOR_PALETTE : ENGAGEMENT_POSITIVE_COLOR_PALETTE;

    return (
        <Container>
            <Explanations style={{ filter: `blur(${blur}px)` }}>
                <ExplanationsHeading strongestOutputIdx={strongestOutputIdx} />
                <BasedOn>
                    <span>Based on: </span>
                    <FeatureActivationTextDescription
                        categoryIds={strongestOutputExplanations.topMostLabels}
                        categoryValues={strongestOutputExplanations.topMostInputs}
                        username={username}
                        userGender={gender}
                        popOverDisabled={blur > 0}
                    />
                </BasedOn>
                <ChartContainer style={{ width: "90%" }}>
                    {mode === "bar" ? (
                        <BarChart
                            strongestOutputIdx={strongestOutputIdx}
                            strongestOutputExplanations={strongestOutputExplanations}
                            maxExplanationValue={maxExplanationValue}
                        />
                    ) : (
                        <WordCloud
                            allLabels={labels}
                            maxExplanationValue={maxExplanationValue}
                            strongestFeatures={strongestOutputExplanations.topMostExplanations}
                            strongestLabels={strongestOutputExplanations.topMostLabels}
                            colorPalette={colorPalette}
                        />
                    )}
                </ChartContainer>
            </Explanations>
            <Unsure style={{ opacity: blur > 0 ? 1 : 0 }}>UNSURE</Unsure>
        </Container>
    );
}

export default ExplanationsContainer;
