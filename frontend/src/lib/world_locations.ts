// ISO Standard List of Countries
export const ALL_WORLD_COUNTRIES = [
  { label: "🌍 All Countries (Worldwide)", value: "All" },
  { label: "🌐 Fully Remote (Work From Anywhere)", value: "Remote" },
  { label: "🇮🇳 India", value: "India" },
  { label: "🇺🇸 United States", value: "United States" },
  { label: "🇬🇧 United Kingdom", value: "United Kingdom" },
  { label: "🇩🇪 Germany", value: "Germany" },
  { label: "🇨🇦 Canada", value: "Canada" },
  { label: "🇸🇬 Singapore", value: "Singapore" },
  { label: "🇦🇺 Australia", value: "Australia" },
  { label: "🇦🇪 United Arab Emirates", value: "UAE" },
  { label: "🇳🇱 Netherlands", value: "Netherlands" },
  { label: "🇮🇪 Ireland", value: "Ireland" },
  { label: "🇫🇷 France", value: "France" },
  { label: "🇨🇭 Switzerland", value: "Switzerland" },
  { label: "🇯🇵 Japan", value: "Japan" },
  { label: "🇸🇪 Sweden", value: "Sweden" },
  { label: "🇵🇱 Poland", value: "Poland" },
  { label: "🇪🇸 Spain", value: "Spain" },
  { label: "🇮🇹 Italy", value: "Italy" },
  { label: "🇧🇷 Brazil", value: "Brazil" },
  { label: "🇲🇽 Mexico", value: "Mexico" },
  { label: "🇿🇦 South Africa", value: "South Africa" },
  { label: "🇳🇿 New Zealand", value: "New Zealand" },
  { label: "🇩🇰 Denmark", value: "Denmark" },
  { label: "🇳🇴 Norway", value: "Norway" },
  { label: "🇫🇮 Finland", value: "Finland" },
  { label: "🇦🇹 Austria", value: "Austria" },
  { label: "🇧🇪 Belgium", value: "Belgium" },
  { label: "🇵🇹 Portugal", value: "Portugal" },
  { label: "🇮🇱 Israel", value: "Israel" },
  { label: "🇰🇷 South Korea", value: "South Korea" },
  { label: "🇲🇾 Malaysia", value: "Malaysia" },
  { label: "🇮🇩 Indonesia", value: "Indonesia" },
  { label: "🇵🇭 Philippines", value: "Philippines" },
  { label: "🇹🇭 Thailand", value: "Thailand" },
  { label: "🇻🇳 Vietnam", value: "Vietnam" },
  { label: "🇸🇦 Saudi Arabia", value: "Saudi Arabia" },
  { label: "🇶🇦 Qatar", value: "Qatar" },
  { label: "🇪🇬 Egypt", value: "Egypt" },
  { label: "🇳🇬 Nigeria", value: "Nigeria" },
  { label: "🇰🇪 Kenya", value: "Kenya" },
  { label: "🇦🇷 Argentina", value: "Argentina" },
  { label: "🇨🇱 Chile", value: "Chile" },
  { label: "🇨🇴 Colombia", value: "Colombia" },
  { label: "🇨🇿 Czech Republic", value: "Czech Republic" },
  { label: "🇷🇴 Romania", value: "Romania" },
  { label: "🇭🇺 Hungary", value: "Hungary" },
  { label: "🇬🇷 Greece", value: "Greece" },
  { label: "🇹🇷 Turkey", value: "Turkey" },
  { label: "🇺🇦 Ukraine", value: "Ukraine" },
  { label: "🇵🇰 Pakistan", value: "Pakistan" },
  { label: "🇧🇩 Bangladesh", value: "Bangladesh" },
  { label: "🇱🇰 Sri Lanka", value: "Sri Lanka" },
  { label: "🇳🇵 Nepal", value: "Nepal" }
];

