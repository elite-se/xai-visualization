export interface CategoryActivationAsText {
    categoryId: string;
    activationAsText: string;
}

export interface CategoryValueDescription {
    username: string;
    categoryActivations: CategoryActivationAsText[];
}

export enum Gender {
    MALE,
    FEMALE,
}

enum FeatureCategoryType {
    POSSESSIVE,
    ACTIVE,
}
enum FeatureCategoryMultiplicity {
    SINGULAR,
    PLURAL,
}

interface FeatureCategoryTextMapping {
    id: string;
    type: FeatureCategoryType;
    multiplicity: FeatureCategoryMultiplicity;
    literal: string;
    textRepresentations: string[] /* array starting with text mappings for low values */;
    emoji?: string;
}

interface FeatureCategoryDefinition {
    id: string;
    definition: string;
}

export const featuresToTextMapping: FeatureCategoryTextMapping[] = [
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
        textRepresentations: ["not touching $gender head", "touching $gender head"],
        emoji: "🤦",
    },
    {
        id: "BodyOpenness",
        type: FeatureCategoryType.POSSESSIVE,
        multiplicity: FeatureCategoryMultiplicity.SINGULAR,
        literal: "posture",
        textRepresentations: ["reserved", "relaxed", "open"],
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

export const CATEGORY_IDS: string[] = featuresToTextMapping.map((f) => f.id);

export const CATEGORY_DEFINITIONS: FeatureCategoryDefinition[] = [
    {
        id: "Gaze",
        definition:
            "Measures wether the person is actievly looking at their camera/screen or somewhere else. People who look somewhere else tend to be less engaged.",
    },
    {
        id: "Smile",
        definition:
            "Detects the tendency of facial expression. The “happier” a person is, the more engaged they usually are.",
    },
    {
        id: "Voice",
        definition: "Measures how actively the person is speaking.",
    },
    {
        id: "Armscrossed",
        definition:
            "Detects whether a person has their arms crossed or not. Crossed arms are a strong indicator for low engagement.",
    },
    {
        id: "Headtouch",
        definition:
            "Detects whether a person is touching their head. This can also happen for example when they are speaking on a phone.",
    },
    {
        id: "BodyOpenness",
        definition:
            "Detects how open a person’s body language is. The more open someone is the more engaged they tend to be.",
    },
    {
        id: "Restlessness",
        definition:
            "Detects how restless a person is, i.e. how much they are pacing or moving around. This can be a sign of engagement or disengagement, depending on other factors, such as their voice activity.",
    },
    {
        id: "Gesticulation",
        definition:
            "Detects how vividly a person is gesticulating. A lot of gesticulation is usually paired with the person talking.",
    },
];

/**
 * Extracts the appropriate literal based on the activation by linear mapping.
 * The literals inhabit equally large ranges between 0.0 and 1.0 and
 * depending on which range the value falls into that literal is returned
 * @param activation
 * @param literals
 */
const activationLiteral = (activation: number, literals: string[]) => {
    let index = Math.max(0, Math.round(activation * literals.length) - 1);
    return literals[index];
};

const activationClause = (category: FeatureCategoryTextMapping, activationValue: number, gender: Gender) => {
    return (
        (category.multiplicity === FeatureCategoryMultiplicity.SINGULAR ? "is " : "are ") +
        activationLiteral(activationValue, category.textRepresentations).replace(
            "$gender",
            genderClause(category.type, gender, true)
        )
    );
};

const categoryClause = (category: FeatureCategoryTextMapping) => {
    return category.type === FeatureCategoryType.POSSESSIVE ? category.literal + " " : "";
};

/**
 * Returns the appropriate gender pronoun.
 * @param type - whether the gender is used in an active or possessive context
 * @param gender - which gender
 * @param forcePossessive - optional, if true forces possessive context
 */
const genderClause = (type: FeatureCategoryType, gender: Gender, forcePossessive?: boolean) => {
    if (type === FeatureCategoryType.ACTIVE && !forcePossessive) {
        return gender === Gender.MALE ? "he" : "she";
    } else {
        return gender === Gender.MALE ? "his" : "her";
    }
};

/**
 * Generates a sentence describing the given feature-categories' values for a specific person.
 * e.g.: "Simon's gaze is very focused and he is actively talking."
 * 
 * Follows this approximate grammatic:
    description: <name><category.type == possessive ? "\'s" : ""> <category-clause[category]> <activation-clause[category]> [and <genderClause[category_i]> <category-clause[category_i]> <activation-clause[category_i]>]*

    category-clause[category.type == possessive]: <category.literal>
    category-clause[category.type == active]: " " //single space

    activation-clause: <category.multiplicity == singular ? "is" : "are"> <activation-literal[category]>
        
    activation-literal: <category.low> | <category.medium> | <category.high>
        
    genderClause[category.type==possessive]: his | her
    genderClause[category.type==active]: he | she
 * 
 * 
 * @param categoryIds - string[]
 * @param categoryValues - number[] representing the activation of each category.
 *                            expects the numbers to be between 0.0 and 1.0, 0 will be mapped to low values of the category
 * @param username - the name of the person that the sentence describes
 * @param userGender - the gender of that person
 */
export const generateDescriptionString = (
    categoryIds: string[],
    categoryValues: number[],
    username: string,
    userGender: Gender
) => {
    let descriptionObject = generateDescriptionObject(categoryIds, categoryValues, username, userGender);

    let output = descriptionObject.username;

    for (let activation of descriptionObject.categoryActivations) {
        output += activation.activationAsText;
    }

    output += ".";
    return output;
};

export function generateDescriptionObject(
    categoryIds: string[],
    categoryValues: number[],
    username: string,
    userGender: Gender
): CategoryValueDescription {
    if (!categoryIds || categoryIds.length === 0) throw new Error("We need at least one category to describe!");

    if (categoryIds.length !== categoryValues.length) throw new Error("We need an activation value for each category!");

    let output: CategoryValueDescription = {
        username: username,
        categoryActivations: [],
    };

    let firstCategory = featuresToTextMapping.filter((c) => c.id === categoryIds[0])[0];
    let firstValue = categoryValues[0];

    output.username += firstCategory.type === FeatureCategoryType.POSSESSIVE ? "'s " : " ";
    output.categoryActivations.push({
        categoryId: firstCategory.id,
        activationAsText: categoryClause(firstCategory) + activationClause(firstCategory, firstValue, userGender),
    });

    for (let i = 1; i < categoryIds.length; i++) {
        let category = featuresToTextMapping.filter((c) => c.id === categoryIds[i])[0];
        let value = categoryValues[i];

        let activationAsText = i < categoryIds.length - 1 ? ", " : " and ";
        activationAsText += genderClause(category.type, userGender) + " ";
        activationAsText += categoryClause(category);
        activationAsText += activationClause(category, value, userGender);

        output.categoryActivations.push({
            categoryId: category.id,
            activationAsText: activationAsText,
        });
    }

    return output;
}
