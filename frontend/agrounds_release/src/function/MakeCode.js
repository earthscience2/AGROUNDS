function decimalToBase32(decimalNumber) {
    if (decimalNumber < 0) {
        throw new Error("음수는 처리할 수 없습니다.");
    }
    const base32Digits = "0123456789abcdefghijklmnopqrstuv";
    let base32Result = "";

    while (decimalNumber > 0) {
        const remainder = decimalNumber % 32;
        base32Result = base32Digits[remainder] + base32Result;
        decimalNumber = Math.floor(decimalNumber / 32);
    }

    if (base32Result === "") {
        base32Result = "0";
    }

    return base32Result;
}

function makeDecimal() {
    const now = new Date();
    let codeFormet = String(now.getFullYear());

    // 월 (0보다 작으면 0 패딩 후 추가; JS에서는 getMonth()가 0부터 시작하므로 +1 해줍니다.)
    const month = now.getMonth() + 1;
    if (month < 10) {
        codeFormet += '0';
    }
    codeFormet += month;

    // 일 (Python 코드에서는 zero padding 없이 그대로 사용)
    codeFormet += now.getDate();

    // 시
    const hour = now.getHours();
    if (hour < 10) {
        codeFormet += '0';
    }
    codeFormet += hour;

    // 분
    const minute = now.getMinutes();
    if (minute < 10) {
        codeFormet += '0';
    }
    codeFormet += minute;

    // 초
    const second = now.getSeconds();
    if (second < 10) {
        codeFormet += '0';
    }
    codeFormet += second;

    // 밀리초 (Python의 microsecond와 달리 JS는 밀리초 단위입니다)
    const ms = now.getMilliseconds();
    if (ms < 10) {
        codeFormet += '0';
    }
    codeFormet += ms;

    return codeFormet;
}

function makeCode(codeType) {
    const decimalNumberCode = makeDecimal();
    const halfLength = Math.floor(decimalNumberCode.length / 2);
    const codeFrontStr = decimalNumberCode.substring(0, halfLength);
    const codeBackStr = decimalNumberCode.substring(halfLength);

    const codeFront = decimalToBase32(parseInt(codeFrontStr, 10));
    const codeBack = decimalToBase32(parseInt(codeBackStr, 10));

    return codeType + "_" + codeFront + codeBack;
}

export default makeCode