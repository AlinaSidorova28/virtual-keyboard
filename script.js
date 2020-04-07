const wrapper = document.createElement('div');
wrapper.className = 'wrapper';
document.body.append(wrapper);

const info = document.createElement('p');
info.className = 'info';
info.innerHTML = "Смена языка ввода: 'Ctrl' + 'Alt', клавиша 'Win' на виртуальной клавиатуре <br>Сделано в ОС Windows";
wrapper.append(info);

const createInput = document.createElement('textarea');
createInput.className = 'input-field';
wrapper.append(createInput);

const input = document.querySelector('.input-field');
input.addEventListener('blur', () => input.focus());
let value = localStorage.value || 'keyEn';
const pressed = new Set();

const properties = {
    capsLock: false,
    shift: false,
    capsEv: null,
    shiftEv: null,
};

const language = {
    keyEn: {
        Backquote: "`", Digit1: "1", Digit2: "2", Digit3: "3", Digit4: "4", Digit5: "5", Digit6: "6", Digit7: "7", Digit8: "8", Digit9: "9", Digit0: "0", Minus: "-", Equal: "=", Backspace: "Backspace",
        Tab: "Tab", KeyQ: "q", KeyW: "w", KeyE: "e", KeyR: "r", KeyT: "t", KeyY: "y", KeyU: "u", KeyI: "i", KeyO: "o", KeyP: "p", BracketLeft: "[", BracketRight: "]", Backslash: "\\", Delete: "Del",
        CapsLock: "CapsLock", KeyA: "a", KeyS: "s", KeyD: "d", KeyF: "f", KeyG: "g", KeyH: "h", KeyJ: "j", KeyK: "k", KeyL: "l", Semicolon: ";", Quote: "'", Enter: "Enter",
        ShiftLeft: "Shift", KeyZ: "z", KeyX: "x", KeyC: "c", KeyV: "v", KeyB: "b", KeyN: "n", KeyM: "m", Comma: ",", Period: ".", Slash: "/", ArrowUp: "↑", ShiftRight: "Shift",
        ControlLeft: "Ctrl", MetaLeft: "Win", AltLeft: "Alt", Space: " ", AltRight: "Alt", ArrowLeft: "←", ArrowDown: "↓", ArrowRight: "→", ControlRight: "Ctrl",
    },
    keyEnShift: {
        Backquote: "~", Digit1: "!", Digit2: "@", Digit3: "#", Digit4: "$", Digit5: "%", Digit6: "^", Digit7: "&", Digit8: "*", Digit9: "(", Digit0: ")", Minus: "_", Equal: "+", Backspace: "Backspace",
        Tab: "Tab", KeyQ: "q", KeyW: "w", KeyE: "e", KeyR: "r", KeyT: "t", KeyY: "y", KeyU: "u", KeyI: "i", KeyO: "o", KeyP: "p", BracketLeft: "{", BracketRight: "}", Backslash: "|", Delete: "Del",
        CapsLock: "CapsLock", KeyA: "a", KeyS: "s", KeyD: "d", KeyF: "f", KeyG: "g", KeyH: "h", KeyJ: "j", KeyK: "k", KeyL: "l", Semicolon: ":", Quote: '"', Enter: "Enter",
        ShiftLeft: "Shift", KeyZ: "z", KeyX: "x", KeyC: "c", KeyV: "v", KeyB: "b", KeyN: "n", KeyM: "m", Comma: "<", Period: ">", Slash: "?", ArrowUp: "↑", ShiftRight: "Shift",
        ControlLeft: "Ctrl", MetaLeft: "Win", AltLeft: "Alt", Space: " ", AltRight: "Alt", ArrowLeft: "←", ArrowDown: "↓", ArrowRight: "→", ControlRight: "Ctrl",
    },
    keyRu: {
        Backquote: "ё", Digit1: "1", Digit2: "2", Digit3: "3", Digit4: "4", Digit5: "5", Digit6: "6", Digit7: "7", Digit8: "8", Digit9: "9", Digit0: "0", Minus: "-", Equal: "=", Backspace: "Backspace",
        Tab: "Tab", KeyQ: "й", KeyW: "ц", KeyE: "у", KeyR: "к", KeyT: "е", KeyY: "н", KeyU: "г", KeyI: "ш", KeyO: "щ", KeyP: "з", BracketLeft: "х", BracketRight: "ъ", Backslash: "\\", Delete: "Del",
        CapsLock: "CapsLock", KeyA: "ф", KeyS: "ы", KeyD: "в", KeyF: "а", KeyG: "п", KeyH: "р", KeyJ: "о", KeyK: "л", KeyL: "д", Semicolon: "ж", Quote: "э", Enter: "Enter",
        ShiftLeft: "Shift", KeyZ: "я", KeyX: "ч", KeyC: "с", KeyV: "м", KeyB: "и", KeyN: "т", KeyM: "ь", Comma: "б", Period: "ю", Slash: ".", ArrowUp: "↑", ShiftRight: "Shift",
        ControlLeft: "Ctrl", MetaLeft: "Win", AltLeft: "Alt", Space: " ", AltRight: "Alt", ArrowLeft: "←", ArrowDown: "↓", ArrowRight: "→", ControlRight: "Ctrl",
    },
    keyRuShift: {
        Backquote: "ё", Digit1: "!", Digit2: '"', Digit3: "№", Digit4: ";", Digit5: "%", Digit6: ":", Digit7: "?", Digit8: "*", Digit9: "(", Digit0: ")", Minus: "_", Equal: "+", Backspace: "Backspace",
        Tab: "Tab", KeyQ: "й", KeyW: "ц", KeyE: "у", KeyR: "к", KeyT: "е", KeyY: "н", KeyU: "г", KeyI: "ш", KeyO: "щ", KeyP: "з", BracketLeft: "х", BracketRight: "ъ", Backslash: "/", Delete: "Del",
        CapsLock: "CapsLock", KeyA: "ф", KeyS: "ы", KeyD: "в", KeyF: "а", KeyG: "п", KeyH: "р", KeyJ: "о", KeyK: "л", KeyL: "д", Semicolon: "ж", Quote: "э", Enter: "Enter",
        ShiftLeft: "Shift", KeyZ: "я", KeyX: "ч", KeyC: "с", KeyV: "м", KeyB: "и", KeyN: "т", KeyM: "ь", Comma: "б", Period: "ю", Slash: ",", ArrowUp: "↑", ShiftRight: "Shift",
        ControlLeft: "Ctrl", MetaLeft: "Win", AltLeft: "Alt", Space: " ", AltRight: "Alt", ArrowLeft: "←", ArrowDown: "↓", ArrowRight: "→", ControlRight: "Ctrl",
    },

};

