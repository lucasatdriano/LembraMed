const Formatters = {
    splitPeriod: (period: string) => {
        if (!period || period.trim() === '') {
            return { start: undefined, end: undefined };
        }
        const [start, end] = period.split(' - ');
        return { start, end };
    },
    formatPeriod: (start: string | null, end: string | null) => {
        return `${start} - ${end}`;
    },
    formatHour: (input: string) => {
        const numbers = input.replace(/\D/g, '');

        if (numbers.length <= 2) {
            return numbers;
        } else {
            return `${numbers.slice(0, 2)}:${numbers.slice(2, 4)}`;
        }
    },
    formatPhoneNumber: (phoneNumber: string) => {
        const cleaned = phoneNumber.replace(/\D/g, '');

        if (cleaned.length <= 3) {
            return cleaned;
        } else if (cleaned.length <= 6) {
            return cleaned.replace(/(\d{2})(\d{0,4})/, '($1) $2');
        } else if (cleaned.length <= 10) {
            return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else {
            return cleaned.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        }
    },
    formatDate: (date: Date | string | null) => {
        if (!date) return '';

        const dateObj = typeof date === 'string' ? new Date(date) : date;

        return `${dateObj.getDate().toString().padStart(2, '0')}/${(
            dateObj.getMonth() + 1
        )
            .toString()
            .padStart(2, '0')}/${dateObj.getFullYear()}`;
    },
    formatDateTime: (date: Date | string | null) => {
        if (!date) return '';

        const dateObj = typeof date === 'string' ? new Date(date) : date;

        return `${dateObj.getDate().toString().padStart(2, '0')}/${(
            dateObj.getMonth() + 1
        )
            .toString()
            .padStart(2, '0')}/${dateObj.getFullYear()} ${dateObj
            .getHours()
            .toString()
            .padStart(2, '0')}:${dateObj
            .getMinutes()
            .toString()

            .padStart(2, '0')}`;
    },
    formatToISO: (dateString: string | undefined) => {
        if (!dateString) return undefined;

        const [day, month, year] = dateString.split('/');
        return `${year}-${month}-${day}`;
    },
    formatName: (name: string) => {
        if (!name || name.trim() === '') return '';

        return name
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    },
};

export default Formatters;
