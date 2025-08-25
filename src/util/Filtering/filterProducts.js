const includesAnyLetter = (productField, filterValue) => {
  if (!filterValue) return true;
  const field = (productField || '').toLowerCase();
  const chars = filterValue.toLowerCase().split('');
  return chars.some(char => field.includes(char));
};

// export const filterVehicleProducts = (product, filters) => {
//   const price = Number(product.price);
//   const buildYear = Number(product.buildYear);
//   const mileage = Number(product.mileage);

//   return (
//     (!filters.minPrice || price >= Number(filters.minPrice)) &&
//     (!filters.maxPrice || price <= Number(filters.maxPrice)) &&
//     (!filters.brand || product.brand?.toLowerCase().startsWith(filters.brand.toLowerCase())) &&
//     (!filters.model || product.model?.toLowerCase().includes(filters.model.toLowerCase())) &&
//     (!filters.buildYearMin || buildYear >= Number(filters.buildYearMin)) &&
//     (!filters.buildYearMax || buildYear <= Number(filters.buildYearMax)) &&
//     (!filters.minMileage || mileage >= Number(filters.minMileage)) &&
//     (!filters.maxMileage || mileage <= Number(filters.maxMileage)) &&
//     (!filters.transmission || product.transmission?.toLowerCase() === filters.transmission.toLowerCase()) &&
//     (!filters.fuelType || product.fuelType?.toLowerCase() === filters.fuelType.toLowerCase()) &&
//     (!filters.condition || product.condition?.toLowerCase() === filters.condition.toLowerCase()) &&
//     (!filters.inspection || product.inspection?.includes(filters.inspection)) &&
//     (!filters.color || product.color?.toLowerCase().includes(filters.color.toLowerCase())) &&
//     (!filters.power || product.power?.toString().includes(filters.power.toString()))
//   );
// };

const normalize = str => (str || '').replace(/\s+/g, '').toLowerCase();

export const filterVehicleProducts = (product, filters, isArabic) => {
  // Move useTranslation inside the function
  const normalize = str =>
    typeof str === 'string' ? str.trim().toLowerCase() : '';

  const normalizeNum = val => {
    if (typeof val === 'number') return val;
    const num = (val || '').toString().match(/\d+/); // extract first number
    return num ? Number(num[0]) : 0;
  };

  const includesNormalized = (field, filterVal) =>
    normalize(field || '').includes(normalize(filterVal || ''));

  const looselyMatchesNumber = (text, number) => {
    const num = normalizeNum(text);
    return num === normalizeNum(number);
  };

  // Step 1: Parse fields if necessary
  const customFields = Array.isArray(product.custom_fields)
    ? product.custom_fields
    : JSON.parse(product.custom_fields || '[]');

  product?.id === '37ada34d-abd5-402d-a370-ca77af75689f' &&
    console.log('Custom fields:', customFields);

  // Step 2: Flatten custom fields into an object
  const customFieldMap = {};
  for (const item of customFields) {
    if (item.name && item.value !== undefined) {
      customFieldMap[item.name] = isArabic ? item.ar_value : item.value;
    }
  }

  product?.id === '37ada34d-abd5-402d-a370-ca77af75689f' &&
    console.log('Custom field map:', customFieldMap);

  // Step 3: Build normalized product
  const normalizedProduct = {
    ...product,
    ...customFieldMap,
    make_brand: product.make_brand || customFieldMap.make_brand,
    model: product.model || customFieldMap.model,
    buildYear: product.buildYear || customFieldMap.year_of_manufacture,
    mileage: product.mileage || customFieldMap.mileage,
    transmission: product.transmission || customFieldMap.transmission,
    fuelType: product.fuelType || customFieldMap.fuelType,
    condition: product.condition || customFieldMap.condition,
    inspection: customFieldMap.inspectionValidUntil,
    power: product.power || customFieldMap.power,
    color: product.color || customFieldMap.color,
    price: product.price,
  };

  const price = normalizeNum(normalizedProduct.price);
  const buildYear = normalizeNum(normalizedProduct.buildYear);
  const mileage = normalizeNum(normalizedProduct.mileage);
  const power = normalizeNum(normalizedProduct.power);

  return (
    (!filters.minPrice || price >= normalizeNum(filters.minPrice)) &&
    (!filters.maxPrice || price <= normalizeNum(filters.maxPrice)) &&
    (!filters.make_brand?.length ||
      filters.make_brand.some(selectedBrand => {
        product?.id === '37ada34d-abd5-402d-a370-ca77af75689f' &&
          console.log('Selected brand:', selectedBrand);
        product?.id === '37ada34d-abd5-402d-a370-ca77af75689f' &&
          console.log('Normalized product:', normalizedProduct);
        product?.id === '37ada34d-abd5-402d-a370-ca77af75689f' &&
          console.log(
            'Normalized product make_brand:',
            normalizedProduct.make_brand,
          );

        return includesNormalized(normalizedProduct.make_brand, selectedBrand);
      })) &&
    (!filters.model ||
      includesNormalized(normalizedProduct.model, filters.model)) &&
    (!filters.buildYearMin ||
      buildYear >= normalizeNum(filters.buildYearMin)) &&
    (!filters.buildYearMax ||
      buildYear <= normalizeNum(filters.buildYearMax)) &&
    (!filters.minMileage || mileage >= normalizeNum(filters.minMileage)) &&
    (!filters.maxMileage || mileage <= normalizeNum(filters.maxMileage)) &&
    (!filters.transmission ||
      includesNormalized(
        normalizedProduct.transmission,
        filters.transmission,
      )) &&
    (!filters.fuelType ||
      includesNormalized(normalizedProduct.fuelType, filters.fuelType)) &&
    (!filters.condition ||
      includesNormalized(normalizedProduct.condition, filters.condition)) &&
    (!filters.inspection ||
      includesNormalized(normalizedProduct.inspection, filters.inspection)) &&
    (!filters.color ||
      includesNormalized(normalizedProduct.color, filters.color)) &&
    (!filters.power ||
      looselyMatchesNumber(normalizedProduct.power, filters.power))
  );
};