// draw keyboard
function createKeyBoard(lang, target = false) {
    if (document.querySelector('.keyboard')) {
        document.querySelector('.keyboard').remove();
    }

    const keyboard = document.createElement('div');
    keyboard.className = 'keyboard';
    wrapper.appendChild(keyboard);

    let line = document.createElement('div');
    line.className = 'line';
    for (const key in lang[value]) {
        if (key === "Tab" || key === "CapsLock" || key === "ShiftLeft" || key === "ControlLeft") {
            line = document.createElement('div');
            line.className = 'line';
        }
        line.appendChild(createKey(key, lang[value][key], target));
        keyboard.appendChild(line);
    }
    if (properties.shiftEv && properties.shift) {
        document.querySelector(`.key[id="${properties.shiftEv.code}"]`).classList.add('active');
    }
    if (properties.capsEv && properties.capsLock) {
        document.querySelector(`.key[id="${properties.capsEv.code}"]`).classList.add('active');
    }
    inputKey();
}

// create button on the keyboard
function createKey(keyCode, keyValue, target = false) {
    const key = document.createElement('div');
    key.className = 'key';
    key.id = keyCode;

    if (keyValue.length === 1 && (target.code === 'CapsLock' || target.key === 'Shift')) {
        keyValue = keyValue.toUpperCase();
    }
    if (keyValue.length > 4) {
        key.classList.add('long-key', 'dark-key');
    }

    switch (keyValue) {
        case ' ':
            key.classList.add('space', 'dark-key');
            break;
        case 'Tab':
        case 'Del':
            key.classList.add('average-key', 'dark-key');
            break;
        case 'Ctrl':
        case 'Win':
        case 'Alt':
        case '←':
        case '↓':
        case '→':
        case '↑':
            key.classList.add('dark-key');
            break;
        default:
            break;
    }

    key.textContent = keyValue;
    return key;
}

// change language on keyboard
function languageChange() {
    if (value === "keyEn") {
        value = "keyRu";
        localStorage.value = value;
    } else if (value === "keyEnShift") {
        value = "keyRuShift";
        localStorage.value = "keyRu";
    } else if (value === "keyRu") {
        value = "keyEn";
        localStorage.value = value;
    } else if (value === "keyRuShift") {
        value = "keyEnShift";
        localStorage.value = "keyEn";
    }
}

// change symbols to 'shift mode'
function shiftMode() {
    if (value === "keyEn") {
        value = "keyEnShift";
    } else if (value === "keyRu") {
        value = "keyRuShift";
    }
}

// return mode to usual state
function ordinaryMode() {
    if (value === "keyEnShift") {
        value = "keyEn";
    } else if (value === "keyRuShift") {
        value = "keyRu";
    }
}

// handler for real action 'onkeydown'
document.onkeydown = (event) => {
    input.focus();
    if (language[value].hasOwnProperty(event.code)) {
        if (event.altKey && event.ctrlKey) {
            event.preventDefault();
            languageChange();
        }
        if (event.shiftKey || event.code === "CapsLock") {
            shiftOrCapsDown(event);
        }
        pressed.add(event.code);
        pressed.forEach((e) => {
            document.querySelector(`.key[id="${e}"]`).classList.add('active');
        });
        if (event.key.length === 1) {
            event.preventDefault();
            const key = document.querySelector(`.key[id="${event.code}"]`).textContent;
            input.setRangeText(key, input.selectionStart, input.selectionEnd, 'end');
        } else if (event.key === "Tab") {
            event.preventDefault();
            onTabClick();
        } else if (event.altKey || event.metaKey || event.ctrlKey) {
            event.preventDefault();
        }
    }
};

