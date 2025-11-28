export interface MedicationHistory {
    id: string;
    medicationid: string;
    takendate: string;
    taken: boolean;
    createdat: string;
}

export interface MedicationHistoryResponse {
    history: MedicationHistory[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalRecords: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
