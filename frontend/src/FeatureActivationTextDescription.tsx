import React from "react";
import { generateDescriptionObject, Gender, CATEGORY_DEFINITIONS } from "./FeaturesToTextMapping";
import { Popover } from "@blueprintjs/core";

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
            <div>
                <h3>{activation.categoryId}</h3>
                <p>{categoryDesc}</p>
            </div>
        );

        activationSpans.push(
            <Popover
                key={activation.categoryId}
                content={contextDialogContent}
                target={<span>{activation.activationAsText}</span>}
            />
        );
    }

    return (
        <p>
            {categoryActivationsObject.username}
            {activationSpans}
        </p>
    );
}

export default FeatureActivationTextDescription;
