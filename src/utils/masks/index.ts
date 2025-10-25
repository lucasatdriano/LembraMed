const Masks = {
    phone: (value: string): string => {
        if (!value) return '';

        const cleaned = value.replace(/\D/g, '');

        if (cleaned.length <= 2) {
            return cleaned;
        } else if (cleaned.length <= 6) {
            return cleaned.replace(/(\d{2})(\d{0,4})/, '($1) $2');
        } else if (cleaned.length <= 10) {
            return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else {
            return cleaned.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        }
    },

    date: (value: string): string => {
        if (!value) return '';

        const cleaned = value.replace(/\D/g, '');

        if (cleaned.length <= 2) {
            return cleaned;
        } else if (cleaned.length <= 4) {
            return cleaned.replace(/(\d{2})(\d{0,2})/, '$1/$2');
        } else {
            return cleaned.replace(/(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3');
        }
    },

    time: (value: string): string => {
        if (!value) return '';

        const cleaned = value.replace(/\D/g, '');

        if (cleaned.length <= 2) {
            return cleaned;
        } else {
            return cleaned.replace(/(\d{2})(\d{0,2})/, '$1:$2');
        }
    },

    period: (value: string): string => {
        if (!value) return '';

        const cleaned = value.replace(/[^\d\s-:]/g, '');

        if (cleaned.length <= 5) {
            return cleaned;
        } else if (cleaned.length <= 6) {
            return cleaned.replace(/(\d{2}:\d{2})\s*(\d{0,2})/, '$1 - $2');
        } else {
            return cleaned.replace(/(\d{2}:\d{2})\s*(\d{0,5})/, '$1 - $2');
        }
    },

    unmask: (value: string): string => {
        return value.replace(/\D/g, '');
    },
};

export default Masks;
