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
    calculateNextDose: (hourFirstDose: string, intervalInHours: number) => {
        const now = new Date();
        const firstDoseTime = new Date(
            `${now.toISOString().split('T')[0]}T${hourFirstDose}`,
        );

        let nextDose = new Date(firstDoseTime);
        while (nextDose <= now) {
            nextDose.setHours(nextDose.getHours() + intervalInHours);
        }

        const nextDoseFormatted = nextDose.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });

        const diffInSeconds = Math.floor(
            (nextDose.getTime() - now.getTime()) / 1000,
        );
        const hours = Math.floor(diffInSeconds / 3600);
        const minutes = Math.floor((diffInSeconds % 3600) / 60);
        const seconds = diffInSeconds % 60;
        const countdownFormatted = `${String(hours).padStart(2, '0')}:${String(
            minutes,
        ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        return { nextDoseFormatted, countdownFormatted };
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
