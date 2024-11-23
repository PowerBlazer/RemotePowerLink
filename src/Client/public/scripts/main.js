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