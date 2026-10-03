require('dotenv').config()
const { sql } = require('./db')

const FRESH_PRODUCTS = [
  // Dairy & Chilled
  { id: 'PRD-FR-001', name: 'Fresh Farm Whole Milk (1L Bottle)', temp: 'reefer', weight: 1.05, volume: 0.0015, unit: 'Bottle' },
  { id: 'PRD-FR-002', name: 'Pasteurized Full Cream Milk (24x1L Case)', temp: 'reefer', weight: 25.50, volume: 0.0380, unit: 'Case' },
  { id: 'PRD-FR-003', name: 'Natural Set Buffalo Curd (1kg Clay Pot)', temp: 'reefer', weight: 1.25, volume: 0.0022, unit: 'Pot' },
  { id: 'PRD-FR-004', name: 'Greek Style Plain Yogurt (500g Tub)', temp: 'reefer', weight: 0.55, volume: 0.0008, unit: 'Tub' },
  { id: 'PRD-FR-005', name: 'Sweetened Vanilla Yogurt (12x100g Pack)', temp: 'reefer', weight: 1.35, volume: 0.0025, unit: 'Pack' },
  { id: 'PRD-FR-006', name: 'Salted Dairy Butter Block (250g)', temp: 'reefer', weight: 0.28, volume: 0.0004, unit: 'Block' },
  { id: 'PRD-FR-007', name: 'Unsalted Artisan Pastry Butter (1kg)', temp: 'reefer', weight: 1.08, volume: 0.0016, unit: 'Block' },
  { id: 'PRD-FR-008', name: 'Aged Cheddar Cheese Wedge (200g)', temp: 'reefer', weight: 0.22, volume: 0.0003, unit: 'Pack' },
  { id: 'PRD-FR-009', name: 'Fresh Mozzarella Log (1kg Cryovac)', temp: 'reefer', weight: 1.10, volume: 0.0018, unit: 'Pack' },
  { id: 'PRD-FR-010', name: 'Heavy Whipping Cream 35% (1L Tetra)', temp: 'reefer', weight: 1.04, volume: 0.0014, unit: 'Carton' },
  { id: 'PRD-FR-011', name: 'Cottage Cheese Low-Fat (400g Tub)', temp: 'reefer', weight: 0.44, volume: 0.0007, unit: 'Tub' },
  { id: 'PRD-FR-012', name: 'Farm Fresh Brown Eggs (30-Egg Tray Crate)', temp: 'ambient', weight: 2.10, volume: 0.0065, unit: 'Crate' },
  { id: 'PRD-FR-013', name: 'Free-Range Organic Eggs (10-Pack Carton)', temp: 'ambient', weight: 0.72, volume: 0.0022, unit: 'Carton' },
  
  // Poultry, Meat & Seafood
  { id: 'PRD-FR-014', name: 'Skinless Chicken Breast Fillets (1kg Tray)', temp: 'reefer', weight: 1.08, volume: 0.0020, unit: 'Tray' },
  { id: 'PRD-FR-015', name: 'Whole Broiler Chicken Chilled (1.5kg Avg)', temp: 'reefer', weight: 1.55, volume: 0.0035, unit: 'Pack' },
  { id: 'PRD-FR-016', name: 'Chicken Drumsticks Bulk Crate (10kg)', temp: 'reefer', weight: 10.80, volume: 0.0180, unit: 'Crate' },
  { id: 'PRD-FR-017', name: 'Lean Minced Beef Vacuum Pack (1kg)', temp: 'reefer', weight: 1.06, volume: 0.0018, unit: 'Pack' },
  { id: 'PRD-FR-018', name: 'Prime Beef Tenderloin Chilled (2kg)', temp: 'reefer', weight: 2.15, volume: 0.0038, unit: 'Vacuum Pack' },
  { id: 'PRD-FR-019', name: 'Pork Chops Bone-in (1kg Tray)', temp: 'reefer', weight: 1.07, volume: 0.0021, unit: 'Tray' },
  { id: 'PRD-FR-020', name: 'Mutton Curry Cut Frozen (1kg Box)', temp: 'reefer', weight: 1.10, volume: 0.0022, unit: 'Box' },
  { id: 'PRD-FR-021', name: 'Ocean Catch Yellowfin Tuna Loins (1kg)', temp: 'reefer', weight: 1.12, volume: 0.0020, unit: 'Vacuum Pack' },
  { id: 'PRD-FR-022', name: 'Freshwater Jumbo Prawns Cleaned (800g)', temp: 'reefer', weight: 0.90, volume: 0.0019, unit: 'Tray' },
  { id: 'PRD-FR-023', name: 'Atlantic Salmon Fillet Portion (500g)', temp: 'reefer', weight: 0.55, volume: 0.0012, unit: 'Pack' },

  // Farm Fresh Produce (Highland & Lowland)
  { id: 'PRD-FR-024', name: 'Nuwara Eliya Grade-A Carrots (5kg Sack)', temp: 'ambient', weight: 5.10, volume: 0.0095, unit: 'Sack' },
  { id: 'PRD-FR-025', name: 'Washed Crisp Leeks (5kg Bundle Crate)', temp: 'ambient', weight: 5.20, volume: 0.0120, unit: 'Crate' },
  { id: 'PRD-FR-026', name: 'Jaffna Red Potatoes (10kg Jute Bag)', temp: 'ambient', weight: 10.20, volume: 0.0165, unit: 'Bag' },
  { id: 'PRD-FR-027', name: 'Selected Red Shallot Onions (5kg Net)', temp: 'ambient', weight: 5.08, volume: 0.0080, unit: 'Net Bag' },
  { id: 'PRD-FR-028', name: 'Imported White Garlic Bulbs (5kg Box)', temp: 'ambient', weight: 5.15, volume: 0.0090, unit: 'Box' },
  { id: 'PRD-FR-029', name: 'Spicy Green Finger Chilies (2kg Crate)', temp: 'ambient', weight: 2.10, volume: 0.0055, unit: 'Crate' },
  { id: 'PRD-FR-030', name: 'Greenhouse Vine Tomatoes (5kg Crates)', temp: 'ambient', weight: 5.25, volume: 0.0110, unit: 'Crate' },
  { id: 'PRD-FR-031', name: 'Fresh Green Broccoli Crowns (3kg Box)', temp: 'reefer', weight: 3.20, volume: 0.0085, unit: 'Box' },
  { id: 'PRD-FR-032', name: 'Organic Baby Spinach Leaves (500g Bag)', temp: 'reefer', weight: 0.52, volume: 0.0028, unit: 'Bag' },
  { id: 'PRD-FR-033', name: 'Tricolor Bell Peppers (3kg Carton)', temp: 'ambient', weight: 3.15, volume: 0.0075, unit: 'Carton' },
  { id: 'PRD-FR-034', name: 'Crisp Iceberg Lettuce (6-Head Box)', temp: 'reefer', weight: 2.80, volume: 0.0092, unit: 'Box' },
  { id: 'PRD-FR-035', name: 'English Salad Cucumbers (5kg Crate)', temp: 'ambient', weight: 5.10, volume: 0.0105, unit: 'Crate' },

  // Tropical & Orchard Fruits
  { id: 'PRD-FR-036', name: 'Embul Cavendish Bananas (12kg Master Crate)', temp: 'ambient', weight: 12.50, volume: 0.0260, unit: 'Crate' },
  { id: 'PRD-FR-037', name: 'Red Lady Sweet Papaya (10kg Carton)', temp: 'ambient', weight: 10.40, volume: 0.0220, unit: 'Carton' },
  { id: 'PRD-FR-038', name: 'Karthakolomban Ripe Mangoes (5kg Box)', temp: 'ambient', weight: 5.30, volume: 0.0115, unit: 'Box' },
  { id: 'PRD-FR-039', name: 'Hass Avocado Premium (3kg Box)', temp: 'ambient', weight: 3.20, volume: 0.0068, unit: 'Box' },
  { id: 'PRD-FR-040', name: 'Mauritius Sweet Pineapple (6-Count Crate)', temp: 'ambient', weight: 7.80, volume: 0.0180, unit: 'Crate' },
  { id: 'PRD-FR-041', name: 'Seedless Red Watermelon (2-Count Box)', temp: 'ambient', weight: 9.50, volume: 0.0210, unit: 'Box' },
  { id: 'PRD-FR-042', name: 'Royal Gala Red Apples (10kg Master Box)', temp: 'reefer', weight: 10.40, volume: 0.0195, unit: 'Carton' },
  { id: 'PRD-FR-043', name: 'Seedless Green Grapes (500g Clamshell)', temp: 'reefer', weight: 0.54, volume: 0.0014, unit: 'Clamshell' },
  { id: 'PRD-FR-044', name: 'Imported Sweet Navel Oranges (10kg Box)', temp: 'ambient', weight: 10.35, volume: 0.0185, unit: 'Carton' },

  // Bakery, Beverages & Frozen Staples
  { id: 'PRD-FR-045', name: 'Artisan Crusty Sourdough Loaf (600g)', temp: 'ambient', weight: 0.62, volume: 0.0026, unit: 'Loaf' },
  { id: 'PRD-FR-046', name: 'Whole Wheat Sliced Bread (450g Pack)', temp: 'ambient', weight: 0.47, volume: 0.0019, unit: 'Loaf' },
  { id: 'PRD-FR-047', name: 'Butter French Croissants (4-Pack Box)', temp: 'ambient', weight: 0.32, volume: 0.0022, unit: 'Box' },
  { id: 'PRD-FR-048', name: 'Cold-Pressed Orange Juice (1L Bottle)', temp: 'reefer', weight: 1.06, volume: 0.0015, unit: 'Bottle' },
  { id: 'PRD-FR-049', name: 'Pure Coconut Water Unsweetened (1L Tetra)', temp: 'ambient', weight: 1.04, volume: 0.0014, unit: 'Carton' },
  { id: 'PRD-FR-050', name: 'Frozen Garden Green Peas (1kg Bag)', temp: 'reefer', weight: 1.03, volume: 0.0019, unit: 'Bag' },
  { id: 'PRD-FR-051', name: 'Frozen Sweet Kernel Corn (1kg Bag)', temp: 'reefer', weight: 1.03, volume: 0.0019, unit: 'Bag' },
  { id: 'PRD-FR-052', name: 'Straight Cut French Fries (2.5kg Bag)', temp: 'reefer', weight: 2.58, volume: 0.0048, unit: 'Bag' },
  { id: 'PRD-FR-053', name: 'Vanilla Bean Ice Cream Tub (2L)', temp: 'reefer', weight: 1.45, volume: 0.0028, unit: 'Tub' },
  { id: 'PRD-FR-054', name: 'Dark Chocolate Gelato Tub (1L)', temp: 'reefer', weight: 0.85, volume: 0.0016, unit: 'Tub' },
  { id: 'PRD-FR-055', name: 'Culinary Coconut Milk UHT (12x400ml Case)', temp: 'ambient', weight: 5.60, volume: 0.0085, unit: 'Case' },
]

