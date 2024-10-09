"use strict";

const passwordDisplay = document.querySelector(".password-display");
const passwordPlaceholder = document.querySelector(".password-placeholder");
const passwordCopyText = document.querySelector(".copy-text");
const passwordCopyBtn = document.querySelector(".copy-btn");

const passwordForm = document.querySelector(".password_setting");
const charCount = document.querySelector(".char_count");
const lengthSlider = document.querySelector(".char_length_slider");
const checkBoxes = document.querySelectorAll("input[type=checkbox]");

const StrengthDesc = document.querySelector(".strength_rating_text");
const StrengthBars = document.querySelectorAll(".bar");

const Character_sets = {
    uppercase: ["ABCDEFGHIJKLMNOPQRSTUVWXYZ", 26],
    lowercase: ["abcdefghijklmnopqrstuvwxyz", 26],
    number: ["1234567890", 10],
    symbols: ["!@#$%^&*()", 10],
};

let canCopy = false;

const getSliderval = () => {
    charCount.textContent = lengthSlider.value;
};

const styleRangeSlider = () => {
    const min = lengthSlider.min;
    const max = lengthSlider.max;
    const val = lengthSlider.value;

    lengthSlider.style.backgroundSize = (val - min) * 100 / (max - min) + "% 100%";
};

const handlSliderinput = () => {
    getSliderval();
    styleRangeSlider();
};

const resetBarStyles = () => {
    StrengthBars.forEach((bar) => {
        bar.style.backgroundColor = "transparent";
        bar.style.borderColor = "hsl(252, 11%, 91%)";
    });
};

const stylebars = ([...barElement], color) => {
    barElement.forEach(bar => {
        bar.style.backgroundColor = color;
        bar.style.borderColor = color;
    });
};

const styleMeter = (rating) => {
    const text = rating[0];
    const numBars = rating[1];
    const barToFill = Array.from(StrengthBars).slice(0, numBars);
    resetBarStyles();
    StrengthDesc.textContent = text;
    switch (numBars) {
        case 1:
            return stylebars(barToFill, "hsl(0, 91%, 63%)");
        case 2:
            return stylebars(barToFill, "hsl(13, 95%, 66%)");
        case 3:
            return stylebars(barToFill, "hsl(42, 91%, 68%)");
        case 4:
            return stylebars(barToFill, "hsl(127, 100%, 82%)");
        default:
            throw new Error("Invalid value from Num Bars");
    }
};

/* Password generate */

const calcStrength = (passwordLength, charPoolSize) => {
    const strength = passwordLength * Math.log2(charPoolSize);
    if (strength < 25) {
        return ["Too weak", 1];
    } else if (strength >= 25 && strength < 50) {
        return ["Weak", 2];
    } else if (strength >= 50 && strength < 75) {
        return ["Medium", 3];
    } else {
        return ["Strong", 4];
    }
};

const generatePassword = (e) => {
    e.preventDefault();
    validInput();

    let generatePassword = "";
    let includeSets = [];
    let charPool = 0;
    checkBoxes.forEach((box) => {
        if (box.checked) {
            includeSets.push(Character_sets[box.value][0]);
            charPool += Character_sets[box.value][1];
        }
    });

    if (includeSets.length > 0) {
        for (let i = 0; i < lengthSlider.value; i++) {
            const randsetIndex = Math.floor(Math.random() * includeSets.length);
            const randset = includeSets[randsetIndex];

            const randCharIndex = Math.floor(Math.random() * randset.length);
            const randChar = randset[randCharIndex];

            generatePassword += randChar;
        }
    }

    const strength = calcStrength(lengthSlider.value, charPool);
    styleMeter(strength);
    canCopy = true;
    passwordDisplay.textContent = generatePassword;
};

const validInput = () => {
    if (Array.from(checkBoxes).every((box) => !box.checked)) {
        alert("Make sure to check at least one checkbox");
    }
};

const copyPassword = async () => {
    if (!passwordDisplay.textContent || passwordCopyText.textContent) return;

    if (!canCopy) return;

    setTimeout(() => {
        passwordCopyText.style.transition = "all 1s";
        passwordCopyText.style.opacity = 0;
        setTimeout(() => {
            passwordCopyText.style.removeProperty("opacity");
            passwordCopyText.style.removeProperty("transition");
            passwordCopyText.textContent = "";
        }, 1000);
    }, 1000);

    await navigator.clipboard.writeText(passwordDisplay.textContent);
    passwordCopyText.textContent = "Copied!";
};

charCount.textContent = lengthSlider.value;

lengthSlider.addEventListener("input", handlSliderinput);
passwordForm.addEventListener("submit", generatePassword);
passwordCopyBtn.addEventListener("click", copyPassword);