export const filterPropertyProducts = (product, filters, isArabic) => {
  const normalize = str =>
    typeof str === 'string' ? str.trim().toLowerCase() : '';

  const normalizeBool = val => {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'string') {
      const cleaned = val.trim().toLowerCase();
      return cleaned === 'yes' || cleaned === 'true';
    }
    return false;
  };

  const normalizeNum = val =>
    typeof val === 'number'
      ? val
      : Number((val || '').toString().replace(/[^\d.]/g, '') || 0);

  const includesNormalized = (field, filterVal) =>
    normalize(field || '').includes(normalize(filterVal || ''));

  const equalsNormalized = (field, filterVal) =>
    normalize(field || '') === normalize(filterVal || '');

  const looselyMatchesNumber = (textField, filterNumber) => {
    const normalizedText = normalize(textField);
    const regex = new RegExp(`\\b${filterNumber}\\b`); // match whole word (e.g. "4" in "4 rooms")
    return (
      regex.test(normalizedText) ||
      normalizedText.includes(filterNumber.toString())
    );
  };

  let customFields = Array.isArray(product.custom_fields)
    ? product.custom_fields
    : JSON.parse(product.custom_fields || '[]');

  const customFieldMap = {};
  for (const item of customFields) {
    if (item.name) {
      customFieldMap[item.name] = isArabic ? item.ar_value : item.value;
    }
  }

  console.log('Custom field map:', customFieldMap);

  const normalizedProduct = {
    ...product,
    ...customFieldMap,
    pets_allowed: normalizeBool(customFieldMap.pets_allowed),
    parking: normalizeBool(customFieldMap.parking),
    furnished: normalizeBool(customFieldMap.furnished),
    elevator: normalizeBool(customFieldMap.elevator),
    balcony_terrace: normalizeBool(customFieldMap.balcony_terrace),
    ownership_document: normalizeBool(customFieldMap.ownership_document),
    rooms: customFieldMap.rooms,
    bathrooms: customFieldMap.bathrooms,
    floor_number: customFieldMap.floor_number,
    total_floors: customFieldMap.total_floors,
    size: normalizeNum(customFieldMap.size),
    price: normalizeNum(product.price),
  };

  console.log('Normalized product:', normalizedProduct);

  return (
    (!filters.minPrice ||
      normalizedProduct.price >= normalizeNum(filters.minPrice)) &&
    (!filters.maxPrice ||
      normalizedProduct.price <= normalizeNum(filters.maxPrice)) &&
    (!filters.property_type ||
      includesNormalized(
        normalizedProduct.property_type,
        filters.property_type,
      )) &&
    (!filters.purpose ||
      equalsNormalized(normalizedProduct.purpose, filters.purpose)) &&
    (!filters.size ||
      includesNormalized(normalizedProduct.size, filters.size)) &&
    (!filters.minArea ||
      normalizedProduct.size >= normalizeNum(filters.minArea)) &&
    (!filters.maxArea ||
      normalizedProduct.size <= normalizeNum(filters.maxArea)) &&
    (!filters.rooms ||
      looselyMatchesNumber(
        normalizedProduct.rooms,
        normalizeNum(filters.rooms),
      )) &&
    (!filters.bathrooms ||
      looselyMatchesNumber(
        normalizedProduct.bathrooms,
        normalizeNum(filters.bathrooms),
      )) &&
    (!filters.floor_number ||
      looselyMatchesNumber(
        normalizedProduct.floor_number,
        normalizeNum(filters.floor_number),
      )) &&
    (!filters.total_floors ||
      looselyMatchesNumber(
        normalizedProduct.total_floors,
        normalizeNum(filters.total_floors),
      )) &&
    (!filters.heating_Cooling ||
      equalsNormalized(
        normalizedProduct.heating_Cooling,
        filters.heating_Cooling,
      )) &&
    (!filters.utilities ||
      equalsNormalized(normalizedProduct.utilities, filters.utilities)) &&
    (filters.pets_allowed === undefined ||
      normalizedProduct.pets_allowed === filters.pets_allowed) &&
    (filters.parking === undefined ||
      normalizedProduct.parking === filters.parking) &&
    (filters.furnished === undefined ||
      normalizedProduct.furnished === filters.furnished) &&
    (filters.elevator === undefined ||
      normalizedProduct.elevator === filters.elevator) &&
    (filters.balcony_terrace === undefined ||
      normalizedProduct.balcony_terrace === filters.balcony_terrace) &&
    (filters.ownership_document === undefined ||
      normalizedProduct.ownership_document === filters.ownership_document) &&
    (!filters.nearby_landmarks ||
      includesNormalized(
        normalizedProduct.nearby_landmarks,
        filters.nearby_landmarks,
      )) &&
    (!filters.distance_from_city_center ||
      includesNormalized(
        normalizedProduct.distance_from_city_center,
        filters.distance_from_city_center,
      ))
  );
};