const TECH_PRODUCTS = [
  // Computing & Tablets
  { id: 'PRD-TC-001', name: 'UltraBook Pro 14" M3 (16GB/512GB SSD)', temp: 'ambient', weight: 1.85, volume: 0.0042, unit: 'Box' },
  { id: 'PRD-TC-002', name: 'Developer Workstation Laptop 16" (32GB/1TB)', temp: 'ambient', weight: 2.75, volume: 0.0065, unit: 'Box' },
  { id: 'PRD-TC-003', name: 'Gaming Laptop RTX 4070 15.6" (16GB/1TB)', temp: 'ambient', weight: 3.40, volume: 0.0085, unit: 'Box' },
  { id: 'PRD-TC-004', name: 'Student Chromebook 11.6" Rugged Edition', temp: 'ambient', weight: 1.55, volume: 0.0038, unit: 'Box' },
  { id: 'PRD-TC-005', name: 'Pro Tablet 11" 128GB Wi-Fi Space Gray', temp: 'ambient', weight: 0.85, volume: 0.0018, unit: 'Box' },
  { id: 'PRD-TC-006', name: 'Mini Tablet 8.3" 64GB Cellular Ready', temp: 'ambient', weight: 0.62, volume: 0.0012, unit: 'Box' },
  { id: 'PRD-TC-007', name: 'Stylus Active Precision Pen with Wireless Charge', temp: 'ambient', weight: 0.12, volume: 0.0003, unit: 'Pack' },
  
  // Smartphones & Smart Wearables
  { id: 'PRD-TC-008', name: 'Flagship 5G Smartphone 256GB Dual SIM', temp: 'ambient', weight: 0.42, volume: 0.0009, unit: 'Box' },
  { id: 'PRD-TC-009', name: 'Mid-Tier 5G Android Smartphone 128GB', temp: 'ambient', weight: 0.38, volume: 0.0008, unit: 'Box' },
  { id: 'PRD-TC-010', name: 'Rugged Dual-SIM Field Smartphone IP68', temp: 'ambient', weight: 0.52, volume: 0.0012, unit: 'Box' },
  { id: 'PRD-TC-011', name: 'Smart Fitness Watch AMOLED with SpO2 Sensor', temp: 'ambient', weight: 0.24, volume: 0.0006, unit: 'Box' },
  { id: 'PRD-TC-012', name: 'GPS Multisport Outdoor GPS Smartwatch Titanium', temp: 'ambient', weight: 0.31, volume: 0.0008, unit: 'Box' },
  { id: 'PRD-TC-013', name: 'Smart Health Ring Activity & Sleep Tracker', temp: 'ambient', weight: 0.15, volume: 0.0004, unit: 'Box' },

  // Displays & Visuals
  { id: 'PRD-TC-014', name: '27-inch 4K IPS Designer Monitor with USB-C Hub', temp: 'ambient', weight: 7.80, volume: 0.0480, unit: 'Box' },
  { id: 'PRD-TC-015', name: '34-inch Curved UltraWide WQHD 144Hz Monitor', temp: 'ambient', weight: 11.20, volume: 0.0750, unit: 'Box' },
  { id: 'PRD-TC-016', name: '24-inch FHD Office Ergonomic Monitor', temp: 'ambient', weight: 5.40, volume: 0.0340, unit: 'Box' },
  { id: 'PRD-TC-017', name: '15.6-inch Portable USB-C IPS Monitor', temp: 'ambient', weight: 1.45, volume: 0.0042, unit: 'Box' },
  { id: 'PRD-TC-018', name: '4K Ultra-Short Throw Laser Home Projector', temp: 'ambient', weight: 6.80, volume: 0.0320, unit: 'Box' },

  // Audio & Acoustics
  { id: 'PRD-TC-019', name: 'Over-Ear Active Noise Cancelling Headphones', temp: 'ambient', weight: 0.65, volume: 0.0028, unit: 'Box' },
  { id: 'PRD-TC-020', name: 'True Wireless Pro Earbuds with Spatial Audio', temp: 'ambient', weight: 0.22, volume: 0.0005, unit: 'Box' },
  { id: 'PRD-TC-021', name: 'Professional Studio Reference Monitor Speakers (Pair)', temp: 'ambient', weight: 9.80, volume: 0.0380, unit: 'Pair Box' },
  { id: 'PRD-TC-022', name: 'IP67 Waterproof Outdoor Bluetooth Speaker 40W', temp: 'ambient', weight: 1.25, volume: 0.0035, unit: 'Box' },
  { id: 'PRD-TC-023', name: 'Conference USB/Bluetooth Speakerphone 360 Mic', temp: 'ambient', weight: 0.48, volume: 0.0016, unit: 'Box' },
  { id: 'PRD-TC-024', name: 'Cardioid USB Podcast Microphone with Pop Filter', temp: 'ambient', weight: 1.15, volume: 0.0045, unit: 'Box' },

  // Peripherals & Accessories
  { id: 'PRD-TC-025', name: 'RGB Mechanical Gaming Keyboard Hot-Swappable', temp: 'ambient', weight: 1.25, volume: 0.0040, unit: 'Box' },
  { id: 'PRD-TC-026', name: 'Wireless Ergonomic Split Keyboard Grey', temp: 'ambient', weight: 1.10, volume: 0.0038, unit: 'Box' },
  { id: 'PRD-TC-027', name: 'Precision Wireless Laser Mouse with Hyper-Scroll', temp: 'ambient', weight: 0.28, volume: 0.0008, unit: 'Box' },
  { id: 'PRD-TC-028', name: 'Ultra-Lightweight Honeycomb Gaming Mouse 8KHz', temp: 'ambient', weight: 0.21, volume: 0.0007, unit: 'Box' },
  { id: 'PRD-TC-029', name: '4K Ultra-HD Auto-Framing Web Camera', temp: 'ambient', weight: 0.38, volume: 0.0011, unit: 'Box' },
  { id: 'PRD-TC-030', name: 'Heavy-Duty Gas Spring Dual Monitor Arm', temp: 'ambient', weight: 4.80, volume: 0.0140, unit: 'Box' },
  { id: 'PRD-TC-031', name: 'Large Gaming Desk Pad Microfiber 900x400mm', temp: 'ambient', weight: 0.72, volume: 0.0022, unit: 'Roll Box' },

  // Power, Storage & Docking
  { id: 'PRD-TC-032', name: '1TB NVMe M.2 Rugged External SSD USB 3.2', temp: 'ambient', weight: 0.25, volume: 0.0005, unit: 'Box' },
  { id: 'PRD-TC-033', name: '4TB Desktop External Hard Drive 3.5" USB 3.0', temp: 'ambient', weight: 1.35, volume: 0.0025, unit: 'Box' },
  { id: 'PRD-TC-034', name: '100W GaN 4-Port Fast Desktop Charger (2C+2A)', temp: 'ambient', weight: 0.38, volume: 0.0008, unit: 'Box' },
  { id: 'PRD-TC-035', name: '25000mAh 140W PD Laptop Power Bank', temp: 'ambient', weight: 0.65, volume: 0.0014, unit: 'Box' },
  { id: 'PRD-TC-036', name: '12-in-1 Thunderbolt 4 Docking Station Dual 4K', temp: 'ambient', weight: 0.95, volume: 0.0026, unit: 'Box' },
  { id: 'PRD-TC-037', name: 'Line-Interactive 1500VA Desktop UPS System', temp: 'ambient', weight: 12.80, volume: 0.0280, unit: 'Unit Box' },
  { id: 'PRD-TC-038', name: 'Heavy-Duty 8-Gang Surge Protected Power Strip', temp: 'ambient', weight: 0.85, volume: 0.0024, unit: 'Pack' },
  { id: 'PRD-TC-039', name: 'Braided 240W USB-C to USB-C Cable (2m)', temp: 'ambient', weight: 0.12, volume: 0.0003, unit: 'Pack' },
  { id: 'PRD-TC-040', name: 'Ultra High Speed HDMI 2.1 Cable 8K (3m)', temp: 'ambient', weight: 0.22, volume: 0.0005, unit: 'Pack' },

  // Networking & Smart Infrastructure
  { id: 'PRD-TC-041', name: 'Tri-Band Wi-Fi 6E Mesh Router System (3-Pack)', temp: 'ambient', weight: 2.80, volume: 0.0125, unit: 'Kit Box' },
  { id: 'PRD-TC-042', name: '16-Port Gigabit Managed PoE+ Switch 150W', temp: 'ambient', weight: 3.20, volume: 0.0110, unit: 'Box' },
  { id: 'PRD-TC-043', name: 'Industrial 4G/5G Cellular Failover Gateway', temp: 'ambient', weight: 1.10, volume: 0.0035, unit: 'Box' },
  { id: 'PRD-TC-044', name: 'Cat6 Pure Copper Ethernet Cable Reel (100m)', temp: 'ambient', weight: 4.50, volume: 0.0150, unit: 'Reel' },
  { id: 'PRD-TC-045', name: 'High-Gain Dual-Band Wi-Fi 6 USB Adapter', temp: 'ambient', weight: 0.14, volume: 0.0003, unit: 'Blister' },

  // Smart Home & IoT
  { id: 'PRD-TC-046', name: '2K Pan-Tilt Indoor Security Camera with AI', temp: 'ambient', weight: 0.48, volume: 0.0016, unit: 'Box' },
  { id: 'PRD-TC-047', name: 'Outdoor Solar Powered 4G Security Camera', temp: 'ambient', weight: 1.35, volume: 0.0048, unit: 'Box' },
  { id: 'PRD-TC-048', name: 'Smart Robotic Vacuum & Mop with Auto-Empty Station', temp: 'ambient', weight: 14.50, volume: 0.0880, unit: 'Master Box' },
  { id: 'PRD-TC-049', name: 'Smart Multi-Color Ambient LED Strip Light 5m', temp: 'ambient', weight: 0.42, volume: 0.0012, unit: 'Box' },
  { id: 'PRD-TC-050', name: 'Matter-Enabled Smart Plug with Energy Monitor (4-Pack)', temp: 'ambient', weight: 0.55, volume: 0.0015, unit: 'Pack' },
  { id: 'PRD-TC-051', name: 'Biometric Fingerprint Smart Door Lock Keyless', temp: 'ambient', weight: 3.10, volume: 0.0080, unit: 'Box' },
  { id: 'PRD-TC-052', name: 'Smart Environmental Sensor (Temp/Humidity/Air Quality)', temp: 'ambient', weight: 0.16, volume: 0.0004, unit: 'Box' },

  // Components & Creator Tools
  { id: 'PRD-TC-053', name: 'DDR5 6000MHz 32GB (2x16GB) Desktop Memory Kit', temp: 'ambient', weight: 0.22, volume: 0.0004, unit: 'Pack' },
  { id: 'PRD-TC-054', name: '850W ATX 3.0 Full Modular 80-Plus Gold PSU', temp: 'ambient', weight: 2.80, volume: 0.0090, unit: 'Box' },
  { id: 'PRD-TC-055', name: 'Precision Magnetic Electronics Screwdriver Set (64-Piece)', temp: 'ambient', weight: 0.65, volume: 0.0018, unit: 'Case' },
]