// handler for real action 'onkeyup'
document.onkeyup = (event) => {
    if (language[value].hasOwnProperty(event.code)) {
        shiftOrCapsUp(event);
    }
    if (event.key !== "Shift" && event.key !== "CapsLock") {
        pressed.delete(event.code);
    }
};

// hadler for mouse actions
function inputKey() {
    input.focus();
    const keyboard = document.querySelectorAll('.keyboard .line div');
    keyboard.forEach((e) => e.addEventListener('mousedown', (event) => {
        if (event.target.textContent === "Shift" || event.target.textContent === "CapsLock") {
            shiftOrCapsDown({ code: event.target.id, key: event.target.textContent });
        }
        if (event.target.textContent.length === 1 && event.target.id !== "ArrowRight" && event.target.id !== "ArrowLeft" && event.target.id !== "ArrowUp" && event.target.id !== "ArrowDown") {
            const key = document.querySelector(`.key[id="${event.target.id}"]`).textContent;
            input.setRangeText(key, input.selectionStart, input.selectionEnd, 'end');
        } else if (event.target.textContent === "Tab") {
            onTabClick();
        } else if (event.target.textContent === "Enter") {
            input.setRangeText("\n", input.selectionStart, input.selectionEnd, 'end');
        } else if (event.target.textContent === "Backspace") {
            onBackspaceClick();
        } else if (event.target.textContent === "Del") {
            input.setRangeText('', input.selectionStart, input.selectionEnd + 1);
        } else if (event.target.textContent === "Win") {
            languageChange();
        } else if (event.target.id === "ArrowRight") {
            arrowRightHandler();
        } else if (event.target.id === "ArrowLeft") {
            arrowLefttHandler();
        } else if (event.target.id === "ArrowUp") {
            arrowUpHandler();
        } else if (event.target.id === "ArrowDown") {
            arrowDownHandler();
        }
    }));

    keyboard.forEach((e) => e.addEventListener('mouseup', (event) => {
        shiftOrCapsUp({ code: event.target.id, key: event.target.textContent });
    }));
}

// handler for pressed Enter or CapsLock
function shiftOrCapsDown(event) {
    if (event.code === "CapsLock") {
        pressed.add(event.code);
        properties.capsLock = !properties.capsLock;
        properties.capsEv = event;
    }
    if (event.key === "Shift") {
        pressed.add(event.code);
        properties.shift = !properties.shift;
        properties.shiftEv = event;
    }

    if (properties.capsLock && properties.shift) {
        shiftMode();
        createKeyBoard(language);
    } else if (properties.capsLock) {
        createKeyBoard(language, properties.capsEv);
    } else if (properties.shift) {
        shiftMode();
        createKeyBoard(language, properties.shiftEv);
    } else {
        createKeyBoard(language, event);
    }
    pressed.forEach((e) => {
        document.querySelector(`.key[id="${e}"]`).classList.add('active');
    });
}

// handler for keyup of Enter or CapsLock
function shiftOrCapsUp(event) {
    if (event.key !== "Shift" && event.key !== "CapsLock") {
        document.querySelector(`.key[id="${event.code}"]`).classList.remove('active');
    }
    if (!properties.shift && properties.shiftEv) {
        ordinaryMode();
        pressed.delete(properties.shiftEv.code);
        document.querySelector(`.key[id="${properties.shiftEv.code}"]`).classList.remove('active');
    }
    if (!properties.capsLock && properties.capsEv) {
        document.querySelector(`.key[id="${properties.capsEv.code}"]`).classList.remove('active');
        pressed.delete(properties.capsEv.code);
    }
    if (properties.capsLock && properties.shift) {
        createKeyBoard(language);
        return;
    }
    if (properties.capsLock) {
        createKeyBoard(language, properties.capsEv);
        return;
    }
    if (properties.shift) {
        createKeyBoard(language, properties.shiftEv);
        return;
    }
    createKeyBoard(language);
}

// handler for Tab button
function onTabClick() {
    input.setRangeText("     ", input.selectionStart, input.selectionEnd, 'end');
}

// handler for virtual backSpace button
function onBackspaceClick() {
    if (input.value === '') {
        return;
    }
    if (input.selectionStart === input.selectionEnd) {
        input.setRangeText('', input.selectionStart - 1, input.selectionEnd);
    } else {
        input.setRangeText('', input.selectionStart, input.selectionEnd, 'end');
    }
}

// handlers for arrows on virual keyboard
function arrowRightHandler() {
    const pos = input.selectionEnd;
    input.selectionStart = pos + 1;
    input.selectionEnd = pos + 1;
}

function arrowLefttHandler() {
    const pos = input.selectionStart;
    if (pos) {
        input.selectionStart = pos - 1;
        input.selectionEnd = pos - 1;
    }
}

function arrowUpHandler() {
    input.selectionStart = 0;
    input.selectionEnd = 0;
}

function arrowDownHandler() {
    input.selectionStart = input.value.length;
    input.selectionEnd = input.value.length;
}

createKeyBoard(language);
