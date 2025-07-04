export const parseProductList = products => {
  return products.map(product => {
    try {
      const customFields = JSON.parse(product.fields || '[]');

      const extractField = name =>
        customFields.find(f => f.name === name)?.value || '';

      return {
        ...product,
        buildYear: extractField('yearofManufacture'),
        brand: extractField('make_Brand'),
        transmission: extractField('transmission'),
        fuelType: extractField('fuelType'),
        mileage: extractField('mileage'),
        model: extractField('model'),
        power: extractField('power'),
        condition: extractField('condition'),
        inspection: extractField('inspectionValidUntil'),
        color: extractField('color'),
        location: extractField('registrationCity'),
        area: (() => {
          const rawSize = extractField('size') || '';
          const numeric = rawSize.replace(/[^\d]/g, '');
          return numeric ? Number(numeric) : 0;
        })(),
        propertyType: extractField('propertyType'),
        heating_Cooling: extractField('heating_Cooling'),
        water_electricityAvailability: extractField(
          'water_electricityAvailability',
        ),
        petsAllowed: extractField('petsAllowed'),
        parking: extractField('parking'),
        furnished: extractField('furnished'),
        elevator: extractField('elevator'),
        balcony: extractField('balcony'),
        titleDeed_Document: extractField('titleDeed_Document'),
        nearbyLandmarks: extractField('nearbyLandmarks'),
        distancefroCityCenter_transport: extractField(
          'distancefroCityCenter_transport',
        ),
        floorNumber: extractField('floorNumber'),
        totalFloorsInBuilding: extractField('totalFloorsInBuilding'),
        purpose: extractField('purpose'),
        rooms: extractField('rooms'),
        bathrooms: extractField('bathrooms'),
        size: extractField('size'),
        serviceType: extractField('category_Industry'),
        jobLocation: extractField('jobLocation'),
        employmentType: extractField('employmentType'),
        experienceRequired: extractField('experienceRequired'),
        educationRequired: extractField('educationRequired'),
        genderPreference: extractField('genderPreference'),
        contactMethod: extractField('contactMethod'),
        salaryType: extractField('salaryType'),
        workTiming: extractField('workTiming'),
        requirements_Qualifications: extractField(
          'requirements_Qualifications',
        ),
        skills: extractField('skills'),
        contractDuration: extractField('contractDuration'),
      };
    } catch (e) {
      console.warn('Failed to parse custom fields:', e);
      return product;
    }
  });
};
