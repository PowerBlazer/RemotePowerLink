export class Stack<T> {
    private items: T[];

    constructor () {
        this.items = [];
    }

    // Добавление элемента в стек
    push (element: T): void {
        this.items.push(element);
    }

    // Удаление элемента из вершины стека
    pop (): T | undefined {
        if (this.isEmpty()) {
            return undefined; // Underflow
        }
        return this.items.pop();
    }

    // Просмотр вершины стека без удаления
    peek (): T | undefined {
        return this.isEmpty() ? undefined : this.items[this.items.length - 1];
    }

    // Проверка, пуст ли стек
    isEmpty (): boolean {
        return this.items.length === 0;
    }

    // Возвращает количество элементов в стеке
    size (): number {
        return this.items.length;
    }

    // Очистка стека
    clear (): void {
        this.items = [];
    }
}
