import prisma from '../prisma';

export const getProviders = async (filters: { city?: string; search?: string }, page: number, pageSize: number) => {
    const whereClause: any = {
        // status: 'APPROVED', // Only show approved providers
    };

    if (filters.city && filters.city !== 'All') {
        whereClause.city = filters.city;
    }

    if (filters.search) {
        const searchQuery = filters.search.toLowerCase();
        whereClause.OR = [
            { firmName: { contains: searchQuery, mode: 'insensitive' } },
            { address: { contains: searchQuery, mode: 'insensitive' } },
            { city: { contains: searchQuery, mode: 'insensitive' } },
            { legalServiceOfferings: { some: { name: { contains: searchQuery, mode: 'insensitive' } } } },
        ];
    }

    const providers = await prisma.legalServiceProviderProfile.findMany({
        where: whereClause,
        // --- THIS SELECT BLOCK IS NOW CORRECT ---
        select: {
            firmName: true,
            city: true,
            address: true,
            email: true,
            contactNumber: true,
            serviceCategories: true, // Select the whole array
            legalServiceOfferings: { 
                take: 3, 
                select: { name: true } 
            },
            user: { 
                select: { 
                    id: true, 
                    name: true 
                } 
            },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { updatedAt: 'desc' },
    });

    const totalCount = await prisma.legalServiceProviderProfile.count({ where: whereClause });

    // Format the data to match the frontend's expected structure
    const formattedProviders = providers.map(p => ({
        id: p.user.id, // Use user ID for unique avatar
        name: p.firmName || p.user.name,
        type: p.serviceCategories[0] || 'Legal Services', // Get the first category
        rating: 4.5, // You can add a rating field later
        city: p.city,
        address: p.address,
        phone: p.contactNumber,
        email: p.email,
        services: p.legalServiceOfferings.map(s => s.name),
    }));

    return { providers: formattedProviders, totalCount };
};