const includesIgnoreCase = (target = '', search = '') =>
  target.toLowerCase().includes(search.toLowerCase());
const getCustomField = (product, fieldName) => {
  const fieldArray = Array.isArray(product.custom_fields)
    ? product.custom_fields
    : JSON.parse(product.fielcustom_fieldsds || '[]');

  const found = fieldArray.find(f => f.name === fieldName);
  return found?.value || '';
};

export const filterServiceProducts = (product, filters) => {
  const price = Number(product.price);

  const get = field => getCustomField(product, field);

  return (
    (!filters.minPrice || price >= Number(filters.minPrice)) &&
    (!filters.maxPrice || price <= Number(filters.maxPrice)) &&
    (!filters.serviceType ||
      includesIgnoreCase(product.serviceType, filters.serviceType)) &&
    (!filters.location ||
      includesIgnoreCase(product.location, filters.location)) &&
    (!filters.employmentType ||
      get('employmentType').toLowerCase() ===
        filters.employmentType.toLowerCase()) &&
    (!filters.educationRequired ||
      includesIgnoreCase(
        get('educationRequired'),
        filters.educationRequired,
      )) &&
    (!filters.experienceRequired ||
      includesIgnoreCase(
        get('experienceRequired'),
        filters.experienceRequired,
      )) &&
    (!filters.genderPreference ||
      get('genderPreference').toLowerCase() ===
        filters.genderPreference.toLowerCase()) &&
    (!filters.contactMethod ||
      get('contactMethod').toLowerCase() ===
        filters.contactMethod.toLowerCase()) &&
    (!filters.salaryType ||
      get('salaryType').toLowerCase() === filters.salaryType.toLowerCase()) &&
    (!filters.requirements_Qualifications ||
      includesIgnoreCase(
        get('requirements_Qualifications'),
        filters.requirements_Qualifications,
      )) &&
    (!filters.skills || includesIgnoreCase(get('skills'), filters.skills)) &&
    (!filters.workTiming ||
      includesIgnoreCase(get('workTiming'), filters.workTiming)) &&
    (!filters.contractDuration ||
      includesIgnoreCase(get('contractDuration'), filters.contractDuration)) &&
    (!filters.benefits ||
      includesIgnoreCase(get('benefits'), filters.benefits)) &&
    (!filters.numberofVacancies ||
      includesIgnoreCase(
        get('numberofVacancies'),
        filters.numberofVacancies,
      )) &&
    (!filters.applicationDeadline ||
      includesIgnoreCase(
        get('applicationDeadline'),
        filters.applicationDeadline,
      )) &&
    (!filters.jobLocation ||
      includesIgnoreCase(get('jobLocation'), filters.jobLocation))
  );
};
