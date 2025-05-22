export function normalizeText(str: string): string[] {
    return str
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove acentos
        .replace(/[^a-z0-9]/g, ' ')
        .split(' ')
        .filter(Boolean)
        .sort();
}

export function isSameProduct(a: string, b: string): boolean {
    const na = normalizeText(a).join('');
    const nb = normalizeText(b).join('');
    if (na === nb) return true;

    const setA = new Set(normalizeText(a));
    const setB = new Set(normalizeText(b));

    if (setA.size !== setB.size) return false;
    return [...setA].every(word => setB.has(word));
}