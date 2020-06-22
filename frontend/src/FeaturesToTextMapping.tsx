import { first } from "lodash";

enum FeatureCategoryType {
    POSSESSIVE,
    ACTIVE,
}
enum FeatureCategoryMultiplicity {
    SINGULAR,
    PLURAL,
}

export enum Gender {
    MALE,
    FEMALE,
}

interface FeatureCategoryTextMapping {
    id: string;
    type: FeatureCategoryType;
    multiplicity: FeatureCategoryMultiplicity;
    literal: string;
    textRepresentations: string[] /* array starting with text mappings for low values */;
    emoji?: string;
}

const featuresToTextMapping: FeatureCategoryTextMapping[] = [
    {
        id: "Gaze",
        type: FeatureCategoryType.POSSESSIVE,
        multiplicity: FeatureCategoryMultiplicity.SINGULAR,
        literal: "gaze",
        textRepresentations: ["averted", "neutral", "very focused"],
        emoji: "👀",
    },
    {
        id: "Smile",
        type: FeatureCategoryType.ACTIVE,
        multiplicity: FeatureCategoryMultiplicity.SINGULAR,
        literal: "",
        textRepresentations: ["frowning", "looking neutral", "smiling"],
        emoji: "🙂",
    },
    {
        id: "Voice",
        type: FeatureCategoryType.ACTIVE,
        multiplicity: FeatureCategoryMultiplicity.SINGULAR,
        literal: "",
        textRepresentations: ["silent", "talking", "actively talking"],
        emoji: "🗣",
    },
    {
        id: "Armscrossed",
        type: FeatureCategoryType.POSSESSIVE,
        multiplicity: FeatureCategoryMultiplicity.PLURAL,
        literal: "arms",
        textRepresentations: ["open", "partly crossed", "crossed"],
        emoji: "🙅",
    },
    {
        id: "Headtouch",
        type: FeatureCategoryType.ACTIVE,
        multiplicity: FeatureCategoryMultiplicity.SINGULAR,
        literal: "arms",
        textRepresentations: [
            "not touching their head",
            "touch their head",
        ] /* TODO: replace 'their' with appropriate gender */,
        emoji: "🤦",
    },
    {
        id: "BodyOpenness",
        type: FeatureCategoryType.POSSESSIVE,
        multiplicity: FeatureCategoryMultiplicity.SINGULAR,
        literal: "posture",
        textRepresentations: ["reserved", "neutral", "open"],
        emoji: "🕺",
    },
    {
        id: "Restlessness",
        type: FeatureCategoryType.ACTIVE,
        multiplicity: FeatureCategoryMultiplicity.SINGULAR,
        literal: "",
        textRepresentations: ["standing still", "moving a little", "moving a lot"],
        emoji: "🤸",
    },
    {
        id: "Gesticulation",
        type: FeatureCategoryType.ACTIVE,
        multiplicity: FeatureCategoryMultiplicity.SINGULAR,
        literal: "",
        textRepresentations: ["not gesticulating", "gesticulating a little", "vividly gesticulating"],
        emoji: "👋",
    },
];

export const CategoryIds: string[] = featuresToTextMapping.map((f) => f.id);

/**
 * Extracts the appropriate literal based on the activation by linear mapping.
 * The literals inhabit equally large ranges between 0.0 and 1.0 and
 * depending on which range the value falls into that literal is returned
 * @param activation
 * @param literals
 */
const activationLiteral = (activation: number, literals: string[]) => {
    let index = Math.round(activation * literals.length) - 1;
    return literals[index];
};

const activationClause = (category: FeatureCategoryTextMapping, activationValue: number) => {
    return (
        (category.multiplicity == FeatureCategoryMultiplicity.SINGULAR ? "is " : "are ") +
        activationLiteral(activationValue, category.textRepresentations)
    );
};

const categoryClause = (category: FeatureCategoryTextMapping) => {
    return category.type === FeatureCategoryType.POSSESSIVE ? category.literal : "";
};

/**
 * Generates a sentence describing the given feature-categories' values for a specific person.
 * e.g.: "Simon's gaze is very focused and he is actively talking."
 * @param categoryIds - string[]
 * @param categoryValues - number[] expects the numbers to be between 0.0 and 1.0, 0 will be mapped to low values of the category
 * @param username - the name of the person that the sentence describes
 * @param userGender - the gender of that person
 */
export const generateDescription = (
    categoryIds: string[],
    categoryValues: number[],
    username: string,
    userGender: Gender
) => {
    if (!categoryIds || categoryIds.length == 0) {
        return "";
    }

    let output = username;

    let firstCategory = featuresToTextMapping.filter((c) => c.id === categoryIds[0])[0];
    let firstValue = categoryValues[0];

    output += firstCategory.type === FeatureCategoryType.POSSESSIVE ? "'s " : " ";
    output += categoryClause(firstCategory) + " " + activationClause(firstCategory, firstValue);

    return output;
};
