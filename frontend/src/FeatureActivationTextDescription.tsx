import React from "react";
import styled from "styled-components";
import { generateDescriptionObject, Gender, CATEGORY_DEFINITIONS } from "./FeaturesToTextMapping";
import { Popover, PopoverInteractionKind } from "@blueprintjs/core";

const Pre = styled.span`
    white-space: pre;
    border-bottom: 1px solid green;
`;

const Definition = styled.div`
    padding: 8px 12px;
    background: white;
    max-width: 280px;

    h3 {
        margin: 0;
    }
`;

function FeatureActivationTextDescription(props: {
    categoryIds: string[];
    categoryValues: number[];
    username: string;
    userGender: Gender;
}) {
    const categoryActivationsObject = generateDescriptionObject(
        props.categoryIds,
        props.categoryValues,
        props.username,
        props.userGender
    );

    let activationSpans = [];
    for (let activation of categoryActivationsObject.categoryActivations) {
        let categoryDesc = CATEGORY_DEFINITIONS.filter((c) => c.id === activation.categoryId)[0];

        let contextDialogContent = (
            <Definition>
                <h3>{activation.categoryId}</h3>
                <p>{categoryDesc.definition}</p>
            </Definition>
        );

        activationSpans.push(
            <Popover key={activation.categoryId} interactionKind={PopoverInteractionKind.HOVER}>
                <Pre className={"bp3-text-large"}>{activation.activationAsText}</Pre>
                {contextDialogContent}
            </Popover>
        );
    }

    return (
        <p>
            {categoryActivationsObject.username} {activationSpans}.
        </p>
    );
}

export default FeatureActivationTextDescription;
