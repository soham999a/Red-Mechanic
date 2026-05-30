export interface Part {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
}

export interface Shop {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  availableTechnicians: number;
  specializations: string[];
  certifications: string[];
  isOpen: boolean;
  phone: string;
  hours: string;
  inventory: Part[];
  distance: number;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  driverName: string;
  currentLocation: string;
  status: string;
}

export interface RepairRecord {
  id: string;
  date: string;
  vehicleId: string;
  truckMake: string;
  truckModel: string;
  faultCode: string;
  shopId: string;
  shopName: string;
  matchScore: number;
  status: 'Completed' | 'In Progress' | 'Pending';
  repairTime: string;
  partsUsed: string[];
  totalCost: number;
}

export const partNames = [
  'DEF Pump Assembly', 'DEF Filter Kit', 'SCR Sensor',
  'DEF Lines & Fittings', 'EGR Valve', 'Turbocharger',
  'Fuel Injector Set', 'DPF Filter', 'NOx Sensor',
  'MAP Sensor', 'IAT Sensor', 'Fuel Pressure Regulator',
  'Oil Pressure Sensor', 'Coolant Temp Sensor',
  'Brake Caliper Set', 'ABS Sensor', 'Alternator',
  'Starter Motor', 'Fan Clutch', 'Water Pump',
];

const shopNames = [
  'TruckPro Service Center', 'Reliable Diesel Fleet',
  'Lone Star Heavy Duty', 'Mechanix Express',
  'Apex Truck Repair', 'Elite Diesel Services',
  'Metro Truck Repair', 'Penske Fleet Operations',
  'Red Oak Heavy Transport', 'Pride Heavy Duty Repair',
];

const shopAddresses = [
  '2847 Industrial Blvd', '4521 Gateway Blvd', '8902 I-35 Service Rd',
  '1200 Commerce St', '6718 Freeport Dr', '3429 Railroad Ave',
  '8901 Distribution Ln', '2345 Logistics Pkwy', '7801 Warehouse Row',
  '5678 Transport Way',
];

const shopCities = [
  'Dallas', 'Fort Worth', 'Houston', 'San Antonio', 'Austin',
  'El Paso', 'Corpus Christi', 'Lubbock', 'Amarillo', 'Plano',
];

const phoneNumbers = [
  '(214) 555-0192', '(817) 555-0441', '(713) 555-0712',
  '(210) 555-0234', '(512) 555-0891', '(915) 555-0123',
  '(361) 555-0678', '(806) 555-0345', '(806) 555-0921',
  '(972) 555-0456',
];

const hours = [
  'Mon-Sat 6:00 AM - 10:00 PM', 'Mon-Fri 7:00 AM - 9:00 PM, Sat 8:00 AM - 6:00 PM',
  '24/7', 'Mon-Sat 6:30 AM - 9:30 PM', 'Mon-Fri 6:00 AM - 8:00 PM',
  '24/7', 'Mon-Sun 7:00 AM - 11:00 PM', 'Mon-Fri 7:30 AM - 7:00 PM',
  'Mon-Sat 7:00 AM - 8:00 PM', 'Mon-Fri 6:00 AM - 10:00 PM',
];

const specializationsList = [
  ['Class 8 Emissions', 'Paccar Engine Specialist', 'Hydraulic Diagnostics'],
  ['Detroit Diesel Expert', 'Cummins Engine', 'Transmission Rebuild'],
  ['Volvo/Mack Specialist', 'Emissions Systems', 'DEF Service'],
  ['Heavy Duty Brakes', 'Suspension Systems', 'Wheel Services'],
  ['Engine Overhaul', 'Turbo Systems', 'Fuel Systems'],
  ['Emissions Expert', 'Electrical Diagnostics', 'AC Services'],
  ['General Repair', 'Tire Services', 'Oil Changes'],
  ['Fleet Maintenance', 'Preventative Care', 'Mobile Repair'],
  ['Diesel Performance', 'Custom Fabrication', 'Engine Swap'],
  ['Transmission Expert', 'Differential Service', 'Drivetrain'],
];

