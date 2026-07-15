import { Medication } from '@/interfaces/medication';
import Formatters from '@/utils/formatters';

const EARLY_TAKE_MINUTES = 15;
const MIN_TOLERANCE_MINUTES = 30;

export function getNextDoseDate(medication: Medication): Date | null {
    let nextDose = Formatters.parseTimestamp(medication.hournextdose);

    if (!nextDose) {
        return null;
    }

    const now = new Date();

    if (nextDose < now) {
        const intervalHours = medication.doseinterval?.intervalinhours ?? 0;

        if (intervalHours > 0) {
            const intervalMs = intervalHours * 60 * 60 * 1000;
            const diffMs = now.getTime() - nextDose.getTime();
            const cycles = Math.ceil(diffMs / intervalMs);

            nextDose = new Date(nextDose.getTime() + cycles * intervalMs);
        }
    }

    return nextDose;
}

export function canTakeMedication(medication: Medication): boolean {
    if (!medication.hournextdose || medication.pendingconfirmation) {
        return false;
    }

    const nextDose = Formatters.parseTimestamp(medication.hournextdose);

    if (!nextDose) {
        return false;
    }

    const now = new Date();

    const intervalHours = medication.doseinterval?.intervalinhours ?? 0;

    const toleranceAfterMinutes = Math.max(
        intervalHours * 60 * 0.25,
        MIN_TOLERANCE_MINUTES,
    );

    const earliestTime = nextDose.getTime() - EARLY_TAKE_MINUTES * 60 * 1000;

    const latestTime = nextDose.getTime() + toleranceAfterMinutes * 60 * 1000;

    const result = now.getTime() >= earliestTime && now.getTime() <= latestTime;

    return result;
}

export function getCountdownColor(countdown: string): string {
    if (!countdown) {
        return 'text-blue-600';
    }

    const [hours = 0] = countdown.split(':').map(Number);

    return hours < 1 ? 'text-orange-600' : 'text-blue-600';
}

export function isMedicationFinished(medication: Medication): boolean {
    return !medication?.hournextdose;
}

export function hasPendingConfirmation(medication: Medication): boolean {
    return medication?.pendingconfirmation || false;
}
