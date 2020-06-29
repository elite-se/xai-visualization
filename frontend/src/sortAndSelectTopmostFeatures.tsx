export type StrongestOutputExplanationsType = {
    topMostLabels: string[]; topMostExplanations: number[]; topMostInputs: number[]
}

/**
 * Sorts the passed in explanations (either ascending or descending) and
 * returns all values and their labels that are (in value, regardless of sign) greater than the threshold.
 * It returns at least minNrOfFeatures values, in case that too little values are greater than the threshold.
 * @param labels
 * @param inputs_in
 * @param explanations_in
 * @param minNrOfFeatures
 * @param threshold
 * @param sortDescending
 */
function sortAndSelectTopmostFeatures(
    labels: string[],
    inputs_in: number[],
    explanations_in: number[],
    minNrOfFeatures: number,
    threshold: number,
    sortDescending: boolean
): StrongestOutputExplanationsType {
    if (explanations_in.length !== labels.length) throw new Error();

    let explanations = explanations_in.slice(0);
    let inputs = inputs_in.slice(0);
    let labelOrder = Array.from(Array(explanations.length).keys()).sort((a, b) => explanations[a] - explanations[b]);
    explanations.sort((a, b) => a - b);

    if (sortDescending) {
        labelOrder.reverse();
        explanations.reverse();
    }

    //Does this "normalisation" make sense?
    //It would keep our displayed values between 0..1 but also distort between frames:
    //if on one frame we have a lot of big values and on another no big values at all,
    //the relations between the values might look the same for those frames, even though the networks "activation" was not the same at all

    //const sumExplanation = explanations.reduce((a, b) => Math.abs(a) + Math.abs(b), 0);
    //explanations = explanations.map((x) => x / sumExplanation); //normalize

    let ctr = minNrOfFeatures;
    let findMoreFeatures = true;
    while (findMoreFeatures) {
        if (Math.abs(explanations[ctr]) >= threshold) {
            ctr++;
        } else {
            findMoreFeatures = false;
        }
    }

    let topMostLables = [];
    let topMostInputs = [];
    for (let i = 0; i < ctr; i++) {
        topMostLables.push(labels[labelOrder[i]]);
        topMostInputs.push(inputs[labelOrder[i]]);
    }

    return {
        topMostLabels: topMostLables,
        topMostExplanations: explanations.slice(0, ctr),
        topMostInputs: topMostInputs,
    };
}

export default sortAndSelectTopmostFeatures
