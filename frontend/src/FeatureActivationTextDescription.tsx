import React from "react";
import styled from "styled-components";
import { generateDescriptionObject, Gender, CATEGORY_DEFINITIONS } from "./FeaturesToTextMapping";
import { Popover, PopoverInteractionKind, Colors } from "@blueprintjs/core";

const MainActivation = styled.span`
    white-space: pre;
    border-bottom: 2px solid ${Colors.BLUE5};

    &.allowHover:hover {
        border-bottom: 3px solid ${Colors.BLUE4}88;
        cursor: pointer;
    }
`;

const Definition = styled.div`
    padding: 8px 12px 4px 12px;
    background: white;
    max-width: 320px;

    h1,
    h2 {
        margin-top: 0;
        margin-bottom: 0;
    }

    p {
        margin-top: 4px;
    }
`;

const Emoji = styled.h1`
    margin-right: 4px;
`;

function FeatureActivationTextDescription(props: {
    categoryIds: string[];
    categoryValues: number[];
    username: string;
    userGender: Gender;
    popOverDisabled: boolean;
}) {
    const categoryActivationsObject = generateDescriptionObject(
        props.categoryIds,
        props.categoryValues,
        props.username,
        props.userGender
    );

    let activationSpans = [];
    const activations = categoryActivationsObject.categoryActivations;
    let i = 0;
    for (let activation of activations) {
        let categoryDesc = CATEGORY_DEFINITIONS.filter((c) => c.id === activation.categoryId)[0];

        let contextDialogContent = (
            <Definition>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Emoji>{categoryDesc.emoji}</Emoji> <h2>{categoryDesc.id}</h2>
                </div>
                <p>{categoryDesc.definition}</p>
            </Definition>
        );

        activationSpans.push(
            <span key={activation.categoryId}>
                {activation.prefix}
                <Popover
                    interactionKind={PopoverInteractionKind.HOVER}
                    hoverOpenDelay={50}
                    hoverCloseDelay={50}
                    disabled={props.popOverDisabled}
                >
                    <MainActivation className={props.popOverDisabled ? "" : "allowHover"}>
                        {activation.mainActivationAsText}
                    </MainActivation>
                    {contextDialogContent}
                </Popover>
                {activation.suffix}

                {i === activations.length - 2
                    ? categoryActivationsObject.lastConnector
                    : i < activations.length - 2
                    ? categoryActivationsObject.connector
                    : ""}
            </span>
        );
        i++;
    }

    return (
        <p style={{ fontSize: "1.1rem", margin: 0 }}>
            {categoryActivationsObject.username} {activationSpans}.
        </p>
    );
}

export default FeatureActivationTextDescription;