const STYLE_PRODUCTS = [
  // Men's Apparel
  { id: 'PRD-ST-001', name: 'Classic Oxford Cotton Button-Down Shirt (White)', temp: 'ambient', weight: 0.35, volume: 0.0015, unit: 'Piece' },
  { id: 'PRD-ST-002', name: 'Tailored Slim-Fit Stretch Chino Trousers (Navy)', temp: 'ambient', weight: 0.55, volume: 0.0022, unit: 'Piece' },
  { id: 'PRD-ST-003', name: '100% Organic Pima Cotton Crew T-Shirt (3-Pack)', temp: 'ambient', weight: 0.65, volume: 0.0026, unit: 'Pack' },
  { id: 'PRD-ST-004', name: 'Fine Merino Wool V-Neck Sweater (Charcoal)', temp: 'ambient', weight: 0.42, volume: 0.0020, unit: 'Piece' },
  { id: 'PRD-ST-005', name: 'Pure Irish Linen Casual Long Sleeve Shirt (Beige)', temp: 'ambient', weight: 0.32, volume: 0.0014, unit: 'Piece' },
  { id: 'PRD-ST-006', name: 'Water-Resistant Technical Commuter Parka Jacket', temp: 'ambient', weight: 1.15, volume: 0.0062, unit: 'Piece' },
  { id: 'PRD-ST-007', name: 'Raw Selvedge Denim Straight Jeans 14oz (Indigo)', temp: 'ambient', weight: 0.85, volume: 0.0035, unit: 'Piece' },
  { id: 'PRD-ST-008', name: 'Modern Tailored Wool Blend Blazer (Midnight Blue)', temp: 'ambient', weight: 1.25, volume: 0.0075, unit: 'Suit Bag' },
  { id: 'PRD-ST-009', name: 'Quick-Dry Athletic Running Shorts with Liner', temp: 'ambient', weight: 0.22, volume: 0.0009, unit: 'Piece' },
  { id: 'PRD-ST-010', name: 'Bamboo Fiber Breathable Boxer Briefs (4-Pack)', temp: 'ambient', weight: 0.38, volume: 0.0014, unit: 'Box' },

  // Women's Apparel
  { id: 'PRD-ST-011', name: 'Botanical Floral Silk Chiffon Midi Dress', temp: 'ambient', weight: 0.42, volume: 0.0020, unit: 'Piece' },
  { id: 'PRD-ST-012', name: 'High-Waist Wide-Leg Linen Trousers (Ivory)', temp: 'ambient', weight: 0.48, volume: 0.0022, unit: 'Piece' },
  { id: 'PRD-ST-013', name: 'Pure Cashmere Relaxed Cardigan (Camel)', temp: 'ambient', weight: 0.38, volume: 0.0019, unit: 'Piece' },
  { id: 'PRD-ST-014', name: 'Satin Silk V-Neck Wrap Blouse (Emerald)', temp: 'ambient', weight: 0.28, volume: 0.0012, unit: 'Piece' },
  { id: 'PRD-ST-015', name: 'High-Rise Seamless Compression Workout Leggings', temp: 'ambient', weight: 0.34, volume: 0.0013, unit: 'Piece' },
  { id: 'PRD-ST-016', name: 'Double-Breasted Heritage Trench Coat (Khaki)', temp: 'ambient', weight: 1.35, volume: 0.0078, unit: 'Garment Bag' },
  { id: 'PRD-ST-017', name: 'Accordion Pleated Flowing Maxi Skirt (Black)', temp: 'ambient', weight: 0.45, volume: 0.0021, unit: 'Piece' },
  { id: 'PRD-ST-018', name: 'Ribbed Knit Scoop-Neck Tank Top (Olive)', temp: 'ambient', weight: 0.22, volume: 0.0008, unit: 'Piece' },
  { id: 'PRD-ST-019', name: 'Tailored Ankle-Length Cigarette Trousers', temp: 'ambient', weight: 0.46, volume: 0.0020, unit: 'Piece' },
  { id: 'PRD-ST-020', name: 'Structured Cotton Poplin Shirt Dress (Stripe)', temp: 'ambient', weight: 0.52, volume: 0.0025, unit: 'Piece' },

  // Footwear & Shoes
  { id: 'PRD-ST-021', name: 'Handcrafted Italian Calfskin Oxford Dress Shoes', temp: 'ambient', weight: 1.45, volume: 0.0085, unit: 'Shoebox' },
  { id: 'PRD-ST-022', name: 'Ultra-Light Breathable Knit Marathon Running Shoes', temp: 'ambient', weight: 0.82, volume: 0.0065, unit: 'Shoebox' },
  { id: 'PRD-ST-023', name: 'Classic Low-Top Canvas Sneakers (Off-White)', temp: 'ambient', weight: 0.95, volume: 0.0060, unit: 'Shoebox' },
  { id: 'PRD-ST-024', name: 'Suede Leather Chelsea Ankle Boots (Tobacco Brown)', temp: 'ambient', weight: 1.35, volume: 0.0082, unit: 'Shoebox' },
  { id: 'PRD-ST-025', name: 'Comfort Memory Foam Leather Driver Loafers', temp: 'ambient', weight: 0.88, volume: 0.0058, unit: 'Shoebox' },
  { id: 'PRD-ST-026', name: 'Vibram-Sole All-Weather Waterproof Hiking Boots', temp: 'ambient', weight: 1.85, volume: 0.0110, unit: 'Shoebox' },
  { id: 'PRD-ST-027', name: 'Ergonomic Cork Footbed Leather Slides (Unisex)', temp: 'ambient', weight: 0.68, volume: 0.0045, unit: 'Shoebox' },
  { id: 'PRD-ST-028', name: 'Womens Minimalist Block Heel Leather Mules', temp: 'ambient', weight: 0.78, volume: 0.0052, unit: 'Shoebox' },

  // Leather Goods, Bags & Travel
  { id: 'PRD-ST-029', name: 'Full-Grain Vegetable Tanned Leather Bi-Fold Wallet', temp: 'ambient', weight: 0.16, volume: 0.0004, unit: 'Box' },
  { id: 'PRD-ST-030', name: 'Water-Resistant Cordura 24L Daily Commuter Backpack', temp: 'ambient', weight: 1.10, volume: 0.0120, unit: 'Piece' },
  { id: 'PRD-ST-031', name: 'Full Leather Heritage Weekend Duffle Bag (Cognac)', temp: 'ambient', weight: 2.30, volume: 0.0240, unit: 'Dust Bag' },
  { id: 'PRD-ST-032', name: 'Slim RFID-Blocking Metal Cardholder & Money Clip', temp: 'ambient', weight: 0.12, volume: 0.0003, unit: 'Box' },
  { id: 'PRD-ST-033', name: 'Pebbled Leather Crossbody Camera Bag (Black)', temp: 'ambient', weight: 0.58, volume: 0.0032, unit: 'Dust Bag' },
  { id: 'PRD-ST-034', name: 'Structured Canvas Laptop Tote Bag with Leather Trim', temp: 'ambient', weight: 0.92, volume: 0.0075, unit: 'Piece' },
  { id: 'PRD-ST-035', name: 'Reversible Italian Full-Grain Leather Dress Belt', temp: 'ambient', weight: 0.28, volume: 0.0008, unit: 'Box' },

  // Timepieces, Eyewear & Jewelry
  { id: 'PRD-ST-036', name: 'Automatic Sapphire Crystal Field Watch (Canvas Strap)', temp: 'ambient', weight: 0.45, volume: 0.0012, unit: 'Watch Box' },
  { id: 'PRD-ST-037', name: 'Stainless Steel Minimalist Mesh Chronograph Watch', temp: 'ambient', weight: 0.48, volume: 0.0014, unit: 'Watch Box' },
  { id: 'PRD-ST-038', name: 'Handmade Acetate Polarized Sunglasses (Tortoise)', temp: 'ambient', weight: 0.25, volume: 0.0007, unit: 'Hardcase' },
  { id: 'PRD-ST-039', name: 'Titanium Rimless Blue-Light Blocking Glasses', temp: 'ambient', weight: 0.18, volume: 0.0006, unit: 'Case' },
  { id: 'PRD-ST-040', name: 'Sterling Silver 925 Snake Chain Necklace (50cm)', temp: 'ambient', weight: 0.08, volume: 0.0002, unit: 'Jewelry Box' },
  { id: 'PRD-ST-041', name: '18K Gold Plated Minimalist Geometric Huggie Earrings', temp: 'ambient', weight: 0.06, volume: 0.0002, unit: 'Pouch' },

  // Home Linens, Bedding & Living
  { id: 'PRD-ST-042', name: 'Egyptian Long-Staple Cotton 400TC Queen Sheet Set', temp: 'ambient', weight: 2.40, volume: 0.0095, unit: 'Fabric Bag' },
  { id: 'PRD-ST-043', name: 'Pure Washed French Linen King Duvet Cover (Sand)', temp: 'ambient', weight: 2.10, volume: 0.0088, unit: 'Fabric Bag' },
  { id: 'PRD-ST-044', name: 'Zero-Twist Turkish Organic Cotton Bath Towel (2-Pack)', temp: 'ambient', weight: 1.45, volume: 0.0065, unit: 'Ribbon Pack' },
  { id: 'PRD-ST-045', name: 'Plush Memory Foam Contour Sleeping Pillow', temp: 'ambient', weight: 1.25, volume: 0.0140, unit: 'Carry Box' },
  { id: 'PRD-ST-046', name: 'Weighted Sensory Relax Blanket 6.8kg (Charcoal)', temp: 'ambient', weight: 7.10, volume: 0.0220, unit: 'Zipper Bag' },
  { id: 'PRD-ST-047', name: 'Waffle-Weave Microfiber Lightweight Bathrobe (L/XL)', temp: 'ambient', weight: 0.95, volume: 0.0048, unit: 'Pouch' },
  { id: 'PRD-ST-048', name: 'Hand-Tufted Wool Accent Floor Rug 120x180cm', temp: 'ambient', weight: 5.20, volume: 0.0280, unit: 'Rolled Bundle' },

  // Beauty, Grooming & Fragrance
  { id: 'PRD-ST-049', name: 'Botanical Argan & Keratin Hair Treatment Serum (100ml)', temp: 'ambient', weight: 0.28, volume: 0.0005, unit: 'Bottle' },
  { id: 'PRD-ST-050', name: 'Ultra-Hydrating Hyaluronic Acid Facial Moisturizer 50ml', temp: 'ambient', weight: 0.18, volume: 0.0004, unit: 'Jar' },
  { id: 'PRD-ST-051', name: 'Mineral Sunscreen SPF 50+ Broad Spectrum (150ml)', temp: 'ambient', weight: 0.22, volume: 0.0004, unit: 'Tube' },
  { id: 'PRD-ST-052', name: 'Organic Cold-Pressed Shea Butter Body Balm (200g)', temp: 'ambient', weight: 0.28, volume: 0.0006, unit: 'Tin' },
  { id: 'PRD-ST-053', name: 'Sandalwood & Bergamot Eau de Parfum (100ml)', temp: 'ambient', weight: 0.42, volume: 0.0009, unit: 'Box' },
  { id: 'PRD-ST-054', name: 'Matte Clay Hair Styling Pomade Medium Hold (100g)', temp: 'ambient', weight: 0.16, volume: 0.0003, unit: 'Jar' },
  { id: 'PRD-ST-055', name: 'Aromatherapy Soy Wax Scented Candle (Amber/Oakmoss)', temp: 'ambient', weight: 0.58, volume: 0.0011, unit: 'Glass Tumbler' },
]

