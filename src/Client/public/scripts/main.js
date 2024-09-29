async function delay (ms) {
    return await new Promise(resolve => setTimeout(resolve, ms));
}

function generateUniqueNumber() {
    const timestamp = Date.now(); // Текущее время в миллисекундах
    const randomNum = Math.floor(Math.random() * 100000); // Случайное число от 0 до 99999
    return Number(timestamp.toString() + randomNum.toString()); // Конкатенация времени и случайного числа
}