const certificationsList = [
  ['ASE BLUE SEAL', 'VOLVO CERTIFIED', 'DEF ELITE'],
  ['ASE MASTER', 'CUMMINS CERTIFIED', 'FORD DIESEL'],
  ['ASE MASTER', 'VOLVO CERTIFIED', 'MACK CERTIFIED'],
  ['ASE BLUE SEAL', 'PACCAR CERTIFIED'],
  ['ASE MASTER', 'DETROIT DIESEL'],
  ['ASE CERTIFIED', 'DEF ELITE', 'PACCAR CERTIFIED'],
  ['ASE BLUE SEAL', 'VOLVO CERTIFIED'],
  ['ASE MASTER', 'FLEET CERTIFIED'],
  ['ASE CERTIFIED', 'CUMMINS CERTIFIED'],
  ['ASE MASTER', 'MACK CERTIFIED'],
];

const truckMakes = ['Volvo', 'Freightliner', 'Kenworth', 'Peterbilt', 'Mack', 'International'];
const truckModels: Record<string, string[]> = {
  Volvo: ['VNL 860', 'VNR 640', 'VHD 430'],
  Freightliner: ['Cascadia', 'M2 106', '122SD'],
  Kenworth: ['T680', 'T880', 'W900'],
  Peterbilt: ['579', '567', '389'],
  Mack: ['Anthem', 'Pinnacle', 'Granite'],
  International: ['LT Series', 'RH Series', 'HX Series'],
};

const drivers = [
  'Mike Chen', 'Sarah Johnson', 'Robert Davis', 'James Wilson', 'David Garcia',
  'Chris Anderson', 'Tom Martinez', 'Kevin Taylor', 'Brian Thomas', 'Jason White',
];

const locations = [
  'I-35 N Mile 142', 'I-45 S Mile 89', 'US-287 Mile 56',
  'SH-121 Mile 23', 'I-10 W Mile 412', 'I-20 E Mile 178',
  'US-75 N Mile 34', 'I-30 W Mile 67', 'SH-114 Mile 12',
  'I-35E Mile 98',
];

