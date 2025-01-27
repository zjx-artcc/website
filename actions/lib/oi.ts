'use server';

export const getOperatingInitials = async (firstName: string, lastName: string, otherInitials: string[]): Promise<string> => {
    let initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

    while (otherInitials.includes(initials)) {
        initials = generateRandomInitials(firstName, lastName);
    }

    return initials;
}

const generateRandomInitials = (firstName: string, lastName: string): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    // Randomly decide whether to keep first name initial or last name initial
    const keepFirst = Math.random() < 0.5;
    
    if (keepFirst) {
        // Keep first name initial, randomize last
        return `${firstName.charAt(0).toUpperCase()}${characters.charAt(Math.floor(Math.random() * characters.length))}`;
    } else {
        // Keep last name initial, randomize first
        return `${characters.charAt(Math.floor(Math.random() * characters.length))}${lastName.charAt(0).toUpperCase()}`;
    }
}