const Formatters = {
    splitPeriod: (period: string) => {
        if (
            !period ||
            period.trim() === '' ||
            period === 'Período indefinido'
        ) {
            return { start: undefined, end: undefined };
        }
        const [start, end] = period.split(' - ');
        return { start, end };
    },
    formatPeriod: (periodstart: string | null, periodend: string | null) => {
        const hasPeriodStart =
            periodstart && periodstart !== 'null' && periodstart.trim() !== '';

        const hasPeriodEnd =
            periodend && periodend !== 'null' && periodend.trim() !== '';

        if (!hasPeriodStart && !hasPeriodEnd) {
            return 'Período indefinido';
        }

        const startDate = hasPeriodStart
            ? Formatters.formatDate(periodstart!)
            : 'Data indefinida';
        const endDate = hasPeriodEnd
            ? Formatters.formatDate(periodend!)
            : 'Data indefinida';

        return `${startDate} - ${endDate}`;
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

        if (typeof date === 'string') {
            if (date.includes('T') && date.includes('Z')) {
                const [datePart] = date.split('T');
                const [year, month, day] = datePart.split('-');
                return `${day}/${month}/${year}`;
            }
            if (date.includes('-')) {
                const [year, month, day] = date.split('-');
                return `${day}/${month}/${year}`;
            }
        }

        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const year = dateObj.getFullYear();
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const day = dateObj.getDate().toString().padStart(2, '0');

        return `${day}/${month}/${year}`;
    },
    formatDateTime: (date: Date | string | null) => {
        if (!date) return '';

        if (
            typeof date === 'string' &&
            date.includes('T') &&
            date.includes('Z')
        ) {
            const [datePart, timePart] = date.split('T');
            const [year, month, day] = datePart.split('-');
            const [hours, minutes] = timePart.split(':');

            return `${day}/${month}/${year} ${hours}:${minutes}`;
        }

        if (typeof date === 'string') {
            const dateObj = new Date(date);
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
        }

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
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