// Comprehensive States dictionary per Country
export const COUNTRY_STATES: Record<string, { label: string; value: string }[]> = {
  India: [
    { label: "📍 All States in India", value: "All" },
    { label: "Karnataka", value: "Karnataka" },
    { label: "Maharashtra", value: "Maharashtra" },
    { label: "Telangana", value: "Telangana" },
    { label: "Delhi NCR", value: "Delhi" },
    { label: "Tamil Nadu", value: "Tamil Nadu" },
    { label: "Uttar Pradesh", value: "Uttar Pradesh" },
    { label: "Haryana", value: "Haryana" },
    { label: "Gujarat", value: "Gujarat" },
    { label: "West Bengal", value: "West Bengal" },
    { label: "Kerala", value: "Kerala" },
    { label: "Rajasthan", value: "Rajasthan" },
    { label: "Madhya Pradesh", value: "Madhya Pradesh" },
    { label: "Punjab", value: "Punjab" },
    { label: "Andhra Pradesh", value: "Andhra Pradesh" },
    { label: "Odisha", value: "Odisha" },
    { label: "Bihar", value: "Bihar" },
    { label: "Chandigarh (UT)", value: "Chandigarh" },
    { label: "Goa", value: "Goa" },
    { label: "Uttarakhand", value: "Uttarakhand" },
    { label: "Assam", value: "Assam" },
    { label: "Jharkhand", value: "Jharkhand" }
  ],
  "United States": [
    { label: "📍 All US States", value: "All" },
    { label: "California", value: "California" },
    { label: "New York", value: "New York" },
    { label: "Washington", value: "Washington" },
    { label: "Texas", value: "Texas" },
    { label: "Massachusetts", value: "Massachusetts" },
    { label: "Illinois", value: "Illinois" },
    { label: "Colorado", value: "Colorado" },
    { label: "Georgia", value: "Georgia" },
    { label: "Florida", value: "Florida" },
    { label: "North Carolina", value: "North Carolina" },
    { label: "Virginia", value: "Virginia" },
    { label: "New Jersey", value: "New Jersey" },
    { label: "Pennsylvania", value: "Pennsylvania" },
    { label: "Ohio", value: "Ohio" },
    { label: "Michigan", value: "Michigan" },
    { label: "Arizona", value: "Arizona" },
    { label: "Oregon", value: "Oregon" },
    { label: "Utah", value: "Utah" }
  ],
  "United Kingdom": [
    { label: "📍 All UK Regions", value: "All" },
    { label: "Greater London", value: "London" },
    { label: "South East England", value: "South East" },
    { label: "North West England", value: "North West" },
    { label: "Scotland", value: "Scotland" },
    { label: "West Midlands", value: "West Midlands" },
    { label: "East of England", value: "East England" },
    { label: "Yorkshire and the Humber", value: "Yorkshire" },
    { label: "Wales", value: "Wales" },
    { label: "Northern Ireland", value: "Northern Ireland" }
  ],
  Germany: [
    { label: "📍 All German States", value: "All" },
    { label: "Berlin", value: "Berlin" },
    { label: "Bavaria (Bayern)", value: "Bavaria" },
    { label: "Hesse (Hessen)", value: "Hesse" },
    { label: "North Rhine-Westphalia", value: "NRW" },
    { label: "Baden-Württemberg", value: "BW" },
    { label: "Hamburg", value: "Hamburg" },
    { label: "Saxony (Sachsen)", value: "Saxony" }
  ],
  Canada: [
    { label: "📍 All Canadian Provinces", value: "All" },
    { label: "Ontario", value: "Ontario" },
    { label: "British Columbia", value: "British Columbia" },
    { label: "Quebec", value: "Quebec" },
    { label: "Alberta", value: "Alberta" },
    { label: "Nova Scotia", value: "Nova Scotia" },
    { label: "Manitoba", value: "Manitoba" }
  ],
  Australia: [
    { label: "📍 All Australian States", value: "All" },
    { label: "New South Wales", value: "NSW" },
    { label: "Victoria", value: "Victoria" },
    { label: "Queensland", value: "Queensland" },
    { label: "Western Australia", value: "WA" },
    { label: "South Australia", value: "SA" }
  ],
  UAE: [
    { label: "📍 All Emirates", value: "All" },
    { label: "Dubai", value: "Dubai" },
    { label: "Abu Dhabi", value: "Abu Dhabi" },
    { label: "Sharjah", value: "Sharjah" }
  ]
};

