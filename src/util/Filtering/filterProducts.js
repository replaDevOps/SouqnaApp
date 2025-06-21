// utils/filterUtils.js

export const filterVehicleProducts = (product, filters) => {
  const price = Number(product.price);
  const buildYear = Number(product.buildYear);
  const mileage = Number(product.mileage);

  return (
    (!filters.minPrice || price >= Number(filters.minPrice)) &&
    (!filters.maxPrice || price <= Number(filters.maxPrice)) &&
    (!filters.brand || product.brand?.toLowerCase().startsWith(filters.brand.toLowerCase())) &&
    (!filters.model || product.model?.toLowerCase().includes(filters.model.toLowerCase())) &&
    (!filters.buildYearMin || buildYear >= Number(filters.buildYearMin)) &&
    (!filters.buildYearMax || buildYear <= Number(filters.buildYearMax)) &&
    (!filters.minMileage || mileage >= Number(filters.minMileage)) &&
    (!filters.maxMileage || mileage <= Number(filters.maxMileage)) &&
    (!filters.transmission || product.transmission?.toLowerCase() === filters.transmission.toLowerCase()) &&
    (!filters.fuelType || product.fuelType?.toLowerCase() === filters.fuelType.toLowerCase()) &&
    (!filters.condition || product.condition?.toLowerCase() === filters.condition.toLowerCase()) &&
    (!filters.inspection || product.inspection?.includes(filters.inspection)) &&
    (!filters.color || product.color?.toLowerCase().includes(filters.color.toLowerCase())) &&
    (!filters.power || product.power?.toString().includes(filters.power.toString()))
  );
};

const normalize = str => (str || '').replace(/\s+/g, '').toLowerCase();

export const filterPropertyProducts = (product, filters) => {
  const price = Number(product.price);
  return (
    (!filters.minPrice || price >= Number(filters.minPrice)) &&
    (!filters.maxPrice || price <= Number(filters.maxPrice)) &&
    (!filters.propertyType || product.propertyType?.toLowerCase().includes(filters.propertyType.toLowerCase())) &&
    (!filters.minArea || product.area >= Number(filters.minArea)) &&
    (!filters.maxArea || product.area <= Number(filters.maxArea)) &&
    (!filters.purpose || product.purpose?.toLowerCase() === filters.purpose.toLowerCase()) &&
    (!filters.size || normalize(product.size).includes(normalize(filters.size))) &&
    (!filters.rooms || product.rooms === filters.rooms) &&
    (!filters.bathrooms || product.bathrooms === filters.bathrooms) &&
    (!filters.floorNumber || product.floorNumber === filters.floorNumber) &&
    (!filters.totalFloorsInBuilding || product.totalFloorsInBuilding === filters.totalFloorsInBuilding) &&
    (!filters.heating_Cooling || product.heating_Cooling === filters.heating_Cooling) &&
    (!filters.water_electricityAvailability || product.water_electricityAvailability === filters.water_electricityAvailability) &&
    (!filters.petsAllowed || product.petsAllowed === filters.petsAllowed) &&
    (!filters.parking || product.parking === filters.parking) &&
    (!filters.furnished || product.furnished === filters.furnished) &&
    (!filters.elevator || product.elevator === filters.elevator) &&
    (!filters.balcony || product.balcony === filters.balcony) &&
    (!filters.titleDeed_Document || product.titleDeed_Document === filters.titleDeed_Document) &&
    (!filters.nearbyLandmarks || product.nearbyLandmarks?.toLowerCase().includes(filters.nearbyLandmarks.toLowerCase())) &&
    (!filters.distancefroCityCenter_transport || product.distancefroCityCenter_transport?.toLowerCase().includes(filters.distancefroCityCenter_transport.toLowerCase()))
  );
};

export const filterServiceProducts = (product, filters) => {
  const price = Number(product.price);

  return (
    (!filters.minPrice || price >= Number(filters.minPrice)) &&
    (!filters.maxPrice || price <= Number(filters.maxPrice)) &&
    (!filters.serviceType || product.serviceType?.toLowerCase().includes(filters.serviceType.toLowerCase())) &&
    (!filters.location || product.location?.toLowerCase().includes(filters.location.toLowerCase())) &&
    (!filters.employmentType || product.employmentType?.toLowerCase() === filters.employmentType.toLowerCase()) &&
    (!filters.educationRequired || product.educationRequired?.toLowerCase() === filters.educationRequired.toLowerCase()) &&
    (!filters.experienceRequired || product.experienceRequired?.toLowerCase() === filters.experienceRequired.toLowerCase()) &&
    (!filters.genderPreference || product.genderPreference?.toLowerCase() === filters.genderPreference.toLowerCase()) &&
    (!filters.contactMethod || product.contactMethod?.toLowerCase() === filters.contactMethod.toLowerCase()) &&
    (!filters.salaryType || product.salaryType?.toLowerCase() === filters.salaryType.toLowerCase())
  );
};

