export interface Contact {
    id: string;
    name: string;
    numberphone: string;
}

export interface ContactsResponse {
    contacts: Contact[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalRecords: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
