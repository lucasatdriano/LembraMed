const Formatters = {
    splitPeriod: (period: string) => {
        if (!period || period.trim() === '') {
            return { start: undefined, end: undefined };
        }
        const [start, end] = period.split(' - ');
        return { start, end };
    },
    formatPeriod: (start: string, end: string) => {
        return `${start} - ${end}`;
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
    formatDate: (date: Date | null) =>
        date
            ? `${date.getDate().toString().padStart(2, '0')}/${(
                  date.getMonth() + 1
              )
                  .toString()
                  .padStart(2, '0')}/${date.getFullYear()}`
            : '',
};

export default Formatters;
