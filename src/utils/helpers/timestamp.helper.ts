export const extractTimeFromTimestamp = (timestamp: string | null): string => {
    if (!timestamp) return '--:--:--';

    const timeMatch = timestamp.match(/(\d{2}):(\d{2}):(\d{2})/);
    if (timeMatch) {
        return `${timeMatch[1]}:${timeMatch[2]}:${timeMatch[3]}`;
    }

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '--:--:--';
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
};

export const extractHourMinuteFromTimestamp = (
    timestamp: string | null,
): string => {
    if (!timestamp) return '--:--';

    const timeMatch = timestamp.match(/(\d{2}):(\d{2}):(\d{2})/);
    if (timeMatch) {
        return `${timeMatch[1]}:${timeMatch[2]}`;
    }

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '--:--';
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

export const formatTimestamp = (timestamp: string | null): string => {
    if (!timestamp) return '--/--/---- --:--:--';

    const dateMatch = timestamp.match(/(\d{4})-(\d{2})-(\d{2})/);
    const timeMatch = timestamp.match(/(\d{2}):(\d{2}):(\d{2})/);

    if (dateMatch && timeMatch) {
        const day = dateMatch[3];
        const month = dateMatch[2];
        const year = dateMatch[1];
        const hours = timeMatch[1];
        const minutes = timeMatch[2];
        const seconds = timeMatch[3];
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '--/--/---- --:--:--';
    return date.toLocaleString('pt-BR');
};

export const parseTimestamp = (timestamp: string | null): Date | null => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? null : date;
};

export const getUTCHours = (timestamp: string | null): number => {
    if (!timestamp) return 0;
    const match = timestamp.match(/(\d{2}):(\d{2}):(\d{2})/);
    if (match) {
        return parseInt(match[1]);
    }
    return 0;
};

export const isValidTimestamp = (timestamp: string | null): boolean => {
    if (!timestamp) return false;
    const date = new Date(timestamp);
    return !isNaN(date.getTime());
};

export const getSecondsUntilTimestamp = (timestamp: string | null): number => {
    if (!timestamp) return 0;
    const date = parseTimestamp(timestamp);
    if (!date) return 0;
    return Math.floor((date.getTime() - Date.now()) / 1000);
};

export const formatSecondsToTime = (seconds: number): string => {
    if (seconds <= 0) return '00:00:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};