async function seedProducts() {
  console.log('--- Initializing Products Master Catalog ---')

  // 1. Ensure products table exists with requested columns
  await sql.query(`
    CREATE TABLE IF NOT EXISTS products (
      product_id VARCHAR(30) PRIMARY KEY,
      product_name VARCHAR(150) NOT NULL,
      brand VARCHAR(30) NOT NULL,
      temperature_requirement VARCHAR(30) NOT NULL,
      weight_per_unit NUMERIC(10,2) NOT NULL,
      volume_per_unit NUMERIC(10,4) NOT NULL,
      unit VARCHAR(30) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `)
  console.log('✓ Verified table: products')

  // Combine datasets
  const allProducts = [
    ...FRESH_PRODUCTS.map((p) => ({ ...p, brand: 'Fresh' })),
    ...TECH_PRODUCTS.map((p) => ({ ...p, brand: 'Tech' })),
    ...STYLE_PRODUCTS.map((p) => ({ ...p, brand: 'Style' })),
  ]

  console.log(`Seeding ${allProducts.length} items (55 Fresh, 55 Tech, 55 Style)...`)

  let insertedCount = 0
  for (const item of allProducts) {
    await sql.query(
      `INSERT INTO products (
        product_id, product_name, brand, temperature_requirement,
        weight_per_unit, volume_per_unit, unit
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (product_id) DO UPDATE SET
        product_name = EXCLUDED.product_name,
        brand = EXCLUDED.brand,
        temperature_requirement = EXCLUDED.temperature_requirement,
        weight_per_unit = EXCLUDED.weight_per_unit,
        volume_per_unit = EXCLUDED.volume_per_unit,
        unit = EXCLUDED.unit`,
      [
        item.id,
        item.name,
        item.brand,
        item.temp,
        item.weight,
        item.volume,
        item.unit,
      ]
    )
    insertedCount++
  }

  // Count verify
  const countRes = await sql.query(`SELECT COUNT(*) as total, brand FROM products GROUP BY brand`)
  console.log('✓ Successfully seeded products catalog:')
  console.table(countRes)
  return insertedCount
}

if (require.main === module) {
  seedProducts()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Fatal error seeding products:', err)
      process.exit(1)
    })
}

module.exports = { seedProducts }