const faultCodes = ['P20EE', 'P0087', 'P0299', 'P0401', 'P0113', 'U0100', 'P0471', 'P2269', 'P0191', 'P0234'];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[rand(0, arr.length - 1)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

const shops: Shop[] = shopNames.map((name, i) => ({
  id: `shop-${i + 1}`,
  name,
  address: shopAddresses[i],
  city: shopCities[i],
  state: 'TX',
  lat: 32.7767 + (Math.random() - 0.5) * 5,
  lng: -96.7970 + (Math.random() - 0.5) * 5,
  rating: +(4.1 + Math.random() * 0.8).toFixed(1),
  reviewCount: rand(40, 300),
  availableTechnicians: rand(1, 5),
  specializations: specializationsList[i],
  certifications: certificationsList[i],
  isOpen: true,
  phone: phoneNumbers[i],
  hours: hours[i],
  inventory: partNames.map((p, idx) => ({
    id: `part-${i}-${idx}`,
    name: p,
    sku: `SKU-${String(i + 1).padStart(3, '0')}-${String(idx + 1).padStart(3, '0')}`,
    quantity: Math.random() > 0.25 ? rand(1, 20) : 0,
    price: rand(45, 2500),
  })),
  distance: rand(5, 65),
}));

const vehicles: Vehicle[] = Array.from({ length: 10 }, (_, i) => {
  const make = pick(truckMakes);
  return {
    id: `v-${i + 1}`,
    make,
    model: pick(truckModels[make]),
    year: rand(2018, 2024),
    vin: `${String.fromCharCode(65 + i)}${String.fromCharCode(72 + i)}${rand(100000, 999999)}`,
    driverName: drivers[i],
    currentLocation: locations[i],
    status: pick(['Active', 'Active', 'Active', 'In Service', 'Idle']),
  };
});

const repairHistory: RepairRecord[] = Array.from({ length: 50 }, (_, i) => {
  const shop = pick(shops);
  const vehicle = pick(vehicles);
  const statuses: RepairRecord['status'][] = ['Completed', 'Completed', 'Completed', 'In Progress', 'Pending'];
  return {
    id: `RIN-${String(2024001 + i)}`,
    date: new Date(2024, rand(0, 11), rand(1, 28)).toISOString().split('T')[0],
    vehicleId: vehicle.id,
    truckMake: vehicle.make,
    truckModel: vehicle.model,
    faultCode: pick(faultCodes),
    shopId: shop.id,
    shopName: shop.name,
    matchScore: rand(70, 100),
    status: pick(statuses),
    repairTime: `${rand(1, 8)}h ${rand(0, 59)}m`,
    partsUsed: pickN(partNames, rand(1, 5)),
    totalCost: rand(400, 3500),
  };
});

export const commonFaultCodes = [
  { code: 'P20EE', description: 'Reductant Pump', severity: 'HIGH' as const },
  { code: 'P0087', description: 'Fuel Pressure Low', severity: 'HIGH' as const },
  { code: 'P0299', description: 'Turbo Underboost', severity: 'MEDIUM' as const },
  { code: 'P0401', description: 'EGR Flow Insufficient', severity: 'MEDIUM' as const },
  { code: 'P0113', description: 'IAT Sensor High', severity: 'LOW' as const },
];

export const faultCategories = ['Engine', 'Transmission', 'Electrical', 'Emissions', 'Brakes'];
export const symptomsList = [
  'Power Loss', 'White Smoke', 'Rough Idle', 'Overheating',
  'Check Engine Light', 'Strange Noise', 'Reduced Power Mode',
  'Hard Starting', 'Excessive Idling',
];

export const mockDiagnosisResult = {
  rootCause: 'Reductant Injection Pump failure due to DEF crystallization. Internal blockage detected in the pump assembly causing insufficient reductant delivery to the SCR system.',
  confidence: 94,
  severity: 'HIGH' as const,
  repairType: 'Component Replacement',
  estimatedLaborHours: '3-4',
  requiredParts: ['DEF Pump Assembly', 'DEF Filter Kit', 'SCR Sensor', 'DEF Lines & Fittings'],
  repairRecommendation: 'Replace DEF pump assembly and flush entire DEF system. Test SCR efficiency post-repair.',
  estimatedPartsCost: '$680 - $920',
  estimatedLaborCost: '$280 - $420',
  estimatedTotalCost: '$960 - $1,340',
  additionalNotes: 'Check DEF quality — contaminated fluid accelerates pump wear.',
};

export interface Technician {
  id: string;
  name: string;
  initials: string;
  specialization: string;
  available: boolean;
  experience: number;
}

export const technicians: Technician[] = [
  { id: 'tech-1', name: 'Marcus Vance', initials: 'MV', specialization: 'Senior Emissions Specialist', available: true, experience: 12 },
  { id: 'tech-2', name: 'Sarah Mendez', initials: 'SM', specialization: 'Diesel Engine Master', available: true, experience: 8 },
  { id: 'tech-3', name: 'David Chen', initials: 'DC', specialization: 'Diagnostic Electrical Tech', available: false, experience: 15 },
  { id: 'tech-4', name: 'James Rodriguez', initials: 'JR', specialization: 'Transmission Specialist', available: true, experience: 10 },
];

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  shopId: string;
}

const reviews: Review[] = [];
const reviewAuthors = ['Tom B.', 'Jerry K.', 'Alice M.', 'Bob S.', 'Diana P.', 'Carlos R.', 'Emma W.', 'Frank L.'];
const reviewComments = [
  'Excellent service, fixed our Cascadia quickly. Highly recommend!',
  'Great diagnostic work. Found the issue other shops missed.',
  'Fair pricing and fast turnaround. Will use again.',
  'Professional team, really know their Volvo trucks.',
  'Had a DEF issue, they sorted it in hours. Amazing.',
  'Bit pricey but the quality of work is top notch.',
  'Very knowledgeable about emissions systems. Saved us thousands.',
  'Quick response time. Got our truck back on the road same day.',
];
shops.forEach(shop => {
  const count = 3 + Math.floor(Math.random() * 4);
  for (let i = 0; i < count; i++) {
    reviews.push({
      id: `rev-${shop.id}-${i}`,
      author: reviewAuthors[Math.floor(Math.random() * reviewAuthors.length)],
      rating: +(4 + Math.random() * 1).toFixed(1),
      comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      shopId: shop.id,
    });
  }
});

export interface DiagnosisResult {
  rootCause: string;
  confidence: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  repairType: string;
  estimatedLaborHours: string;
  requiredParts: string[];
  repairRecommendation: string;
  estimatedPartsCost: string;
  estimatedLaborCost: string;
  estimatedTotalCost: string;
  additionalNotes: string;
}

export { shops, vehicles, repairHistory, reviews };
