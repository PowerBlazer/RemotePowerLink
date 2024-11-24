async function delay (ms) {
    return await new Promise(resolve => setTimeout(resolve, ms));
}

function generateUniqueNumber() {
    const timestamp = Date.now(); // Текущее время в миллисекундах
    const randomNum = Math.floor(Math.random() * 100000); // Случайное число от 0 до 99999
    return Number(timestamp.toString() + randomNum.toString()); // Конкатенация времени и случайного числа
}

function hexToRgba(hex, alpha = 1) {
    // Удаляем символ #, если он есть
    hex = hex.replace('#', '');

    // Если длина HEX равна 3, преобразуем в полный формат (например, "abc" → "aabbcc")
    if (hex.length === 3) {
        hex = hex.split('').map((char) => char + char).join('');
    }

    // Разбираем RGB компоненты
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Возвращаем строку в формате RGBA
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function isLightBackground(hexColor) {
    const r = parseInt(hexColor.slice(1, 3), 16) / 255;
    const g = parseInt(hexColor.slice(3, 5), 16) / 255;
    const b = parseInt(hexColor.slice(5, 7), 16) / 255;
    
    const normalize = (value) =>
        value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);

    const rNorm = normalize(r);
    const gNorm = normalize(g);
    const bNorm = normalize(b);

    // Вычисление относительной яркости
    const luminance = 0.2126 * rNorm + 0.7152 * gNorm + 0.0722 * bNorm;

    // Если яркость больше 0.5, фон считается светлым
    return luminance > 0.5;
}