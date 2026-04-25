export function formatPrice(amount: number): string {
    return new Intl.NumberFormat('uk-UA', {
        style: 'currency',
        currency: 'UAH',
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatDate(iso: string): string {
    return new Intl.DateTimeFormat('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date(iso));
}

const CATEGORY_SINGULAR: Record<string, string> = {
    'Процесори':             'Процесор',
    'Відеокарти':            'Відеокарта',
    "Оперативна пам'ять":    "Оперативна пам'ять",
    //'Накопичувачі':          'Накопичувач', // Батьківська категорія, я думаю вона буде використовуватися у назві продукції
    'Материнські плати':     'Материнська плата',
    'Блоки живлення':        'Блок живлення',
    'Корпуси':               'Корпус',
    //'Охолодження':           'Система охолодження', // Батьківська категорія, я думаю вона буде використовуватися у назві продукції
    'SSD-накопичувачі':      'SSD-накопичувач',
    'HDD-накопичувачі':      'HDD-накопичувач',
    'Кулери для CPU':        'Кулер для CPU',
    'Корпусні вентилятори':  'Корпусний вентилятор',
};

export function getProductDisplayName(name: string, categoryName: string): string {
    const prefix = CATEGORY_SINGULAR[categoryName];
    return prefix ? `${prefix} ${name}` : name;
}