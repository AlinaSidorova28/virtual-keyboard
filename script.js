class Keyboard {
    constructor() {
        this.value = localStorage.value || 'keyEn';
        this.pressed = new Set();
        this.capsLock = false;
        this.shift = false;
        this.capsEv = null;
        this.shiftEv = null;
        this.input = document.createElement('textarea');
        this.wrapper = document.createElement('div');
    }

    init() {
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'wrapper';

        const info = document.createElement('p');
        info.className = 'info';
        info.innerHTML = "Смена языка ввода: 'Ctrl' + 'Alt', клавиша 'Win' на виртуальной клавиатуре <br>Сделано в ОС Windows";
        this.wrapper.append(info);

        this.input.className = 'input-field';
        this.input.addEventListener('blur', () => this.input.focus());
        this.wrapper.append(this.input);
        document.body.append(this.wrapper);

        document.addEventListener('keydown', this.pressHandler.bind(this));
        document.addEventListener('keyup', this.upHandler.bind(this));
        this.createKeyBoard(language);
    }

    animation(code) {
        const buttons = document.querySelectorAll('.key');
        buttons.forEach((btn) => {
            if (btn.id === code) {
                btn.classList.toggle('pressed');
            }
        });
    }

    // draw keyboard
    createKeyBoard(lang, target = false) {
        if (document.querySelector('.keyboard')) {
            document.querySelector('.keyboard').remove();
        }

        const keyboard = document.createElement('div');
        keyboard.className = 'keyboard';
        this.wrapper.appendChild(keyboard);

        for (let i = 0; i < language[this.value].length; i += 1) {
            const line = document.createElement('div');
            line.className = 'line';
            for (let j = 0; j < language[this.value][i].length; j += 1) {
                const key = language[this.value][i][j];
                line.appendChild(this.createKey(keyCodeArr[i][j], key, target));
            }
            keyboard.appendChild(line);
        }
        if (this.shiftEv && this.shift) {
            document.querySelector(`.key[id="${this.shiftEv.code}"]`).classList.add('active');
        }
        if (this.capsEv && this.capsLock) {
            document.querySelector(`.key[id="${this.capsEv.code}"]`).classList.add('active');
        }
        this.inputKey();
    }

    // create button on the keyboard
    createKey(keyCode, keyValue, target = false) {
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
    languageChange() {
        if (this.value === "keyEn") {
            this.value = "keyRu";
            localStorage.value = this.value;
        } else if (this.value === "keyEnShift") {
            this.value = "keyRuShift";
            localStorage.value = "keyRu";
        } else if (this.value === "keyRu") {
            this.value = "keyEn";
            localStorage.value = this.value;
        } else if (this.value === "keyRuShift") {
            this.value = "keyEnShift";
            localStorage.value = "keyEn";
        }
    }

    // change symbols to 'shift mode'
    shiftMode() {
        if (this.value === "keyEn") {
            this.value = "keyEnShift";
        } else if (this.value === "keyRu") {
            this.value = "keyRuShift";
        }
    }

    // return mode to usual state
    ordinaryMode() {
        if (this.value === "keyEnShift") {
            this.value = "keyEn";
        } else if (this.value === "keyRuShift") {
            this.value = "keyRu";
        }
    }

    // handler for real action 'onkeydown'
    pressHandler(event) {
        this.input.focus();
        this.animation(event.code);
        if (keyCodeArr.flat().includes(event.code)) {
            if (event.altKey && event.ctrlKey) {
                event.preventDefault();
                this.languageChange();
            }
            if (event.shiftKey || event.code === "CapsLock") {
                this.shiftOrCapsDown(event);
                this.animation(event.code);
            }
            this.pressed.add(event.code);
            this.pressed.forEach((e) => {
                document.querySelector(`.key[id="${e}"]`).classList.add('active');
            });
            if (event.key.length === 1) {
                event.preventDefault();
                const key = document.querySelector(`.key[id="${event.code}"]`).textContent;
                this.input.setRangeText(key, this.input.selectionStart, this.input.selectionEnd, 'end');
            } else if (event.key === "Tab") {
                event.preventDefault();
                this.onTabClick();
            } else if (event.altKey || event.metaKey || event.ctrlKey) {
                event.preventDefault();
            }
        }
    }

    // handler for real action 'onkeyup'
    upHandler(event) {
        if (keyCodeArr.flat().includes(event.code)) {
            this.shiftOrCapsUp(event);
        }
        if (event.key !== "Shift" && event.key !== "CapsLock") {
            this.pressed.delete(event.code);
        }
    }

    // hadler for mouse actions
    inputKey() {
        this.input.focus();
        const keyboard = document.querySelectorAll('.key');
        keyboard.forEach((e) => e.addEventListener('mousedown', (event) => {
            this.animation(event.target.id);
            if (event.target.textContent === "Shift" || event.target.textContent === "CapsLock") {
                this.shiftOrCapsDown({ code: event.target.id, key: event.target.textContent });
                this.animation(event.target.id);
            }
            if (event.target.textContent.length === 1 && event.target.id !== "ArrowRight" && event.target.id !== "ArrowLeft" && event.target.id !== "ArrowUp" && event.target.id !== "ArrowDown") {
                const key = document.querySelector(`.key[id="${event.target.id}"]`).textContent;
                this.input.setRangeText(key, this.input.selectionStart, this.input.selectionEnd, 'end');
            } else if (event.target.textContent === "Tab") {
                this.onTabClick();
            } else if (event.target.textContent === "Enter") {
                this.input.setRangeText("\n", this.input.selectionStart, this.input.selectionEnd, 'end');
            } else if (event.target.textContent === "Backspace") {
                this.onBackspaceClick();
            } else if (event.target.textContent === "Del") {
                this.onDeleteClick();
            } else if (event.target.textContent === "Win") {
                this.languageChange();
            } else if (event.target.id === "ArrowRight") {
                this.arrowRightHandler();
            } else if (event.target.id === "ArrowLeft") {
                this.arrowLefttHandler();
            } else if (event.target.id === "ArrowUp") {
                this.arrowUpHandler();
            } else if (event.target.id === "ArrowDown") {
                this.arrowDownHandler();
            }
        }));

        keyboard.forEach((e) => e.addEventListener('mouseup', (event) => {
            this.shiftOrCapsUp({ code: event.target.id, key: event.target.textContent });
        }));
    }

    // handler for pressed Enter or CapsLock
    shiftOrCapsDown(event) {
        if (event.code === "CapsLock") {
            this.pressed.add(event.code);
            this.capsLock = !this.capsLock;
            this.capsEv = event;
        }
        if (event.key === "Shift") {
            this.pressed.add(event.code);
            this.shift = !this.shift;
            this.shiftEv = event;
        }

        if (this.capsLock && this.shift) {
            this.shiftMode();
            this.createKeyBoard(language);
        } else if (this.capsLock) {
            this.createKeyBoard(language, this.capsEv);
        } else if (this.shift) {
            this.shiftMode();
            this.createKeyBoard(language, this.shiftEv);
        } else {
            this.createKeyBoard(language, event);
        }
        this.pressed.forEach((e) => {
            document.querySelector(`.key[id="${e}"]`).classList.add('active');
        });
    }

    // handler for keyup of Enter or CapsLock
    shiftOrCapsUp(event) {
        if (event.key !== "Shift" && event.key !== "CapsLock") {
            document.querySelector(`.key[id="${event.code}"]`).classList.remove('active');
        }
        if (!this.shift && this.shiftEv) {
            this.ordinaryMode();
            this.pressed.delete(this.shiftEv.code);
            document.querySelector(`.key[id="${this.shiftEv.code}"]`).classList.remove('active');
        }
        if (!this.capsLock && this.capsEv) {
            document.querySelector(`.key[id="${this.capsEv.code}"]`).classList.remove('active');
            this.pressed.delete(this.capsEv.code);
        }
        if (this.capsLock && this.shift) {
            this.createKeyBoard(language);
            return;
        }
        if (this.capsLock) {
            this.createKeyBoard(language, this.capsEv);
            return;
        }
        if (this.shift) {
            this.createKeyBoard(language, this.shiftEv);
            return;
        }
        this.createKeyBoard(language);
    }

    // handler for Tab button
    onTabClick() {
        this.input.setRangeText("     ", this.input.selectionStart, this.input.selectionEnd, 'end');
    }

    // handler for virtual backSpace button
    onBackspaceClick() {
        const start = this.input.selectionStart;
        const end = this.input.selectionEnd;
        if (start !== end) {
            this.input.setRangeText('', start, end);
        } else if (start !== 0) {
            this.input.setRangeText('', start - 1, end, 'end');
        } else {
            this.input.setSelectionRange(start, end);
        }
    }

    // handler for virtual Del button
    onDeleteClick() {
        this.input.setRangeText('', this.input.selectionStart, this.input.selectionEnd + 1);
    }

    // handlers for arrows on virual keyboard
    arrowRightHandler() {
        const pos = this.input.selectionEnd;
        this.input.setSelectionRange(pos + 1, pos + 1);
    }

    arrowLefttHandler() {
        const pos = this.input.selectionStart;
        if (pos) {
            this.input.setSelectionRange(pos - 1, pos - 1);
        }
    }

    arrowUpHandler() {
        this.input.setSelectionRange(0, 0);
    }

    arrowDownHandler() {
        const pos = this.input.value.length;
        this.input.setSelectionRange(pos, pos);
    }
}

const language = {
    keyEn: [
        ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
        ["Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\", "Del"],
        ["CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "Enter"],
        ["Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "↑", "Shift"],
        ["Ctrl", "Win", "Alt", " ", "Alt", "←", "↓", "→", "Ctrl"],
    ],
    keyEnShift: [
        ["~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "Backspace"],
        ["Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "{", "}", "|", "Del"],
        ["CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ":", '"', "Enter"],
        ["Shift", "z", "x", "c", "v", "b", "n", "m", "<", ">", "?", "↑", "Shift"],
        ["Ctrl", "Win", "Alt", " ", "Alt", "←", "↓", "→", "Ctrl"],
    ],
    keyRu: [
        ["ё", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
        ["Tab", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "\\", "Del"],
        ["CapsLock", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "Enter"],
        ["Shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".", "↑", "Shift"],
        ["Ctrl", "Win", "Alt", " ", "Alt", "←", "↓", "→", "Ctrl"],
    ],
    keyRuShift: [
        ["ё", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "Backspace"],
        ["Tab", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "/", "Del"],
        ["CapsLock", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "Enter"],
        ["Shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ",", "↑", "Shift"],
        ["Ctrl", "Win", "Alt", " ", "Alt", "←", "↓", "→", "Ctrl"],
    ],
};

const keyCodeArr = [
    ["Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal", "Backspace"],
    ["Tab", "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight", "Backslash", "Delete"],
    ["CapsLock", "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote", "Enter"],
    ["ShiftLeft", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash", "ArrowUp", "ShiftRight"],
    ["ControlLeft", "MetaLeft", "AltLeft", "Space", "AltRight", "ArrowLeft", "ArrowDown", "ArrowRight", "ControlRight"],
];

window.onload = () => {
    const keyboard = new Keyboard();
    keyboard.init();
};
