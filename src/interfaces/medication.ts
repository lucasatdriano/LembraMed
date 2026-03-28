import { MedicationHistory } from './medicationHistory';

export interface Medication {
    id: string;
    name: string;
    hourfirstdose: string;
    hournextdose: string | null;
    periodstart: string | null;
    periodend: string | null;
    status: boolean;
    pendingconfirmation: boolean;
    pendinguntil: Date | null;
    createdat: string;
    doseintervalid: number;
    intervalinhours: number;
    doseinterval: {
        intervalinhours: number;
    };
    history?: MedicationHistory[];
}

export interface MedicationsResponse {
    medications: Medication[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalRecords: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
