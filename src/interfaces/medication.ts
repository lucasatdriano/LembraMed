export interface Medication {
    id: string;
    name: string;
    hourfirstdose: string;
    hournextdose: string;
    periodstart: string | null;
    periodend: string | null;
    userid: string;
    doseintervalid: number;
    status: boolean;
    doseinterval: {
        intervalinhours: number;
    };
}
