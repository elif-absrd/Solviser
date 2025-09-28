import prisma from '../prisma';

export const createOrUpdateLegalProfile = async (userId: string, data: any) => {
    // --- THE FIX IS HERE ---
    // The form sends `serviceOfferings`, but the Prisma model expects `legalServiceOfferings`.
    // We rename it before processing.
    const { serviceOfferings: legalServiceOfferings, declaration1, 
        declaration2, 
        declaration3, 
        declaration4,
        esignAadhaar, // Discard
        esignOtp,     // Discard
        ...profileData } = data;

    // Sanitize and format data before saving
    if (profileData.companyAge) {
      profileData.companyAge = parseInt(profileData.companyAge, 10) || null;
    }
    if (profileData.registrationDate && profileData.registrationDate.length > 0) {
        profileData.registrationDate = new Date(profileData.registrationDate);
    } else {
        delete profileData.registrationDate;
    }

    if (declaration1 && declaration2 && declaration3 && declaration4) {
        profileData.agreedToTermsAt = new Date();
    } else {
        profileData.agreedToTermsAt = null; // Or handle as an error if all are required
    }

    return prisma.$transaction(async (tx) => {
        const profile = await tx.legalServiceProviderProfile.upsert({
            where: { userId },
            update: profileData,
            create: {
                ...profileData,
                userId,
            },
        });

        if (Array.isArray(legalServiceOfferings)) {
            await tx.legalServiceOffering.deleteMany({ where: { profileId: profile.id }});
            
            const validServices = legalServiceOfferings
                .filter(service => service.name && service.rate)
                .map(service => ({
                    name: service.name,
                    rate: parseFloat(service.rate),
                    billingCycle: service.billingCycle,
                    profileId: profile.id,
                }));
            
            if (validServices.length > 0) {
                await tx.legalServiceOffering.createMany({
                    data: validServices,
                });
            }
        }
        return profile;
    });
};