// Cities dictionary per Country and State
export const STATE_CITIES: Record<string, Record<string, { label: string; value: string }[]>> = {
  India: {
    All: [
      { label: "📍 All Cities in India", value: "All" },
      { label: "Bengaluru / Bangalore", value: "Bengaluru" },
      { label: "Pune", value: "Pune" },
      { label: "Hyderabad", value: "Hyderabad" },
      { label: "Delhi NCR (Gurgaon / Noida / Delhi)", value: "Delhi" },
      { label: "Mumbai / Navi Mumbai", value: "Mumbai" },
      { label: "Chennai", value: "Chennai" },
      { label: "Kolkata", value: "Kolkata" },
      { label: "Ahmedabad", value: "Ahmedabad" },
      { label: "Jaipur", value: "Jaipur" },
      { label: "Chandigarh", value: "Chandigarh" },
      { label: "Indore", value: "Indore" },
      { label: "Kochi / Cochin", value: "Kochi" },
      { label: "Coimbatore", value: "Coimbatore" },
      { label: "Thiruvananthapuram", value: "Thiruvananthapuram" },
      { label: "Bhubaneswar", value: "Bhubaneswar" },
      { label: "Lucknow", value: "Lucknow" },
      { label: "Nagpur", value: "Nagpur" },
      { label: "Vadodara", value: "Vadodara" },
      { label: "Surat", value: "Surat" },
      { label: "Visakhapatnam", value: "Visakhapatnam" },
      { label: "Remote (Pan-India)", value: "Remote" }
    ],
    Karnataka: [
      { label: "📍 All in Karnataka", value: "All" },
      { label: "Bengaluru / Bangalore", value: "Bengaluru" },
      { label: "Mysuru / Mysore", value: "Mysore" },
      { label: "Mangaluru / Mangalore", value: "Mangalore" },
      { label: "Hubballi / Hubli", value: "Hubli" },
      { label: "Belagavi", value: "Belagavi" }
    ],
    Maharashtra: [
      { label: "📍 All in Maharashtra", value: "All" },
      { label: "Pune", value: "Pune" },
      { label: "Mumbai", value: "Mumbai" },
      { label: "Navi Mumbai", value: "Navi Mumbai" },
      { label: "Thane", value: "Thane" },
      { label: "Nagpur", value: "Nagpur" },
      { label: "Nashik", value: "Nashik" },
      { label: "Aurangabad / Chhatrapati Sambhajinagar", value: "Aurangabad" }
    ],
    Telangana: [
      { label: "📍 All in Telangana", value: "All" },
      { label: "Hyderabad", value: "Hyderabad" },
      { label: "Secunderabad", value: "Secunderabad" },
      { label: "Warangal", value: "Warangal" }
    ],
    Delhi: [
      { label: "📍 All in Delhi NCR", value: "All" },
      { label: "New Delhi", value: "Delhi" },
      { label: "Gurugram / Gurgaon", value: "Gurgaon" },
      { label: "Noida", value: "Noida" },
      { label: "Greater Noida", value: "Greater Noida" },
      { label: "Faridabad", value: "Faridabad" },
      { label: "Ghaziabad", value: "Ghaziabad" }
    ],
    "Tamil Nadu": [
      { label: "📍 All in Tamil Nadu", value: "All" },
      { label: "Chennai", value: "Chennai" },
      { label: "Coimbatore", value: "Coimbatore" },
      { label: "Madurai", value: "Madurai" },
      { label: "Tiruchirappalli / Trichy", value: "Trichy" },
      { label: "Salem", value: "Salem" }
    ],
    "Uttar Pradesh": [
      { label: "📍 All in Uttar Pradesh", value: "All" },
      { label: "Noida", value: "Noida" },
      { label: "Greater Noida", value: "Greater Noida" },
      { label: "Lucknow", value: "Lucknow" },
      { label: "Kanpur", value: "Kanpur" },
      { label: "Varanasi", value: "Varanasi" },
      { label: "Agra", value: "Agra" },
      { label: "Prayagraj / Allahabad", value: "Prayagraj" }
    ],
    Haryana: [
      { label: "📍 All in Haryana", value: "All" },
      { label: "Gurugram / Gurgaon", value: "Gurgaon" },
      { label: "Faridabad", value: "Faridabad" },
      { label: "Panchkula", value: "Panchkula" },
      { label: "Ambala", value: "Ambala" }
    ],
    Gujarat: [
      { label: "📍 All in Gujarat", value: "All" },
      { label: "Ahmedabad", value: "Ahmedabad" },
      { label: "Gandhinagar (GIFT City)", value: "Gandhinagar" },
      { label: "Vadodara", value: "Vadodara" },
      { label: "Surat", value: "Surat" },
      { label: "Rajkot", value: "Rajkot" }
    ],
    "West Bengal": [
      { label: "📍 All in West Bengal", value: "All" },
      { label: "Kolkata (Salt Lake / New Town)", value: "Kolkata" },
      { label: "Howrah", value: "Howrah" },
      { label: "Siliguri", value: "Siliguri" },
      { label: "Durgapur", value: "Durgapur" }
    ],
    Kerala: [
      { label: "📍 All in Kerala", value: "All" },
      { label: "Kochi / Cochin", value: "Kochi" },
      { label: "Thiruvananthapuram / Trivandrum", value: "Trivandrum" },
      { label: "Kozhikode / Calicut", value: "Calicut" },
      { label: "Thrissur", value: "Thrissur" }
    ],
    Rajasthan: [
      { label: "📍 All in Rajasthan", value: "All" },
      { label: "Jaipur", value: "Jaipur" },
      { label: "Jodhpur", value: "Jodhpur" },
      { label: "Udaipur", value: "Udaipur" },
      { label: "Kota", value: "Kota" }
    ],
    "Madhya Pradesh": [
      { label: "📍 All in Madhya Pradesh", value: "All" },
      { label: "Indore", value: "Indore" },
      { label: "Bhopal", value: "Bhopal" },
      { label: "Gwalior", value: "Gwalior" },
      { label: "Jabalpur", value: "Jabalpur" }
    ],
    Punjab: [
      { label: "📍 All in Punjab", value: "All" },
      { label: "Mohali", value: "Mohali" },
      { label: "Ludhiana", value: "Ludhiana" },
      { label: "Amritsar", value: "Amritsar" },
      { label: "Jalandhar", value: "Jalandhar" }
    ],
    "Andhra Pradesh": [
      { label: "📍 All in Andhra Pradesh", value: "All" },
      { label: "Visakhapatnam / Vizag", value: "Visakhapatnam" },
      { label: "Vijayawada", value: "Vijayawada" },
      { label: "Tirupati", value: "Tirupati" }
    ],
    Odisha: [
      { label: "📍 All in Odisha", value: "All" },
      { label: "Bhubaneswar", value: "Bhubaneswar" },
      { label: "Cuttack", value: "Cuttack" },
      { label: "Rourkela", value: "Rourkela" }
    ]
  },
  "United States": {
    All: [
      { label: "📍 All US Cities", value: "All" },
      { label: "San Francisco / Bay Area", value: "San Francisco" },
      { label: "New York City", value: "New York" },
      { label: "Seattle", value: "Seattle" },
      { label: "Austin", value: "Austin" },
      { label: "Boston", value: "Boston" },
      { label: "Chicago", value: "Chicago" },
      { label: "Los Angeles", value: "Los Angeles" },
      { label: "Denver", value: "Denver" },
      { label: "Atlanta", value: "Atlanta" },
      { label: "San Jose", value: "San Jose" },
      { label: "Dallas", value: "Dallas" },
      { label: "Remote (US)", value: "Remote" }
    ],
    California: [
      { label: "📍 All in California", value: "All" },
      { label: "San Francisco", value: "San Francisco" },
      { label: "San Jose / Silicon Valley", value: "San Jose" },
      { label: "Los Angeles", value: "Los Angeles" },
      { label: "San Diego", value: "San Diego" },
      { label: "Palo Alto", value: "Palo Alto" }
    ],
    "New York": [
      { label: "📍 All in New York", value: "All" },
      { label: "New York City (Manhattan/Brooklyn)", value: "New York" },
      { label: "Albany", value: "Albany" },
      { label: "Buffalo", value: "Buffalo" }
    ],
    Washington: [
      { label: "📍 All in Washington", value: "All" },
      { label: "Seattle", value: "Seattle" },
      { label: "Bellevue", value: "Bellevue" },
      { label: "Redmond", value: "Redmond" }
    ],
    Texas: [
      { label: "📍 All in Texas", value: "All" },
      { label: "Austin", value: "Austin" },
      { label: "Dallas", value: "Dallas" },
      { label: "Houston", value: "Houston" },
      { label: "Plano", value: "Plano" }
    ],
    Massachusetts: [
      { label: "📍 All in Massachusetts", value: "All" },
      { label: "Boston", value: "Boston" },
      { label: "Cambridge", value: "Cambridge" }
    ]
  },
  "United Kingdom": {
    All: [
      { label: "📍 All UK Cities", value: "All" },
      { label: "London", value: "London" },
      { label: "Manchester", value: "Manchester" },
      { label: "Edinburgh", value: "Edinburgh" },
      { label: "Birmingham", value: "Birmingham" },
      { label: "Cambridge", value: "Cambridge" },
      { label: "Bristol", value: "Bristol" },
      { label: "Oxford", value: "Oxford" },
      { label: "Remote (UK)", value: "Remote" }
    ],
    London: [
      { label: "Central London", value: "London" },
      { label: "Canary Wharf", value: "London" },
      { label: "Tech City / Shoreditch", value: "London" }
    ]
  },
  Germany: {
    All: [
      { label: "📍 All German Cities", value: "All" },
      { label: "Berlin", value: "Berlin" },
      { label: "Munich (München)", value: "Munich" },
      { label: "Frankfurt am Main", value: "Frankfurt" },
      { label: "Hamburg", value: "Hamburg" },
      { label: "Cologne (Köln)", value: "Cologne" },
      { label: "Stuttgart", value: "Stuttgart" },
      { label: "Düsseldorf", value: "Düsseldorf" }
    ]
  },
  Canada: {
    All: [
      { label: "📍 All Canadian Cities", value: "All" },
      { label: "Toronto", value: "Toronto" },
      { label: "Vancouver", value: "Vancouver" },
      { label: "Montreal", value: "Montreal" },
      { label: "Ottawa", value: "Ottawa" },
      { label: "Waterloo / Kitchener", value: "Waterloo" },
      { label: "Calgary", value: "Calgary" }
    ]
  },
  Singapore: {
    All: [
      { label: "📍 Singapore (Central / Tech Hub)", value: "Singapore" },
      { label: "Marina Bay / CBD", value: "Singapore" },
      { label: "One-North Tech Park", value: "Singapore" }
    ]
  },
  Australia: {
    All: [
      { label: "📍 All Australian Cities", value: "All" },
      { label: "Sydney", value: "Sydney" },
      { label: "Melbourne", value: "Melbourne" },
      { label: "Brisbane", value: "Brisbane" },
      { label: "Perth", value: "Perth" },
      { label: "Canberra", value: "Canberra" }
    ]
  },
  UAE: {
    All: [
      { label: "📍 All in UAE", value: "All" },
      { label: "Dubai (DIFC / Internet City)", value: "Dubai" },
      { label: "Abu Dhabi (Hub71 / ADGM)", value: "Abu Dhabi" }
    ]
  }
};
