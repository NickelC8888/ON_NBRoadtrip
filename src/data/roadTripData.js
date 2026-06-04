import { OPENTRIPMAP_SEGMENT_ATTRACTIONS } from './openTripMapSegmentAttractions';

export const SEASONS = [
  { id: 'all', label: 'All Seasons' },
  { id: 'june', label: 'June' },
  { id: 'late-august', label: 'Late August' },
  { id: 'early-september', label: 'Early September' },
];

const ALL_TRIPS = [
  // ─────────────────────────────────────────────
  // TRIP 1 — Tobermory & Bruce Peninsula
  // ─────────────────────────────────────────────
  {
    id: 'tobermory',
    name: 'Tobermory & Bruce Peninsula',
    tagline: 'Turquoise caves, ancient cliffs, and the very tip of the Bruce',
    duration: '3 days',
    distanceKm: 620,
    driveHoursOneWay: 3.5,
    seasons: ['june', 'late-august', 'early-september'],
    colorFrom: '#0d9488',
    colorTo: '#0891b2',
    emoji: '🏔️',
    highlights: ['The Grotto', 'Singing Sands Beach', 'Flowerpot Island', 'Tobermory Harbour'],

    route: {
      waypoints: [
        [43.6532, -79.3832],
        [44.3894, -79.6903],
        [44.5670, -80.9430],
        [45.2533, -81.6640],
      ],
      stops: [
        {
          name: 'Toronto',
          coords: [43.6532, -79.3832],
          night: null,
          description: 'Departure point. Leave early to beat Hwy 400 traffic heading north.',
        },
        {
          name: 'Barrie',
          coords: [44.3894, -79.6903],
          night: null,
          description: 'Rest stop ~1 hr from Toronto. Grab a coffee and stretch before joining Hwy 26 West.',
        },
        {
          name: 'Owen Sound',
          coords: [44.5670, -80.9430],
          night: 1,
          description: 'Lunch stop and optional overnight. Harrison Park offers beautiful flat riverside trails — perfect for a senior dog.',
        },
        {
          name: 'Tobermory',
          coords: [45.2533, -81.6640],
          night: 2,
          description: 'Your destination. Explore the harbour village, take a glass-bottom boat, and hike to The Grotto.',
        },
      ],
      itinerary: [
        {
          day: 1,
          title: 'Toronto → Owen Sound',
          desc: 'Drive ~2.5 hrs via Hwy 400 N then Hwy 26 W. Rest stop in Barrie. Arrive Owen Sound for lunch. Afternoon walk at Harrison Park along the Sydenham River — shaded, flat, and dog-friendly. Overnight Owen Sound.',
          driveSteps: [
            'Take Hwy 400 N from Toronto toward Barrie (~1.5 hrs)',
            'Rest stop in Barrie — good dog walk break at Centennial Park',
            'Continue on Hwy 26 W through Collingwood toward Owen Sound (~1 hr)',
            'Arrive Owen Sound — park near Harrison Park for first dog walk',
          ],
          legWaypoints: [
            [43.6532, -79.3832],
            [44.3894, -79.6903],
            [44.4990, -80.2170],
            [44.5667, -80.9333],
          ],
        },
        {
          day: 2,
          title: 'Owen Sound → Tobermory',
          desc: 'Drive ~1.5 hrs along the scenic Bruce Peninsula. Arrive Tobermory and check in. Afternoon Singing Sands Beach walk (dog-friendly). Explore Little Tub Harbour for dinner.',
          driveSteps: [
            'Take Hwy 6 N from Owen Sound through the Bruce Peninsula (~1.5 hrs)',
            'Pass through Wiarton — great photo stop at the Willie the Groundhog statue',
            'Continue north on Hwy 6 through Lion\'s Head to Tobermory',
            'Arrive Tobermory — check in, then head straight to Singing Sands Beach',
          ],
          legWaypoints: [
            [44.5667, -80.9333],
            [44.7442, -81.1421],
            [44.9842, -81.2580],
            [45.2535, -81.6650],
          ],
        },
        {
          day: 3,
          title: 'The Grotto → Home',
          desc: 'Early morning hike to The Grotto (dogs on leash, rocky but manageable for a fit senior dog). Fish & chips at the harbour. Drive home ~3.5 hrs.',
          driveSteps: [
            'Hike The Grotto first (Cyprus Lake trailhead, 5 min from town)',
            'Return to Tobermory for harbour lunch',
            'Take Hwy 6 S back through Lion\'s Head and Wiarton to Owen Sound',
            'Continue on Hwy 10 S to Hwy 400 S into Toronto (~3.5 hrs total drive)',
          ],
          legWaypoints: [
            [45.2535, -81.6650],
            [44.9842, -81.2580],
            [44.7442, -81.1421],
            [44.3894, -79.6903],
            [43.6532, -79.3832],
          ],
        },
      ],
    },

    poi: [
      {
        name: 'The Grotto',
        description:
          'A stunning sea cave carved into limestone cliffs at Cyprus Lake. Brilliant turquoise water inside. The full loop is 9 km — for a senior dog, the cliff-top lookout is ~2 km return and equally spectacular.',
        dogFriendly: true,
        kidFriendly: true,
        tags: ['scenic', 'cave', 'swimming', 'photography'],
        dogNote:
          'Dogs allowed on leash throughout Bruce Peninsula NP trails including The Grotto. Trail is rocky in sections — bring water and take breaks. Not suitable for dogs with mobility issues.',
        address:
          'Cyprus Lake Camp Ground, 469 Cyprus Lake Road, Tobermory, ON N0H 2R0, Canada',
        phone: '',
      },
      {
        name: 'Singing Sands Beach',
        description:
          'A gorgeous, shallow sandy beach on the south shore of the Bruce Peninsula. The fine quartz sand "sings" as you walk on it. Very accessible, calm water, ideal for kids.',
        dogFriendly: true,
        kidFriendly: true,
        tags: ['beach', 'swimming', 'accessible', 'flat'],
        dogNote:
          'Dogs allowed on leash. Completely flat sandy surface — ideal for a senior dog. Shallow warm water to wade in. Bring a collapsible bowl.',
        address: 'Singing Sands Beach, Tobermory, ON',
        phone: '',
      },
      {
        name: 'Tobermory Harbour (Little Tub)',
        description:
          'The heart of Tobermory village. Colourful fishing boats, shipwreck viewing docks, ice cream stands, fish & chip shops, and local galleries. Very walkable.',
        dogFriendly: true,
        kidFriendly: true,
        tags: ['village', 'dining', 'waterfront', 'shipwrecks'],
        dogNote:
          'Extremely dog-friendly village. Most outdoor patios welcome leashed dogs. Water bowls often left out by shopkeepers.',
        address: 'Little Tub Harbour, Tobermory, ON N0H 2R0, Canada',
        phone: '',
      },
      {
        name: 'Flowerpot Island Boat Tour',
        description:
          'Glass-bottom boat tour to Flowerpot Island — iconic rock stack formations, a lighthouse, and sea caves. Bruce Anchor Cruises runs regular departures from Little Tub Harbour.',
        dogFriendly: false,
        kidFriendly: true,
        tags: ['boat', 'island', 'views', 'sea caves'],
        dogNote:
          'Dogs not permitted on tour boats. Plan for one adult to remain at the harbour with the dog — Little Tub is a lovely spot to wait.',
        address: 'Little Tub Harbour, Tobermory, ON N0H 2R0, Canada (boat departures)',
        phone: '',
      },
      {
        name: 'Harrison Park, Owen Sound',
        description:
          'A beautiful free park in Owen Sound with shaded trails along the Sydenham River, a small animal zoo kids love, picnic areas, and a seasonal swimming hole.',
        dogFriendly: true,
        kidFriendly: true,
        tags: ['park', 'river', 'trails', 'picnic', 'zoo'],
        dogNote:
          'Mostly flat, shaded riverside paths — excellent for a senior dog. Dogs must be on leash. Drinking water at the river edge.',
        address: '1800 7th Ave E, Owen Sound, ON',
        phone: '',
      },
    ],

    trails: [
      {
        name: 'Singing Sands Beach Walk',
        location: 'Tobermory, ON',
        address: 'Singing Sands Beach, Tobermory, ON',
        day: 2,
        phone: '',
        lengthKm: 1.0,
        difficulty: 'easy',
        surface: 'Boardwalk + sand',
        dogFriendly: true,
        kidFriendly: true,
        duration: '20–30 min',
        seniorDogNote:
          'Flat and gentle — the perfect senior dog trail. Short enough to leave everyone energised. Cool water to wade in at the end.',
        description:
          'A leisurely stroll along the boardwalk and sandy shoreline at Singing Sands. Shallow calm water safe for kids and dogs to splash in.',
      },
      {
        name: 'Cyprus Lake Campground Loop',
        location: 'Tobermory, ON',
        address: 'Cyprus Lake Trailhead, Tobermory, ON',
        day: 3,
        phone: '',
        lengthKm: 2.5,
        difficulty: 'easy',
        surface: 'Gravel path',
        dogFriendly: true,
        kidFriendly: true,
        duration: '45–60 min',
        seniorDogNote:
          'Mostly flat loop around the lake. Several benches and shaded rest spots. Bring water — no fountains on trail.',
        description:
          'A peaceful loop around Cyprus Lake inside Bruce Peninsula National Park. Forest canopy, lake views, and occasional wildlife sightings.',
      },
      {
        name: 'Harrison Park River Trail',
        location: 'Owen Sound, ON',
        address: 'Harrison Park, 1800 7th Ave E, Owen Sound, ON',
        day: 1,
        phone: '',
        lengthKm: 3.0,
        difficulty: 'easy',
        surface: 'Paved & packed gravel',
        dogFriendly: true,
        kidFriendly: true,
        duration: '45–70 min',
        seniorDogNote:
          'Completely flat riverside path with benches every few hundred metres. Perfect for a morning walk before the drive to Tobermory.',
        description:
          'Follows the Sydenham River through Harrison Park in Owen Sound. Shaded, flat, and beautifully maintained. Great for an evening stroll.',
      },
    ],

    lodging: [
      {
        name: 'Blue Bay Motel',
        type: 'Motel',
        location: 'Tobermory',
        address: '270 Bay St, Tobermory, ON',
        day: 2,
        phone: '',
        petPolicy: 'Pet-friendly rooms available — confirm at booking',
        familySuitable: true,
        priceRange: '$$',
        rooms: 'Standard rooms and self-contained cottages',
        bookingNote: 'Book well in advance for July/August. Spring and September bookings are much easier to get.',
      },
      {
        name: 'Little Tub Harbour Suite Hotel',
        type: 'Hotel',
        location: 'Tobermory village',
        address: '2205 Little Tub Rd, Tobermory, ON',
        day: 2,
        phone: '',
        petPolicy: 'Select pet-friendly rooms (verify when booking)',
        familySuitable: true,
        priceRange: '$$$',
        rooms: 'Harbour view suites',
        bookingNote: 'Right in the village — walk to everything. Great base for exploring.',
      },
      {
        name: 'Tobermory Cottage Rentals (VRBO / Airbnb)',
        type: 'Cottage',
        location: 'Tobermory area',
        address: 'Multiple Tobermory-area rentals',
        day: 2,
        phone: '',
        petPolicy: 'Many listings explicitly dog-friendly — filter by "pets allowed"',
        familySuitable: true,
        priceRange: '$$$',
        rooms: '2–4 bedroom cottages, most with private yards',
        bookingNote:
          'Best option for a family of 4 + dog. Private yard for the dog, full kitchen, and the full cottage country experience.',
      },
      {
        name: 'Holiday Inn Express Owen Sound',
        type: 'Hotel',
        location: 'Owen Sound (Day 1 overnight)',
        address: '1130 8th St E, Owen Sound, ON',
        day: 1,
        phone: '',
        petPolicy: 'Pet-friendly with fee',
        familySuitable: true,
        priceRange: '$$',
        rooms: 'Family rooms with pull-out sofa',
        bookingNote: 'Reliable Day 1 overnight option before continuing to Tobermory.',
      },
    ],

    restaurants: [
      {
        name: 'The Fish & Chip Place',
        location: 'Tobermory',
        address: '1350 Old Hwy 17, Tobermory, ON',
        day: 2,
        phone: '',
        cuisine: 'Seafood / Casual',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$',
        mustTry: 'Freshly battered whitefish & chips',
        tip: 'Order at the window and eat on the harbour dock — the dog can join you outside. A Tobermory rite of passage.',
      },
      {
        name: 'Crowsnest Pub & Restaurant',
        location: 'Tobermory',
        address: '5 Bay Street South, Tobermory, ON N0H 2R0, Canada',
        day: 2,
        phone: '',
        cuisine: 'Pub / Canadian',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$',
        mustTry: 'Georgian Bay whitefish sandwich, local craft beer',
        tip: 'Dog-friendly patio steps from the harbour. Good kids menu and reliable home-cooked pub food.',
      },
      {
        name: 'Serenity Now Café',
        location: 'Tobermory',
        address: '1220 Bruce Rd 6, Tobermory, ON',
        day: 2,
        phone: '',
        cuisine: 'Café / Breakfast / Lunch',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$',
        mustTry: 'Breakfast wraps, house-baked muffins, smoothies',
        tip: 'Best morning fuel before a hike to The Grotto. Outdoor seating welcomes dogs.',
      },
      {
        name: 'Inglis Falls Restaurant (Owen Sound)',
        location: 'Owen Sound',
        address: '733 2nd Ave E, Owen Sound, ON',
        day: 1,
        phone: '',
        cuisine: 'Canadian / Casual',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$',
        mustTry: 'Seasonal fish dishes, local produce',
        tip: 'Great lunch stop in Owen Sound on Day 1. Patio seating near the falls area is dog-friendly.',
      },
    ],

    seasonTips: {
      june: 'June in Bruce Peninsula is magical — rare orchids and wildflowers bloom, water is refreshing without peak crowds. Book lodging early as it fills fast by late June.',
      'late-august':
        'Water is warmest for swimming — ideal for kids. This is peak tourist season; book everything 2–3 months in advance and target weekdays for a quieter experience.',
      'early-september':
        "The best-kept secret. Kids back in school means dramatically fewer crowds, lodging is 20–30% cheaper, and hiking weather is perfect. Water still warm enough for swimming. The dog gets the whole beach to themselves.",
    },
  },

  // ─────────────────────────────────────────────
  // TRIP 2 — Muskoka Lakes & Arrowhead
  // ─────────────────────────────────────────────
  {
    id: 'muskoka',
    name: 'Muskoka Lakes & Arrowhead',
    tagline: 'Cottage country classics, thundering waterfalls, and glittering lakes',
    duration: '3–4 days',
    distanceKm: 400,
    driveHoursOneWay: 2.5,
    seasons: ['june', 'late-august', 'early-september'],
    colorFrom: '#059669',
    colorTo: '#16a34a',
    emoji: '🌲',
    highlights: ["Santa's Village", 'Bracebridge Falls', 'Muskoka Lakes', 'Arrowhead PP'],

    route: {
      waypoints: [
        [43.6532, -79.3832],
        [44.3894, -79.6903],
        [44.9195, -79.3703],
        [44.9726, -79.3039],
        [45.3275, -79.2196],
      ],
      stops: [
        {
          name: 'Toronto',
          coords: [43.6532, -79.3832],
          night: null,
          description: 'Depart via Hwy 400 North.',
        },
        {
          name: 'Barrie',
          coords: [44.3894, -79.6903],
          night: null,
          description: 'Rest break ~1 hr from Toronto. Join Hwy 11 northbound toward Muskoka.',
        },
        {
          name: 'Gravenhurst',
          coords: [44.9195, -79.3703],
          night: 1,
          description: 'Gateway to Muskoka. Muskoka Wharf and the RMS Segwun steamship — great for kids. Stroll the harbour with the dog.',
        },
        {
          name: 'Bracebridge',
          coords: [44.9726, -79.3039],
          night: 2,
          description: "Bracebridge Falls is steps from downtown. Santa's Village nearby — a must for families with young kids.",
        },
        {
          name: 'Huntsville',
          coords: [45.3275, -79.2196],
          night: 3,
          description: "Base for Arrowhead Provincial Park. Stubb's Falls trail is an easy family favourite with a spectacular waterfall payoff.",
        },
      ],
      itinerary: [
        {
          day: 1,
          title: 'Toronto → Gravenhurst',
          desc: "Drive ~1.5 hrs via Hwy 400/11. Explore Muskoka Wharf and tour the kids aboard the historic RMS Segwun steamship. Stroll the harbour docks with the dog. Overnight Gravenhurst.",
          driveSteps: [
            'Take Hwy 400 N from Toronto to Barrie (~1 hr)',
            'Merge onto Hwy 11 N toward Orillia and Gravenhurst (~30 min)',
            'Exit at Gravenhurst — follow signs to Muskoka Wharf',
          ],
          legWaypoints: [
            [43.6532, -79.3832],
            [44.3894, -79.6903],
            [44.6458, -79.3752],
            [44.9185, -79.3621],
          ],
        },
        {
          day: 2,
          title: 'Gravenhurst → Bracebridge',
          desc: "20 min drive. Morning at Bracebridge Falls (free, dog-friendly). Afternoon at Santa's Village — summer rides, waterslides, and the kids' favourite. Dog stays comfortably in a cool shaded car during rides.",
          driveSteps: [
            'Take Hwy 11 N from Gravenhurst to Bracebridge (~20 min)',
            'Bracebridge Falls is a 2-min walk from downtown parking',
            'Santa\'s Village is 5 min west on Hwy 118',
          ],
          legWaypoints: [
            [44.9185, -79.3621],
            [45.0397, -79.3097],
          ],
        },
        {
          day: 3,
          title: 'Bracebridge → Huntsville → Arrowhead',
          desc: "Drive 30 min north to Huntsville. Morning hike to Stubb's Falls in Arrowhead Provincial Park — spectacular and easy. Afternoon swim at the park beach.",
          driveSteps: [
            'Take Hwy 11 N from Bracebridge to Huntsville (~25 min)',
            'Continue 8 km north of Huntsville on Hwy 11 to Arrowhead Provincial Park entrance',
            'Park at the Stubb\'s Falls trailhead (1.5 km easy trail)',
          ],
          legWaypoints: [
            [45.0397, -79.3097],
            [45.3283, -79.2183],
            [45.3720, -79.1500],
          ],
        },
        {
          day: 4,
          title: 'Huntsville → Toronto',
          desc: 'Optional morning paddle or Island Lake loop trail. Drive home ~2.5 hrs via Hwy 11/400. Stop in Barrie if needed.',
          driveSteps: [
            'Take Hwy 11 S from Huntsville through Gravenhurst to Barrie (~1.5 hrs)',
            'Optional rest/coffee stop in Barrie',
            'Continue on Hwy 400 S into Toronto (~1 hr)',
          ],
          legWaypoints: [
            [45.3283, -79.2183],
            [44.9185, -79.3621],
            [44.3894, -79.6903],
            [43.6532, -79.3832],
          ],
        },
      ],
    },

    poi: [
      {
        name: 'Muskoka Wharf & RMS Segwun',
        description:
          "Gravenhurst's beautiful waterfront with a historic 1887 steamship you can tour. Boutique shops, restaurants, and a stunning harbour promenade on Lake Muskoka. Kids adore the steamship.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['waterfront', 'historic', 'steamship', 'dining'],
        dogNote:
          'Outdoor wharf areas are dog-friendly. The promenade is a gentle, flat stroll — perfect for a senior dog with views of the lake.',
      },
      {
        name: "Santa's Village",
        description:
          "A classic Ontario family amusement park in Bracebridge with rides, waterslides, Santa's house, and summer activities. Open mid-June through Labour Day.",
        dogFriendly: false,
        kidFriendly: true,
        tags: ['amusement park', 'rides', 'waterslides', 'kids'],
        dogNote:
          'Dogs not permitted inside the park. One adult can walk the dog in the shaded parking area or along a nearby trail while the rest of the family enjoys the park.',
      },
      {
        name: 'Bracebridge Falls',
        description:
          'A beautiful urban waterfall right in downtown Bracebridge — accessible via a short paved path from the town centre. Free to visit, spectacular, and excellent for photos.',
        dogFriendly: true,
        kidFriendly: true,
        tags: ['waterfall', 'scenic', 'free', 'photography', 'downtown'],
        dogNote:
          'Very short walk from parking — flat and accessible. An easy win for the whole family including the senior dog.',
      },
      {
        name: 'Arrowhead Provincial Park',
        description:
          "A stunning park near Huntsville featuring the iconic Stubb's Falls, clear-water lakes with sandy beaches, and excellent beginner trails through mixed Muskoka forest.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['provincial park', 'waterfall', 'swimming', 'trails', 'beach'],
        dogNote:
          'Dogs allowed on leash throughout the park including trails and campground. The beach area and trail edges offer cool water for dogs to drink and wade.',
      },
      {
        name: 'Port Carling & the Muskoka Locks',
        description:
          "The 'hub of the lakes' — a charming village at the junction of Lakes Muskoka, Rosseau, and Joseph. Watch boats lock through the canal, browse boutiques, and grab a waterfront lunch.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['village', 'locks', 'waterfront', 'lunch', 'boats'],
        dogNote:
          'Dog-friendly patios at several restaurants. Kids love watching the boats navigate the lock — a great free activity.',
      },
    ],

    trails: [
      {
        name: "Stubb's Falls Trail",
        lengthKm: 1.6,
        difficulty: 'easy',
        surface: 'Packed gravel with some flat rock',
        dogFriendly: true,
        kidFriendly: true,
        duration: '30–45 min',
        seniorDogNote:
          'Short, rewarding, and mostly flat with a gentle slope near the falls. Take it slowly and enjoy. A few flat rocks near the waterfall base to rest on.',
        description:
          "Arrowhead Provincial Park's signature trail leads to a gorgeous multi-tiered waterfall on the Big East River. One of the most rewarding short hikes in Muskoka for any age.",
      },
      {
        name: 'Island Lake Loop (Arrowhead PP)',
        lengthKm: 3.0,
        difficulty: 'easy',
        surface: 'Forested path',
        dogFriendly: true,
        kidFriendly: true,
        duration: '45–60 min',
        seniorDogNote:
          'Mostly flat with gentle undulation through the forest. Shaded and cool even in August. Multiple rest spots by the lakeside.',
        description:
          'A peaceful loop around Island Lake inside Arrowhead Provincial Park. Lovely birdwatching, wildflower meadows in early season, and calm lake reflections.',
      },
      {
        name: 'Muskoka River Trail, Bracebridge',
        lengthKm: 4.0,
        difficulty: 'easy',
        surface: 'Paved + packed gravel',
        dogFriendly: true,
        kidFriendly: true,
        duration: '60–80 min',
        seniorDogNote:
          'Completely flat riverside trail with benches throughout. Ideal for a senior dog at any pace — go as far as comfortable and turn back.',
        description:
          'A lovely flat trail following the Muskoka River through Bracebridge. Passes the falls, parkland, and scenic river bends. Good for bikes too if you have them.',
      },
    ],

    lodging: [
      {
        name: 'Deerhurst Resort',
        type: 'Resort',
        location: 'Huntsville',
        petPolicy: 'Pet-friendly rooms and cottages available (fee applies)',
        familySuitable: true,
        priceRange: '$$$',
        rooms: 'Hotel rooms, suites, and private lakeside cottages',
        bookingNote:
          'Excellent family resort — pools, beach, children\'s activities, and Arrowhead Park minutes away. Book pet-friendly cottages for the best dog experience.',
      },
      {
        name: 'Muskoka Cottage Rentals (VRBO / Airbnb)',
        type: 'Cottage',
        location: 'Throughout Muskoka',
        petPolicy: 'Many dog-friendly listings — filter by "pets allowed"',
        familySuitable: true,
        priceRange: '$$$',
        rooms: '2–4 bedroom lakefront cottages with private docks',
        bookingNote:
          'The quintessential Muskoka experience. Private dock, canoe, fire pit. Book 3–6 months ahead for summer weekends.',
      },
      {
        name: 'Comfort Inn / Holiday Inn Huntsville',
        type: 'Hotel',
        location: 'Huntsville',
        petPolicy: 'Pet-friendly with fee',
        familySuitable: true,
        priceRange: '$$',
        rooms: 'Family rooms available',
        bookingNote: 'Budget-friendly base close to Arrowhead Park. Good pool for the kids.',
      },
      {
        name: 'Taboo Muskoka Resort',
        type: 'Resort',
        location: 'Gravenhurst',
        petPolicy: 'Select pet-friendly accommodations available',
        familySuitable: true,
        priceRange: '$$$$',
        rooms: 'Lakefront cottages and resort suites',
        bookingNote: 'Upscale option with stunning Lake Muskoka views. Excellent restaurant and spa.',
      },
    ],

    restaurants: [
      {
        name: 'ReBar Modern Food',
        location: 'Huntsville',
        cuisine: 'Contemporary Canadian',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$',
        mustTry: 'Local fish tacos, seasonal grain bowls',
        tip: 'Dog-friendly patio on Main Street Huntsville. One of the best kitchens in cottage country.',
      },
      {
        name: 'Hunter & Pepper Eatery',
        location: 'Huntsville',
        cuisine: 'Café / Brunch',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$',
        mustTry: 'Eggs Benedict, house-roasted coffee',
        tip: 'Perfect morning fuel before Arrowhead. Small outdoor patio welcomes leashed dogs.',
      },
      {
        name: "Muskoka Brewery Taproom",
        location: 'Bracebridge',
        cuisine: 'Brewery / Pub',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$',
        mustTry: 'Muskoka Detour IPA, brewery nachos',
        tip: "Outdoor patio at the original Bracebridge taproom is dog-friendly. Kids love watching the waterfall next door.",
      },
      {
        name: 'Turtle Jack\'s Muskoka Grill',
        location: 'Gravenhurst',
        cuisine: 'Canadian / Casual',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$',
        mustTry: 'Muskoka whitefish, ribs, kids menu',
        tip: 'Waterfront patio on the Muskoka Wharf welcomes dogs. Great first-night dinner with lake views.',
      },
    ],

    seasonTips: {
      june:
        "Early summer in Muskoka is stunning but blackflies can be fierce the first two weeks of June — pack bug spray. After mid-June it's glorious. Santa's Village opens mid-June.",
      'late-august':
        'Peak cottage season — lakes are warm, everything is open, and the evenings are magical. Book 3+ months in advance. Weekdays are far more relaxed than weekends.',
      'early-september':
        'Arguably the best time to visit Muskoka. School is back, resorts quiet right down, prices drop noticeably, and the first hints of fall colour appear in the maples. Arrowhead Park is stunning.',
    },
  },

  // ─────────────────────────────────────────────
  // TRIP 3 — Prince Edward County
  // ─────────────────────────────────────────────
  {
    id: 'pec',
    name: 'Prince Edward County',
    tagline: 'Windswept dunes, farm-to-table wineries, and small-town charm',
    duration: '3 days',
    distanceKm: 500,
    driveHoursOneWay: 2.5,
    seasons: ['late-august', 'early-september'],
    colorFrom: '#d97706',
    colorTo: '#ea580c',
    emoji: '🍷',
    highlights: ['Sandbanks Provincial Park', 'Kingston Waterfront', 'Picton Village', 'County Wineries'],

    route: {
      waypoints: [
        [43.6532, -79.3832],
        [44.1623, -77.3832],
        [44.2312, -76.4860],
        [44.0082, -77.1386],
      ],
      stops: [
        {
          name: 'Toronto',
          coords: [43.6532, -79.3832],
          night: null,
          description: 'Depart via Hwy 401 East.',
        },
        {
          name: 'Belleville',
          coords: [44.1623, -77.3832],
          night: null,
          description: 'Rest stop ~2 hrs from Toronto. Lunch option before crossing into the County.',
        },
        {
          name: 'Kingston',
          coords: [44.2312, -76.4860],
          night: 1,
          description: "Historic limestone city at Lake Ontario's eastern end. Fort Henry, waterfront, and excellent dining.",
        },
        {
          name: 'Picton (The County)',
          coords: [44.0082, -77.1386],
          night: 2,
          description: 'Hub of Prince Edward County. Sandbanks dunes, local wineries, farm markets, and charming main street.',
        },
      ],
      itinerary: [
        {
          day: 1,
          title: 'Toronto → Kingston',
          desc: 'Drive ~2.5 hrs via Hwy 401 E. Afternoon at Kingston waterfront — Fort Henry National Historic Site for the kids (outdoor grounds are dog-friendly). Evening stroll along the Lake Ontario waterfront path.',
          driveSteps: [
            'Take Hwy 401 E from Toronto through Oshawa and Belleville (~2.5 hrs)',
            'Exit at Division St (Kingston) and follow signs to downtown waterfront',
            'Fort Henry is on Hwy 2 E, just across the La Salle Causeway',
          ],
          legWaypoints: [
            [43.6532, -79.3832],
            [43.8971, -78.8658],
            [44.1340, -77.3993],
            [44.2307, -76.4950],
          ],
        },
        {
          day: 2,
          title: 'Kingston → Prince Edward County',
          desc: 'Cross the Bay of Quinte bridge (30 min). Morning in Picton village. Afternoon at Sandbanks — dunes walk with the dog, beach swim for the kids (note dog restrictions on main beaches). Winery patio in the evening.',
          driveSteps: [
            'Take Hwy 33 W from Kingston across the Glenora Ferry or Bay Bridge (~30 min)',
            'Follow County Rd 49 into Picton for the village morning',
            'Head south on County Rd 12 to Sandbanks Provincial Park entrance',
          ],
          legWaypoints: [
            [44.2307, -76.4950],
            [44.1003, -77.0220],
            [44.0081, -77.1380],
            [43.9174, -77.2432],
          ],
        },
        {
          day: 3,
          title: 'County → Toronto',
          desc: 'Morning at Macaulay Mountain Conservation Area or a farm market run. Drive home via Hwy 401 W, ~2.5 hrs.',
          driveSteps: [
            'Head back to Kingston via County Rd 49 and Hwy 33 (~30 min)',
            'Join Hwy 401 W at Kingston toward Toronto',
            'Optional stop in Oshawa or Ajax (~2 hrs from Kingston)',
            'Continue on 401 W into Toronto (~2.5 hrs total)',
          ],
          legWaypoints: [
            [44.0081, -77.1380],
            [44.2307, -76.4950],
            [44.1340, -77.3993],
            [43.8971, -78.8658],
            [43.6532, -79.3832],
          ],
        },
      ],
    },

    poi: [
      {
        name: 'Sandbanks Provincial Park',
        description:
          "Home to the world's largest freshwater sand bar dune system. Three beaches: Outlet, West Lake, and Sandbanks Beach. Extraordinary swimming and dune walking.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['beach', 'dunes', 'swimming', 'provincial park'],
        dogNote:
          'IMPORTANT: Dogs NOT allowed on the main beaches (Outlet, West Lake, Sandbanks Beach) during peak season (late June – Labour Day). Dogs ARE allowed in the dune area trails and campground loops. Plan for one adult to walk the dog on the dunes trail while others swim.',
      },
      {
        name: 'Fort Henry National Historic Site',
        description:
          "A beautifully restored 1832 British fort overlooking Kingston Harbour. Guided tours, cannon firings, costumed interpreters, and stunning views across the water. Kids absolutely love it.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['historic', 'fort', 'museum', 'views', 'cannons'],
        dogNote:
          'Outdoor grounds and ramparts are dog-friendly on leash. Check with staff about interior access when you arrive.',
      },
      {
        name: 'Picton Village & Main Street',
        description:
          "A charming small town with artisan shops, the beloved Books & Company bookstore, bakeries, and the County's best brunch restaurants. Very walkable.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['village', 'dining', 'shopping', 'artisan', 'brunch'],
        dogNote:
          'One of the most dog-friendly towns in Ontario. Water bowls outside shops, pet welcome signs everywhere, and outdoor patios that genuinely welcome dogs.',
      },
      {
        name: 'County Wineries (Norman Hardie, Hinterland)',
        description:
          "Prince Edward County is Ontario's most exciting emerging wine region. Many wineries have beautiful outdoor patios, farm animals for kids to see, and tasting experiences.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['wine', 'farm', 'patio', 'tasting', 'outdoors'],
        dogNote:
          'Most winery outdoor patios welcome leashed dogs. Norman Hardie Winery is particularly welcoming — large gravel yard, farm setting, and very dog-friendly staff.',
      },
      {
        name: 'Lake on the Mountain Provincial Park',
        description:
          'A fascinating natural mystery — a lake perched high above the Bay of Quinte with no visible water source. A short walk reveals spectacular panoramic views. Free to visit.',
        dogFriendly: true,
        kidFriendly: true,
        tags: ['scenic', 'views', 'geological', 'free', 'quick stop'],
        dogNote:
          'Very short flat walk from the parking area. Ideal for a senior dog — essentially just a stroll to an extraordinary viewpoint.',
      },
    ],

    trails: [
      {
        name: 'Lake on the Mountain Lookout Walk',
        lengthKm: 0.5,
        difficulty: 'easy',
        surface: 'Paved path',
        dogFriendly: true,
        kidFriendly: true,
        duration: '10–15 min',
        seniorDogNote:
          'Barely a walk — completely flat and paved. Perfect for any dog. Just a short stroll to a remarkable viewpoint over the Bay of Quinte.',
        description:
          'A very short accessible walk to the incredible Lake on the Mountain overlook. Panoramic views of the Bay of Quinte, Adolphus Reach, and the surrounding countryside.',
      },
      {
        name: 'Macaulay Mountain Conservation Area',
        lengthKm: 3.0,
        difficulty: 'easy',
        surface: 'Forested trail with some gentle slopes',
        dogFriendly: true,
        kidFriendly: true,
        duration: '50–70 min',
        seniorDogNote:
          'Gentle slopes but mostly well-maintained forested trail. Shaded and cool. Benches near the hilltop lookout. Take it slow — the payoff view is worth it.',
        description:
          'A lovely network of trails through hardwood forest just outside Picton, featuring a hilltop lookout tower with sweeping views over Prince Edward County.',
      },
      {
        name: 'Sandbanks Dunes Trail',
        lengthKm: 1.5,
        difficulty: 'easy',
        surface: 'Sand (soft)',
        dogFriendly: true,
        kidFriendly: true,
        duration: '30–45 min',
        seniorDogNote:
          'Soft sand is tiring for senior dogs. Bring plenty of water and do this in the cooler morning. The dune scenery is unlike anything else in Ontario.',
        description:
          "Walk through Sandbanks' remarkable dune ecosystem — towering sand formations, unique dune grasses, and sweeping lake vistas. Dogs allowed here (not on the adjacent beach).",
      },
    ],

    lodging: [
      {
        name: 'The Drake Devonshire',
        type: 'Boutique Hotel',
        location: 'Wellington, PEC',
        petPolicy: 'Dogs warmly welcomed — pet-friendly throughout',
        familySuitable: true,
        priceRange: '$$$',
        rooms: 'Boutique rooms, some with lake views; family-suitable rooms available',
        bookingNote:
          "One of Ontario's best boutique hotels. Great restaurant, waterfront location, and genuinely dog-friendly. Book 2–3 months ahead for summer.",
      },
      {
        name: "Angeline's Inn & Spa",
        type: 'Inn / B&B',
        location: 'Bloomfield, PEC',
        petPolicy: 'Pet-friendly rooms available — confirm at booking',
        familySuitable: true,
        priceRange: '$$$',
        rooms: 'Rooms and suites in a restored Victorian inn',
        bookingNote: 'Beautiful property in the heart of Bloomfield village. Excellent breakfast.',
      },
      {
        name: 'Prince Edward County Cottage Rentals',
        type: 'Cottage / Farmstay',
        location: 'Throughout The County',
        petPolicy: 'Many dog-friendly options — search "pets allowed" on VRBO / Airbnb',
        familySuitable: true,
        priceRange: '$$$',
        rooms: '2–4 bedroom farm or lakefront cottages',
        bookingNote:
          'Best for families — open rural space for the dog to roam, privacy, and full kitchen. Many farm properties welcome dogs enthusiastically.',
      },
      {
        name: 'Holiday Inn Express Belleville',
        type: 'Hotel',
        location: 'Belleville (en route)',
        petPolicy: 'Pet-friendly with fee',
        familySuitable: true,
        priceRange: '$$',
        rooms: 'Family rooms available',
        bookingNote: 'Budget-friendly overnight option if you want to break up the drive from Toronto.',
      },
    ],

    restaurants: [
      {
        name: 'The Drake Devonshire Restaurant',
        location: 'Wellington, PEC',
        cuisine: 'Contemporary Canadian / Farm-to-Table',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$$',
        mustTry: 'Lake Ontario pickerel, County vegetable dishes, Ontario wine list',
        tip: "The flagship County dining experience. Waterfront patio is dog-friendly. Book ahead for dinner — this is the trip's best meal.",
      },
      {
        name: 'Parsons Brewing Company',
        location: 'Picton, PEC',
        cuisine: 'Brewery / Pub',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$',
        mustTry: 'Local craft ales, wood-fired flatbreads',
        tip: 'Large dog-friendly patio in Picton. Relaxed family atmosphere with a great kids menu.',
      },
      {
        name: 'Agrarian Market & Café',
        location: 'Picton, PEC',
        cuisine: 'Local Café / Farm Market',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$',
        mustTry: 'House-roasted coffee, County honey, fresh pastries',
        tip: 'Perfect morning stop in Picton. Outdoor seating welcomes dogs. Pick up local provisions for the drive home.',
      },
      {
        name: 'Norman Hardie Winery & Restaurant',
        location: 'Prince Edward County',
        cuisine: 'Winery / Farm Lunch',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$$',
        mustTry: 'Wood-fired pizza, County charcuterie, Pinot Noir',
        tip: 'Among the most dog-friendly wineries in Ontario. Large gravel yard with farm animals kids love. Arrive before noon on weekends.',
      },
    ],

    seasonTips: {
      june:
        "June is lovely and uncrowded in the County. Water isn't quite warm enough for swimming but wineries are open and the countryside is lush green. Sandbanks dunes are uncrowded.",
      'late-august':
        "Peak season — everything is open and buzzing. Wineries are busy with harvest prep. Sandbanks beaches are at their best but very busy. Book 2–3 months in advance.",
      'early-september':
        'The absolute best time to visit the County. Harvest season begins — farm markets overflow with corn, tomatoes, peaches, and wine grapes. Winery harvest events, fewer tourists, golden light, and cooler temps. Worth every km of the drive.',
    },
  },

  // ─────────────────────────────────────────────
  // TRIP 4 — Ottawa & Gatineau Park
  // ─────────────────────────────────────────────
  {
    id: 'ottawa',
    name: 'Ottawa & Gatineau Park, QC',
    tagline: "Canada's capital, world-class museums, and Québec fall colours",
    duration: '4 days',
    distanceKm: 900,
    driveHoursOneWay: 4.5,
    seasons: ['june', 'late-august', 'early-september'],
    colorFrom: '#dc2626',
    colorTo: '#e11d48',
    emoji: '🍁',
    highlights: ['Parliament Hill', 'ByWard Market', 'Gatineau Park', 'Rideau Canal'],

    route: {
      waypoints: [
        [43.6532, -79.3832],
        [44.2312, -76.4860],
        [45.4215, -75.6972],
        [45.4765, -75.7013],
      ],
      stops: [
        {
          name: 'Toronto',
          coords: [43.6532, -79.3832],
          night: null,
          description: 'Depart via Hwy 401 East. Leave by 7 am to arrive Kingston for a late lunch.',
        },
        {
          name: 'Kingston',
          coords: [44.2312, -76.4860],
          night: 1,
          description: "Historic limestone city. Break up the drive with a night here. 1000 Islands boat cruise is a highlight for families.",
        },
        {
          name: 'Ottawa',
          coords: [45.4215, -75.6972],
          night: 2,
          description: "Canada's capital. Parliament, ByWard Market, Rideau Canal, world-class museums. Two nights here gives you enough time.",
        },
        {
          name: 'Gatineau, QC',
          coords: [45.4765, -75.7013],
          night: 3,
          description: 'Cross the bridge into Québec. Gatineau Park offers gorgeous trails and Pink Lake. Day trip, then back through Ottawa to start the drive home.',
        },
      ],
      itinerary: [
        {
          day: 1,
          title: 'Toronto → Kingston',
          desc: 'Drive 2.5 hrs via Hwy 401 E. Afternoon at Kingston Waterfront — Fort Henry National Historic Site for the kids (outdoor grounds dog-friendly). Evening stroll along the Lake Ontario waterfront.',
          driveSteps: [
            'Take Hwy 401 E from Toronto through Oshawa (~1 hr)',
            'Continue east through Belleville to Kingston (~1.5 hrs more)',
            'Exit Division St into downtown Kingston',
          ],
          legWaypoints: [
            [43.6532, -79.3832],
            [43.8971, -78.8658],
            [44.1340, -77.3993],
            [44.2307, -76.4950],
          ],
        },
        {
          day: 2,
          title: 'Kingston → Ottawa',
          desc: 'Drive 2 hrs via Hwy 401/416. Check in and explore Parliament Hill, walk to ByWard Market (incredible for foodies!), and evening stroll along the Rideau Canal pathway with the dog.',
          driveSteps: [
            'Take Hwy 401 E from Kingston to the Hwy 416 N junction at Prescott (~45 min)',
            'Follow Hwy 416 N directly into Ottawa (~45 min)',
            'Exit at Bronson Ave toward downtown / Parliament Hill',
          ],
          legWaypoints: [
            [44.2307, -76.4950],
            [44.7151, -75.5222],
            [45.2733, -75.8577],
            [45.4215, -75.6972],
          ],
        },
        {
          day: 3,
          title: 'Ottawa Museums + Gatineau Park',
          desc: 'Morning at Canadian Museum of Nature (kids\' favourite — plan for one adult with dog at nearby Dundonald Park). Afternoon drive to Gatineau Park, QC — Pink Lake lookout trail and a picnic.',
          driveSteps: [
            'Canadian Museum of Nature is 10 min walk from Parliament Hill (or drive on Metcalfe St)',
            'Cross the Alexandra Bridge or Macdonald-Cartier Bridge into Gatineau (~10 min)',
            'Follow Blvd Taché to Gatineau Park — Pink Lake trailhead is 15 min from the bridge',
          ],
          legWaypoints: [
            [45.4215, -75.6972],
            [45.4765, -75.7013],
            [45.5317, -75.8477],
          ],
        },
        {
          day: 4,
          title: 'Ottawa → Kingston → Toronto',
          desc: 'Morning stroll along Ottawa River Pathway. Drive home ~4.5 hrs via Hwy 416/401. Optional stop in Kingston for coffee.',
          driveSteps: [
            'Take Hwy 416 S from Ottawa to the 401 junction at Prescott (~45 min)',
            'Follow Hwy 401 W through Kingston (~45 min) — optional coffee stop',
            'Continue on Hwy 401 W through Belleville, Oshawa to Toronto (~2.5 hrs)',
          ],
          legWaypoints: [
            [45.4215, -75.6972],
            [44.7151, -75.5222],
            [44.2307, -76.4950],
            [43.8971, -78.8658],
            [43.6532, -79.3832],
          ],
        },
      ],
    },

    poi: [
      {
        name: 'Parliament Hill',
        description:
          "Canada's iconic Gothic Revival government buildings overlooking the Ottawa River. Free guided tours of Centre Block (when available), plus the colourful Changing of the Guard ceremony on the lawn every summer morning.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['landmark', 'history', 'free', 'photography', 'ceremony'],
        dogNote:
          'The outdoor grounds and viewing lawn are dog-friendly on leash. The Changing of the Guard ceremony is excellent for the whole family — dogs welcome on the grassy viewing areas.',
      },
      {
        name: 'ByWard Market',
        description:
          "Ottawa's famous outdoor market neighbourhood. Fresh produce, artisan baked goods, BeaverTails pastry stands, great restaurants, and a lively street atmosphere perfect for a family breakfast or lunch.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['market', 'food', 'outdoor', 'BeaverTails', 'lively'],
        dogNote:
          'Outdoor market areas are very dog-friendly. BeaverTails stand is a must — dogs get pets from every passerby. Most patios welcome leashed dogs.',
      },
      {
        name: 'Canadian Museum of Nature',
        description:
          "One of Canada's finest natural history museums. Incredible dinosaur fossil gallery, gem and mineral hall, Arctic exhibit, and hands-on children's discovery zone. A full half-day for families.",
        dogFriendly: false,
        kidFriendly: true,
        tags: ['museum', 'dinosaurs', 'science', 'kids', 'gems'],
        dogNote:
          'Dogs not permitted inside. Plan for one adult to stay with dog at nearby Dundonald Park (an excellent off-leash park just 3 min walk away) while others visit the museum.',
      },
      {
        name: 'Gatineau Park, Québec',
        description:
          "A 361 km² national park just across the Ottawa River in Québec. Pink Lake is a meromictic lake with stunning turquoise colour. Lookout trails, swimming lakes, and the earliest fall colours in the region starting in early September.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['national park', 'lake', 'trails', 'Quebec', 'scenic', 'fall colours'],
        dogNote:
          'Dogs allowed on leash on most Gatineau Park trails. Pink Lake lookout trail is easy and spectacular. Bring water — trails can be warm in August.',
      },
      {
        name: 'Rideau Canal Pathway',
        description:
          'A flat, paved multi-use pathway running 7.8 km along the Rideau Canal through the heart of Ottawa. Cyclists, joggers, families, and dogs at all hours. Beautiful at golden hour.',
        dogFriendly: true,
        kidFriendly: true,
        tags: ['pathway', 'canal', 'cycling', 'flat', 'sunset', 'UNESCO'],
        dogNote:
          "One of the best dog walks in Canada. Completely flat and paved, with water fountains and benches throughout. Perfect for a senior dog at whatever pace works.",
      },
    ],

    trails: [
      {
        name: 'Pink Lake Lookout Trail (Gatineau Park)',
        lengthKm: 2.8,
        difficulty: 'easy',
        surface: 'Gravel path with some stone steps',
        dogFriendly: true,
        kidFriendly: true,
        duration: '45–60 min',
        seniorDogNote:
          "Mostly gentle with a few short stone steps near the main overlook. The stunning view of Pink Lake's extraordinary turquoise colour is worth every step. Bring water.",
        description:
          'A beloved short loop in Gatineau Park overlooking Pink Lake — a meromictic lake whose layers never mix, producing a striking blue-green colour. One of the most photographed spots in the National Capital Region.',
      },
      {
        name: 'Ottawa River Pathway',
        lengthKm: 7.8,
        difficulty: 'easy',
        surface: 'Paved',
        dogFriendly: true,
        kidFriendly: true,
        duration: 'Walk as much or as little as you like',
        seniorDogNote:
          "Completely flat and paved with benches and water fountains the entire length. Do 1 km or 5 km — there's no wrong answer for a senior dog.",
        description:
          'A scenic flat pathway along the Ottawa River with views of Parliament Hill, Gatineau Hills, and the wide river. Walk or bike. The finest riverside path in the National Capital Region.',
      },
      {
        name: 'Sugarbush Trail (Gatineau Park)',
        lengthKm: 2.0,
        difficulty: 'easy',
        surface: 'Forested path',
        dogFriendly: true,
        kidFriendly: true,
        duration: '30–45 min',
        seniorDogNote:
          'Gentle rolling forest trail through maple trees. Beautiful green canopy in summer, exceptional gold and red in early September. Cool and shaded.',
        description:
          'A pleasant loop through a classic hardwood sugar maple forest in Gatineau Park. Interpretive signs explain the maple syrup production cycle. Early September brings spectacular colour.',
      },
    ],

    lodging: [
      {
        name: 'Fairmont Château Laurier',
        type: 'Luxury Hotel',
        location: 'Downtown Ottawa (next to Parliament)',
        petPolicy: 'Pet-friendly — dogs receive a welcome amenity package',
        familySuitable: true,
        priceRange: '$$$$',
        rooms: 'Classic rooms, suites, and family configurations',
        bookingNote:
          "An iconic Canadian experience beside Parliament Hill. The splurge is absolutely worth it for a special family trip. Dogs treated like royalty.",
      },
      {
        name: 'Alt Hotel Ottawa',
        type: 'Boutique Hotel',
        location: 'Downtown Ottawa',
        petPolicy: 'Pet-friendly',
        familySuitable: true,
        priceRange: '$$$',
        rooms: 'Modern rooms, good family layout options',
        bookingNote: 'Stylish, well-located, and genuinely dog-friendly. Walking distance to Parliament and ByWard Market.',
      },
      {
        name: 'Homewood Suites Ottawa',
        type: 'Extended Stay Hotel',
        location: 'Ottawa',
        petPolicy: 'Pet-friendly with fee',
        familySuitable: true,
        priceRange: '$$',
        rooms: 'Suite-style rooms with full kitchenette and separate living area',
        bookingNote:
          'Best value for families — full kitchen, separate living space, and free breakfast. More room for kids and the dog to spread out.',
      },
      {
        name: 'Delta Hotels Kingston Waterfront',
        type: 'Hotel',
        location: 'Kingston (Day 1 overnight)',
        petPolicy: 'Pet-friendly',
        familySuitable: true,
        priceRange: '$$$',
        rooms: 'Waterfront rooms with harbour views',
        bookingNote: 'Superb location right on Kingston Harbour. Kids love watching the boats and ferries from the room.',
      },
    ],

    restaurants: [
      {
        name: "Zak's Diner",
        location: 'Ottawa (ByWard Market)',
        cuisine: 'Classic Canadian Diner',
        dogFriendly: false,
        kidFriendly: true,
        priceRange: '$',
        mustTry: 'Poutine, all-day breakfast, milkshakes',
        tip: "A ByWard Market institution. Kids love the diner vibe. Get takeout and eat at Major's Hill Park with the dog — 3 min walk away.",
      },
      {
        name: 'The Manx Pub',
        location: 'Ottawa',
        cuisine: 'Pub / Canadian',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$',
        mustTry: 'Burgers, local craft beer, nachos',
        tip: "One of Ottawa's most dog-friendly patios. Laid-back and welcoming for families.",
      },
      {
        name: 'Pure Kitchen',
        location: 'Ottawa',
        cuisine: 'Healthy / Plant-forward',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$',
        mustTry: 'Buddha bowls, smoothies, grain salads',
        tip: 'Great healthy option mid-trip. Outdoor seating welcomes dogs. Good for refuelling after a big Gatineau hike.',
      },
      {
        name: 'Beckta Dining & Wine',
        location: 'Ottawa',
        cuisine: 'Contemporary Canadian / Fine Dining',
        dogFriendly: false,
        kidFriendly: false,
        priceRange: '$$$$',
        mustTry: 'Chef\'s tasting menu, Ontario wine pairings',
        tip: "Ottawa's best special-occasion restaurant. Adults-only dinner while kids are settled for the night. Book weeks ahead.",
      },
    ],

    seasonTips: {
      june:
        "Ottawa in June is spectacular — the world-famous Canadian Tulip Festival may still be winding down, Parliament tours are fully running, and Gatineau Park trails are lush and green. Warm days and cool evenings.",
      'late-august':
        'Hot and busy. ByWard Market is at its most vibrant. Rideau Canal pathway is stunning at sunset. Book hotels 2+ months ahead — Ottawa is a busy summer destination.',
      'early-september':
        "Early fall colours begin in Gatineau Park — the maples turn gold and red starting in the hills. Crowds thin dramatically after Labour Day. Cooler temps make hiking far more comfortable for dogs and kids alike. Ottawa's best-kept seasonal secret.",
    },
  },

  // ─────────────────────────────────────────────
  // TRIP 5 — Eastern Canada Grand Circuit (7 days)
  // Toronto → Kingston → Ottawa → Montréal → PEC → Toronto
  // ─────────────────────────────────────────────
  {
    id: 'eastern-circuit',
    name: 'Eastern Canada Grand Circuit',
    tagline: 'Kingston · Ottawa · Montréal · Prince Edward County — the ultimate eastern loop',
    duration: '7 days',
    distanceKm: 1200,
    driveHoursOneWay: 10.5, // total driving across full loop
    seasons: ['june', 'late-august', 'early-september'],
    colorFrom: '#7c3aed',
    colorTo: '#4f46e5',
    emoji: '🗺️',

    tripProfile: {
      passengers: '2 adults, 2 children',
      pet: 'Samoyed, ~50 lbs',
      vehicle: 'Van with roof rack',
      dogBreedNote:
        'Samoyeds have a thick double coat built for Arctic conditions — they overheat quickly in summer. Schedule all hikes for early morning (before 10 am) or evening. Bring a collapsible bowl and extra water at all times. Avoid hot pavement (burns paw pads — use the back of your hand to test). Never leave in a parked car. A cooling mat in the van is a great investment.',
    },

    route: {
      waypoints: [
        [43.6532, -79.3832],
        [44.2312, -76.4860],
        [45.4215, -75.6972],
        [45.5017, -73.5673],
        [44.0082, -77.1386],
        [43.6532, -79.3832],
      ],
      googleMapsUrl:
        'https://www.google.com/maps/dir/Toronto,+Ontario/Kingston,+Ontario/Ottawa,+Ontario/Montreal,+Quebec/Prince+Edward+County,+Ontario/Toronto,+Ontario',
      stops: [
        {
          name: 'Toronto',
          coords: [43.6532, -79.3832],
          night: null,
          description: 'Departure. Pack the van the evening before. Leave by 7:30 am to beat 401 traffic.',
        },
        {
          name: 'Kingston',
          coords: [44.2312, -76.4860],
          night: 1,
          description: "Canada's first capital. Historic limestone city on Lake Ontario. Fort Henry, waterfront, and great restaurants.",
        },
        {
          name: 'Ottawa',
          coords: [45.4215, -75.6972],
          night: 2,
          description: "Canada's capital for two nights. Parliament Hill, ByWard Market, Rideau Canal, and Gatineau Park.",
        },
        {
          name: 'Ottawa (Night 2)',
          coords: [45.4265, -75.6872],
          night: 3,
          description: 'Second Ottawa night — day trip to Gatineau Park, QC.',
        },
        {
          name: 'Montréal',
          coords: [45.5017, -73.5673],
          night: 4,
          description: "Canada's cultural capital for two nights. Old Montréal, Mount Royal, Lachine Canal, and legendary food.",
        },
        {
          name: 'Montréal (Night 2)',
          coords: [45.5067, -73.5623],
          night: 5,
          description: 'Second Montréal night — full city exploration day.',
        },
        {
          name: 'Prince Edward County',
          coords: [44.0082, -77.1386],
          night: 6,
          description: 'The County — wineries, Sandbanks, Picton village. Last overnight before heading home.',
        },
        {
          name: 'Toronto',
          coords: [43.6532, -79.3832],
          night: null,
          description: 'Home. 2.5 hr drive west via Hwy 401. Back by early afternoon.',
        },
      ],
      itinerary: [
        {
          day: 1,
          title: 'Toronto → Kingston  |  263 km · 2.5 hrs',
          desc: "Easy first driving day. Arrive Kingston by late morning. Grab lunch at Pan Chancho Bakery. Afternoon at Fort Henry National Historic Site with the kids — outdoor ramparts and cannon firings. Evening waterfront walk with the dog along Lake Ontario. Early dinner at The Merchant Taphouse.",
          driveSegments: [
            {
              from: 'Toronto',
              to: 'Port Hope / Cobourg',
              distance: '110 km',
              time: '1-1.25 hrs',
              note: 'Quick stretch, washroom, and dog-water stop before the longer 401 run.',
            },
            {
              from: 'Port Hope / Cobourg',
              to: 'Kingston',
              distance: '150 km',
              time: '1.5 hrs',
              note: 'Finish the main leg and arrive with enough time for lunch and Fort Henry.',
            },
          ],
          driveSteps: [
            'Take Hwy 401 E from Toronto through Oshawa (~1 hr)',
            'Continue through Belleville to Kingston exit (Division St) (~1.5 hrs more)',
            'Fort Henry is 5 min from downtown on Hwy 2 E across La Salle Causeway',
          ],
          legWaypoints: [
            [43.6532, -79.3832],
            [43.8971, -78.8658],
            [44.1340, -77.3993],
            [44.2307, -76.4950],
          ],
        },
        {
          day: 2,
          title: 'Kingston → Ottawa  |  195 km · 2 hrs',
          desc: "Morning drive along the 401/416. Check in and drop bags. Afternoon: Parliament Hill and the Changing of the Guard ceremony (dog welcome on the lawn). Walk the Rideau Canal Pathway. ByWard Market for a late lunch — BeaverTails are mandatory. Evening at Major's Hill Park with great views of the Château Laurier.",
          driveSegments: [
            {
              from: 'Kingston',
              to: 'Prescott / Hwy 416 junction',
              distance: '95 km',
              time: '1 hr',
              note: 'Simple highway segment with a good reset before turning north.',
            },
            {
              from: 'Prescott / Hwy 416 junction',
              to: 'Ottawa',
              distance: '100 km',
              time: '1 hr',
              note: 'Direct run into the city; aim to arrive before downtown afternoon traffic.',
            },
          ],
          driveSteps: [
            'Take Hwy 401 E from Kingston to Hwy 416 N junction at Prescott (~45 min)',
            'Follow Hwy 416 N directly into Ottawa (~45 min)',
            'Exit Bronson Ave toward Parliament Hill / downtown core',
          ],
          legWaypoints: [
            [44.2307, -76.4950],
            [44.7151, -75.5222],
            [45.2733, -75.8577],
            [45.4215, -75.6972],
          ],
        },
        {
          day: 3,
          title: 'Ottawa + Gatineau Park  |  No driving (day trips only)',
          desc: "Full Ottawa day. Morning: Canadian Museum of Nature for kids — one adult takes the dog to nearby Dundonald Park (excellent off-leash area). Afternoon: drive 15 min to Gatineau Park, QC for the Pink Lake lookout trail (bring lots of water for the Samoyed). Evening: Ottawa River Pathway sunset walk.",
          driveSteps: [
            'Museum of Nature: 240 McLeod St — 10 min walk from Parliament or drive on Metcalfe',
            'Cross Alexandra Bridge into Gatineau (~10 min)',
            'Follow Blvd Taché to Gatineau Park — Pink Lake trailhead is 15 min from bridge',
            'Return via same bridge for evening walk on Ottawa River Pathway',
          ],
          legWaypoints: [
            [45.4215, -75.6972],
            [45.4765, -75.7013],
            [45.5317, -75.8477],
          ],
        },
        {
          day: 4,
          title: 'Ottawa → Montréal  |  200 km · 2 hrs',
          desc: "Morning drive via Hwy 417 E. Arrive Montréal early afternoon. Check in near Old Montréal. Afternoon walk through Vieux-Montréal cobblestone streets and the Vieux-Port waterfront — both excellent with dogs. Kids love the old fortification walls. Dinner on a Old Montréal terrasse.",
          driveSegments: [
            {
              from: 'Ottawa',
              to: 'Vankleek Hill / Hawkesbury area',
              distance: '95 km',
              time: '1 hr',
              note: 'Easy midpoint stretch before crossing deeper into Quebec traffic.',
            },
            {
              from: 'Vankleek Hill / Hawkesbury area',
              to: 'Montreal',
              distance: '105 km',
              time: '1-1.25 hrs',
              note: 'Plan a little buffer for Montreal approaches and downtown parking.',
            },
          ],
          driveSteps: [
            'Take Hwy 417 E (Queensway) east out of Ottawa',
            'Cross into Québec — highway becomes Autoroute 40 E toward Montréal',
            'Follow A-20 E to the Vieux-Montréal / downtown exits (~2 hrs total)',
          ],
          legWaypoints: [
            [45.4215, -75.6972],
            [45.4550, -74.4850],
            [45.5080, -73.5673],
          ],
        },
        {
          day: 5,
          title: 'Montréal — full day  |  No driving',
          desc: "BIG day. Early morning (7 am): Mount Royal Park hike via Chemin Olmsted before the heat — essential for the Samoyed. Back down by 10 am. Late morning: Atwater Market for provisions. Afternoon: Lachine Canal linear path (flat, paved, shaded sections). Late afternoon: the famous Schwartz's smoked meat sandwiches on Saint-Laurent. Dog waits outside and gets all the attention from the queue.",
          driveSteps: [
            'Mount Royal: park at Camillien-Houde Pkwy or walk from plateau (~15 min)',
            'Atwater Market: 138 Atwater Ave — short drive or metro from downtown',
            'Lachine Canal path: access from Atwater Market heading SW (flat, 11 km one-way)',
            'Schwartz\'s: 3895 Blvd Saint-Laurent — drive or 20 min walk from canal',
          ],
          legWaypoints: [
            [45.5017, -73.5673],
            [45.5048, -73.5882],
            [45.4752, -73.5885],
            [45.4671, -73.5947],
          ],
        },
        {
          day: 6,
          title: 'Montréal → Prince Edward County  |  280 km · 3 hrs',
          desc: "Morning drive back through Kingston and across to The County. Arrive for lunch in Picton. Afternoon: Macaulay Mountain Conservation Area trail or a winery patio (Norman Hardie is very dog-friendly). Lake on the Mountain sunset lookout. Overnight in the County.",
          driveSegments: [
            {
              from: 'Montreal',
              to: 'Cornwall / Ontario border',
              distance: '115 km',
              time: '1.25 hrs',
              note: 'Good first reset after leaving city traffic.',
            },
            {
              from: 'Cornwall / Ontario border',
              to: 'Kingston',
              distance: '180 km',
              time: '1.75-2 hrs',
              note: 'Main 401 segment; use Kingston as the logical lunch or dog-walk break.',
            },
            {
              from: 'Kingston',
              to: 'Picton / Prince Edward County',
              distance: '65 km',
              time: '45-60 min',
              note: 'Short county-road finish via the Bay Bridge.',
            },
          ],
          driveSteps: [
            'Take A-20 W from Montréal back into Ontario, joining Hwy 401 W',
            'Continue on Hwy 401 W through Kingston (~2 hrs)',
            'Exit at Hwy 33 W and cross into Prince Edward County via Bay Bridge',
            'Follow County Rd 49 into Picton (~30 min from Kingston)',
          ],
          legWaypoints: [
            [45.5017, -73.5673],
            [45.4550, -74.4850],
            [44.2307, -76.4950],
            [44.0081, -77.1380],
          ],
        },
        {
          day: 7,
          title: 'Prince Edward County → Toronto  |  225 km · 2.5 hrs',
          desc: "Relaxed final morning. Farm market run in Picton for local honey and preserves. Optional 30-min Lake on the Mountain walk with the dog. Easy drive home via Hwy 401 W. Back in Toronto by early afternoon — everyone, including the Samoyed, earns a long nap.",
          driveSegments: [
            {
              from: 'Prince Edward County',
              to: 'Belleville / Hwy 401',
              distance: '45 km',
              time: '35-45 min',
              note: 'Leave the county roads and join the 401 westbound.',
            },
            {
              from: 'Belleville / Hwy 401',
              to: 'Port Hope / Cobourg',
              distance: '105 km',
              time: '1 hr',
              note: 'Practical final dog walk before GTA traffic.',
            },
            {
              from: 'Port Hope / Cobourg',
              to: 'Toronto',
              distance: '110 km',
              time: '1-1.25 hrs',
              note: 'Final push home; add buffer for Durham/GTA congestion.',
            },
          ],
          driveSteps: [
            'Return to Kingston via County Rd 49 and Hwy 33 W (~30 min)',
            'Join Hwy 401 W at Kingston toward Toronto',
            'Drive through Belleville and Oshawa (~2 hrs)',
            'Arrive Toronto — well earned nap for the whole family',
          ],
          legWaypoints: [
            [44.0081, -77.1380],
            [44.2307, -76.4950],
            [44.1340, -77.3993],
            [43.8971, -78.8658],
            [43.6532, -79.3832],
          ],
        },
      ],
    },

    poi: [
      // Kingston
      {
        name: 'Fort Henry National Historic Site',
        location: 'Kingston',
        description:
          "A beautifully restored 1832 British fortification on a hill above Kingston Harbour. Guided tours, costumed soldiers, live cannon and musket firings, and stunning views across to the Thousand Islands. Kids are completely captivated.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['history', 'fort', 'cannon', 'views', 'UNESCO'],
        dogNote:
          'Outdoor grounds, ramparts, and grassy areas are dog-friendly on leash. The elevated position catches a breeze — good for a Samoyed on a warm day. Confirm interior dog access on arrival.',
      },
      {
        name: 'Kingston Waterfront & Confederation Park',
        location: 'Kingston',
        description:
          'A beautiful flat waterfront promenade along Lake Ontario with splash pads for kids, a bandshell, picnic areas, and views across to Wolfe Island. The ferry to Wolfe Island is free.',
        dogFriendly: true,
        kidFriendly: true,
        tags: ['waterfront', 'splash pad', 'flat', 'ferry', 'picnic'],
        dogNote:
          'Excellent for a Samoyed — flat grassy areas, shade trees, and cool lake breezes. The dog will get enormous attention from other visitors.',
      },
      // Ottawa
      {
        name: 'Parliament Hill & Changing of the Guard',
        location: 'Ottawa',
        description:
          "Canada's iconic Gothic Revival Parliament Buildings. The free Changing of the Guard ceremony happens on the lawn every summer morning at 10 am — colourful, musical, and very photogenic.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['landmark', 'ceremony', 'free', 'photography', 'history'],
        dogNote:
          'Outdoor grounds and viewing lawn are dog-friendly on leash. The wide open grass gives the Samoyed room to stretch. Arrive early for good viewing spots.',
      },
      {
        name: 'ByWard Market',
        location: 'Ottawa',
        description:
          "Ottawa's famous outdoor market neighbourhood. Fresh produce, artisan baked goods, BeaverTails pastry stands, dozens of restaurants, and a lively street atmosphere. Best visited for breakfast or lunch.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['market', 'food', 'outdoor', 'BeaverTails', 'breakfast'],
        dogNote:
          "One of the most dog-welcoming places in Canada. Water bowls everywhere, outdoor terrasses that actively invite dogs, and the Samoyed's fluffy white coat will make you a local celebrity.",
      },
      {
        name: 'Canadian Museum of Nature',
        location: 'Ottawa',
        description:
          "World-class natural history museum with spectacular dinosaur fossil halls, a gem and mineral gallery, Arctic exhibit, and hands-on children's discovery zone. Easily a half-day.",
        dogFriendly: false,
        kidFriendly: true,
        tags: ['museum', 'dinosaurs', 'science', 'gems', 'kids'],
        dogNote:
          'Dogs not permitted inside. Plan for one adult to visit Dundonald Park (3 min walk — has an excellent off-leash area) with the dog while others enjoy the museum. Switch halfway.',
      },
      {
        name: 'Gatineau Park, Québec',
        location: 'Gatineau, QC (15 min from Ottawa)',
        description:
          "A 361 km² national park just across the river in Québec. Pink Lake's extraordinary turquoise colour is unforgettable. Multiple trail options from easy to moderate. Early September brings the first stunning fall colours.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['national park', 'lake', 'trails', 'fall colours', 'Québec'],
        dogNote:
          'Dogs on leash on all marked trails. DO THIS EARLY (before 9 am in summer) — the park heats up quickly and a Samoyed in full sun on a warm August afternoon is not a good situation. Bring 2 litres of water for the dog.',
      },
      // Montréal
      {
        name: 'Old Montréal (Vieux-Montréal)',
        location: 'Montréal',
        description:
          "North America's largest intact historic district. Cobblestone streets, 17th-century stone buildings, the stunning Notre-Dame Basilica exterior, the Vieux-Port waterfront, and countless café terrasses. Magical at any time of day.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['historic', 'cobblestones', 'architecture', 'waterfront', 'terrasses'],
        dogNote:
          'Montréal is famously dog-friendly — terrasses openly welcome dogs, locals stop to admire a Samoyed, and the cobblestone streets are shaded by old buildings. Morning or evening best for heat.',
      },
      {
        name: 'Mount Royal Park (Parc du Mont-Royal)',
        location: 'Montréal',
        description:
          "Frederick Law Olmsted's masterpiece — the same designer as Central Park, NYC. A forested mountain in the heart of the city with panoramic views of Montréal, a large lake (Lac aux Castors), and excellent hiking trails.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['park', 'hiking', 'views', 'lake', 'city forest'],
        dogNote:
          'DO THIS HIKE EARLY — start by 7 am to beat the heat for the Samoyed. The Chemin Olmsted trail is shaded by tall trees for most of its length. The summit viewpoint is worth every step. The lake area has flat paths great for cooling down afterward.',
      },
      {
        name: 'Lachine Canal Linear Park',
        location: 'Montréal',
        description:
          "A beautiful flat multi-use path running 14 km along the historic Lachine Canal through Montréal's trendiest neighbourhoods. Pass cafés, public art, old industrial buildings, and families on bikes.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['canal', 'flat', 'cycling', 'pathway', 'neighbourhoods'],
        dogNote:
          'Completely flat, largely shaded, and with canal water to cool paws in. A perfect afternoon walk for a Samoyed after the morning mountain hike. Do a 3–4 km section and grab a patio lunch mid-way.',
      },
      // PEC
      {
        name: 'Picton Village & Main Street',
        location: 'Prince Edward County',
        description:
          "One of Ontario's most charming small towns. Artisan shops, the beloved Books & Company bookstore, excellent bakeries, local art galleries, and the County's best brunch restaurants all on one walkable street.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['village', 'shopping', 'brunch', 'artisan', 'walkable'],
        dogNote:
          'Picton is one of the most dog-friendly towns in Ontario — water bowls outside shops, pet welcome signs, and outdoor patios that genuinely welcome dogs of all sizes.',
      },
      {
        name: 'Norman Hardie Winery',
        location: 'Prince Edward County',
        description:
          "One of the County's most celebrated wineries with a beautiful outdoor patio, farm animals, a wood-fired pizza oven, and relaxed family-friendly atmosphere. The pinot noir is exceptional.",
        dogFriendly: true,
        kidFriendly: true,
        tags: ['winery', 'patio', 'farm', 'pizza', 'relaxed'],
        dogNote:
          'Among the most dog-friendly wineries in Ontario. Large gravel yard, open farm setting, and staff who love dogs. The Samoyed will be a star here.',
      },
    ],

    trails: [
      {
        name: 'Fort Henry Ridge Walk',
        location: 'Kingston',
        lengthKm: 1.5,
        difficulty: 'easy',
        surface: 'Paved + packed earth',
        dogFriendly: true,
        kidFriendly: true,
        duration: '25–35 min',
        seniorDogNote: null,
        samoyedNote:
          'Short and breezy on the ridge. Elevated position catches wind — good for a Samoyed. Morning or evening only in summer.',
        description:
          "A short walk along the ridge above Fort Henry with panoramic views of Kingston Harbour, the Rideau Canal entrance, and the Thousand Islands. Easy and very rewarding.",
      },
      {
        name: 'Rideau Canal Pathway',
        location: 'Ottawa',
        lengthKm: 7.8,
        difficulty: 'easy',
        surface: 'Paved',
        dogFriendly: true,
        kidFriendly: true,
        duration: 'Do 2–4 km at your pace',
        seniorDogNote: 'Completely flat and paved. Perfect for any dog.',
        samoyedNote:
          'Flat and largely shaded in sections with canal breezes. Morning or evening walk. Water fountains every kilometre.',
        description:
          "The finest urban dog walk in Canada. A flat paved pathway along the Rideau Canal through Ottawa's heart with Parliament Hill views, lock stations, and beautiful evening light.",
      },
      {
        name: 'Pink Lake Lookout Trail',
        location: 'Gatineau Park, QC',
        lengthKm: 2.8,
        difficulty: 'easy-moderate',
        surface: 'Gravel with stone steps',
        dogFriendly: true,
        kidFriendly: true,
        duration: '45–60 min',
        seniorDogNote: null,
        samoyedNote:
          'DO EARLY (before 9 am). The trail is exposed in sections. Bring 2 L of water for the dog. The lookout over the turquoise lake is spectacular and worth the effort.',
        description:
          "A beautiful loop in Gatineau Park to a lookout over Pink Lake — a meromictic lake whose layers never mix, producing an extraordinary blue-green colour. One of the most photographed spots in the National Capital Region.",
      },
      {
        name: 'Gatineau Skyline Trail',
        location: 'Gatineau Park, QC',
        lengthKm: 6.0,
        difficulty: 'intermediate',
        surface: 'Rocky forest trail',
        dogFriendly: true,
        kidFriendly: true,
        duration: '2–2.5 hrs',
        seniorDogNote: null,
        samoyedNote:
          'Intermediate difficulty — only do this if temperature is below 20°C. Early morning start essential. Bring extra water. The Samoyed will love the rocky forest terrain.',
        description:
          'A classic Gatineau Park ridge trail with sweeping views of the Ottawa Valley from multiple lookout points. More elevation than Pink Lake but still very accessible for fit families.',
      },
      {
        name: 'Chemin Olmsted — Mount Royal',
        location: 'Montréal',
        lengthKm: 5.0,
        difficulty: 'moderate',
        surface: 'Gravel carriage road (wide, well-graded)',
        dogFriendly: true,
        kidFriendly: true,
        duration: '1.5–2 hrs round trip',
        seniorDogNote: null,
        samoyedNote:
          'START BY 7 AM in summer. The Chemin Olmsted is a wide gravel carriage road, well-shaded by mature forest for most of its length. Moderate uphill but never steep. The most Samoyed-friendly route up the mountain.',
        description:
          "Frederick Law Olmsted's original carriage road spirals gently up Mont-Royal through beautiful mature forest. The main route to the summit viewpoint over Montréal. Dogs love it and the shaded trail keeps the heat manageable.",
      },
      {
        name: 'Lachine Canal Section Walk',
        location: 'Montréal',
        lengthKm: 4.0,
        difficulty: 'easy',
        surface: 'Paved',
        dogFriendly: true,
        kidFriendly: true,
        duration: '60–75 min',
        seniorDogNote: 'Completely flat. Ideal for any dog.',
        samoyedNote:
          'Do the afternoon section (after the morning mountain hike). The canal provides breeze and shade. Cafés with dog-friendly terrasses every kilometre.',
        description:
          "A flat 14 km canal-side pathway through Montréal's hippest neighbourhoods. Walk the 4 km section between Atwater Market and Old Montréal for the best mix of scenery, café stops, and people-watching.",
      },
      {
        name: 'Macaulay Mountain Conservation Area',
        location: 'Prince Edward County',
        lengthKm: 3.0,
        difficulty: 'easy',
        surface: 'Forested trail',
        dogFriendly: true,
        kidFriendly: true,
        duration: '50–70 min',
        seniorDogNote: 'Some gentle slopes but well-maintained. Shaded and cool.',
        samoyedNote:
          'Lovely shaded forest trail — good for the Samoyed on a warm day. The hilltop lookout has a cooling breeze.',
        description:
          'A network of easy-moderate trails through hardwood forest just outside Picton with a hilltop lookout tower and views over Prince Edward County.',
      },
    ],

    restaurants: [
      // Kingston
      {
        name: 'Pan Chancho Bakery & Café',
        location: 'Kingston',
        cuisine: 'Bakery / Café / Light Meals',
        dogFriendly: false,
        kidFriendly: true,
        priceRange: '$',
        mustTry: 'Croissants, house-made bread, daily soup',
        tip: 'No outdoor seating — get takeout and eat at the nearby waterfront park with the dog.',
      },
      {
        name: 'The Merchant Taphouse & Oyster Bar',
        location: 'Kingston',
        cuisine: 'Canadian / Pub',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$',
        mustTry: 'Fish & chips, local craft beers',
        tip: 'Dog-friendly patio out front. Kids menu available. Great for an easy first-night dinner.',
      },
      {
        name: 'Tango Nuevo',
        location: 'Kingston',
        cuisine: 'Latin American / Fusion',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$',
        mustTry: 'Empanadas, grilled mains',
        tip: 'Excellent outdoor patio. One of Kingston\'s best-regarded dining spots.',
      },
      // Ottawa
      {
        name: "Zak's Diner",
        location: 'Ottawa (ByWard Market)',
        cuisine: 'Classic Canadian Diner',
        dogFriendly: false,
        kidFriendly: true,
        priceRange: '$',
        mustTry: 'Poutine, all-day breakfast, milkshakes',
        tip: 'A ByWard Market institution. Kids love the diner vibe. Get takeout and eat at Major\'s Hill Park with the dog.',
      },
      {
        name: 'The Manx Pub',
        location: 'Ottawa',
        cuisine: 'Pub / Canadian',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$',
        mustTry: 'Burgers, local craft beer',
        tip: 'One of Ottawa\'s most dog-friendly patios. Laid-back atmosphere perfect for families.',
      },
      {
        name: 'Pure Kitchen',
        location: 'Ottawa',
        cuisine: 'Healthy / Plant-forward',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$',
        mustTry: 'Buddha bowls, smoothies, grain salads',
        tip: 'Great healthy option mid-trip. Outdoor seating welcomes dogs. Good for energy-conscious road-trippers.',
      },
      // Montréal
      {
        name: "Schwartz's Hebrew Delicatessen",
        location: 'Montréal',
        cuisine: 'Montreal Smoked Meat Deli',
        dogFriendly: false,
        kidFriendly: true,
        priceRange: '$',
        mustTry: 'Medium-fat smoked meat sandwich on rye with mustard — no substitutions',
        tip: "No outdoor seating, but get takeout and eat on the Saint-Laurent sidewalk. The Samoyed waits outside and gets more attention than the sandwich. An unmissable Montréal experience.",
      },
      {
        name: 'Olive + Gourmando',
        location: 'Montréal (Old Montréal)',
        cuisine: 'Café / Sandwiches / Brunch',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$',
        mustTry: 'Cubano sandwich, homemade granola bowls, house pastries',
        tip: 'Old Montréal institution with outdoor seating that welcomes dogs. Arrive early — lines form quickly on weekends.',
      },
      {
        name: 'Marché Atwater',
        location: 'Montréal',
        cuisine: 'Market / Artisan Food Hall',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$–$$$',
        mustTry: 'Quebec cheese, charcuterie, fresh produce, local pastries',
        tip: "Outdoor market fully dog-friendly. Assemble an incredible picnic for Mount Royal or the Lachine Canal. One of Canada's great food markets.",
      },
      {
        name: "L'Express",
        location: 'Montréal',
        cuisine: 'Classic French Bistro',
        dogFriendly: false,
        kidFriendly: true,
        priceRange: '$$$',
        mustTry: 'Steak tartare, moules frites, crème brûlée',
        tip: "A Montréal institution since 1980. Indoor only but unmissable for a special dinner. Book ahead. Get a babysitter if kids are young — this is the adults' splurge meal.",
      },
      // PEC
      {
        name: 'The Drake Devonshire',
        location: 'Wellington, Prince Edward County',
        cuisine: 'Contemporary Canadian / Farm-to-Table',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$$',
        mustTry: 'Local Lake Ontario fish, County vegetable dishes, Ontario wine list',
        tip: 'The flagship County dining experience. Waterfront patio is dog-friendly. Book for dinner — this is the trip\'s best meal.',
      },
      {
        name: 'Agrarian Market & Café',
        location: 'Picton, Prince Edward County',
        cuisine: 'Local Café / Farm Market',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$',
        mustTry: 'House-roasted coffee, County honey, fresh baked goods',
        tip: 'Perfect morning stop in Picton. Outdoor seating welcomes dogs. Pick up local provisions for the drive home.',
      },
    ],

    lodging: [
      {
        name: 'Delta Hotels Kingston Waterfront',
        type: 'Hotel',
        location: 'Kingston (Night 1)',
        petPolicy: 'Pet-friendly — confirm weight limit at booking',
        familySuitable: true,
        priceRange: '$$$',
        rooms: 'Waterfront rooms with Lake Ontario views; family configurations available',
        bookingNote:
          'Superb location on the harbour. Kids love watching the ferries. Close to Fort Henry and waterfront.',
      },
      {
        name: 'Homewood Suites by Hilton Ottawa',
        type: 'Extended Stay Hotel',
        location: 'Ottawa (Nights 2–3)',
        petPolicy: 'Pet-friendly with fee — good for larger dogs',
        familySuitable: true,
        priceRange: '$$',
        rooms: 'Full suites with kitchenette, separate living area, pull-out sofa',
        bookingNote:
          'Best family value in Ottawa — room for kids and the Samoyed to spread out. Free breakfast included.',
      },
      {
        name: 'Alt Hotel Ottawa',
        type: 'Boutique Hotel',
        location: 'Ottawa (Nights 2–3 — upgrade option)',
        petPolicy: 'Pet-friendly',
        familySuitable: true,
        priceRange: '$$$',
        rooms: 'Modern rooms; larger rooms suit a family of 4',
        bookingNote:
          'Stylish and genuinely dog-friendly. Walking distance to Parliament and ByWard Market.',
      },
      {
        name: 'Hôtel Le Saint-Sulpice',
        type: 'Boutique Hotel',
        location: 'Montréal — Old Montréal (Nights 4–5)',
        petPolicy: 'Pet-friendly — dogs welcome',
        familySuitable: true,
        priceRange: '$$$',
        rooms: 'Suite-style rooms with kitchenette; excellent for families',
        bookingNote:
          "Right in Vieux-Montréal — walk everywhere. Suites give the family real space. One of Old Montréal's best pet-friendly properties.",
      },
      {
        name: 'Le Centre Sheraton Montréal',
        type: 'Hotel',
        location: 'Montréal (Nights 4–5 — central option)',
        petPolicy: 'Pet-friendly with fee',
        familySuitable: true,
        priceRange: '$$$',
        rooms: 'Family rooms and connecting rooms available',
        bookingNote:
          'Central location close to everything. Large rooms for a family. Good pool — the kids will insist.',
      },
      {
        name: 'The Drake Devonshire',
        type: 'Boutique Hotel',
        location: 'Wellington, Prince Edward County (Night 6)',
        petPolicy: 'Dogs warmly welcomed throughout the property',
        familySuitable: true,
        priceRange: '$$$',
        rooms: 'Boutique rooms; family-suitable rooms available',
        bookingNote:
          "Ontario's best boutique hotel night. Waterfront, world-class restaurant on-site, and the Samoyed gets a hero's welcome.",
      },
    ],

    seasonTips: {
      june:
        'June is ideal for the Eastern Circuit — Parliament tulip festival winding down in Ottawa, Montréal Jazz Festival in late June, and PEC starting to buzz. Weather is warm but not oppressively hot, making it the most Samoyed-friendly month for this trip. Book everything 2+ months ahead.',
      'late-august':
        'Everything is open and at peak vibrancy — Montréal festivals, full restaurant/winery season in PEC. The hardest month for the Samoyed (heat). Schedule all hikes before 9 am, bring a cooling mat for the van, and do not skip the early morning Mount Royal start. Book 3+ months ahead.',
      'early-september':
        'The sweet spot for this circuit. Cooler temperatures (15–22°C) make hiking genuinely enjoyable for the Samoyed without the extreme heat precautions. Gatineau Park shows the first fall colour. PEC harvest season is extraordinary. Crowds thin, prices drop after Labour Day. The best overall choice for this trip.',
    },
  },

  // TRIP 6 - New Brunswick Bay of Fundy Loop (7 days)
  {
    id: 'new-brunswick-fundy',
    name: 'New Brunswick Bay of Fundy Loop',
    tagline: 'Highest tides, red cliffs, covered bridges, and coastal hikes',
    duration: '7 days',
    distanceKm: 3000,
    driveHoursOneWay: 14.5,
    seasons: ['june', 'late-august', 'early-september'],
    colorFrom: '#b45309',
    colorTo: '#0f766e',
    emoji: 'NB',
    highlights: ['Quebec City', 'Rimouski', 'Fundy National Park', 'St. Andrews'],
    tripProfile: {
      passengers: 'Family of 4',
      pet: 'One dog',
      vehicle: 'Road-trip van',
      dogBreedNote:
        'This is a long-distance coastal route with several big drive days. Keep hikes early or late in warm weather, pack extra water for the dog, and avoid exposed beach walks at midday in late August.',
    },

    route: {
      googleMapsUrl:
        'https://www.google.com/maps/dir/Toronto,+ON/Quebec+City,+QC/Rimouski,+QC/Fredericton,+NB/Alma,+NB/Hopewell+Rocks+Provincial+Park/St.+Andrews,+NB/Quebec+City,+QC/Toronto,+ON',
      waypoints: [
        [43.6532, -79.3832],
        [46.8139, -71.208],
        [48.4281, -68.522],
        [45.9636, -66.6431],
        [45.6002, -64.9474],
        [45.8236, -64.5751],
        [45.0738, -67.0531],
        [46.8139, -71.208],
        [43.6532, -79.3832],
      ],
      stops: [
        {
          name: 'Toronto',
          coords: [43.6532, -79.3832],
          night: null,
          description: 'Start early. This route is built as a family-friendly New Brunswick loop with sensible overnight breaks.',
        },
        {
          name: 'Quebec City, QC',
          coords: [46.8139, -71.208],
          night: 1,
          driveFromPrevious: { distance: '800 km', time: '8-8.5 hrs' },
          description: 'First overnight on the Old Quebec outskirts or in Levis for easier parking. Walk Petit-Champlain, Terrasse Dufferin, and the Citadel exterior.',
        },
        {
          name: 'Rimouski, QC',
          coords: [48.4281, -68.522],
          night: 2,
          driveFromPrevious: { distance: '315 km', time: '3.5 hrs' },
          description: 'Underrated St. Lawrence stop with waterfront walks, Pointe-au-Pere Lighthouse, seafood, and a relaxed dog-friendly pace.',
        },
        {
          name: 'Fredericton, NB',
          coords: [45.9636, -66.6431],
          night: 3,
          driveFromPrevious: { distance: '500 km', time: '5-5.5 hrs' },
          description: 'Kids decompress after the drive with riverfront trails, covered-bridge detours, parks, breweries, and patios.',
        },
        {
          name: 'Alma / Fundy National Park',
          coords: [45.6002, -64.9474],
          night: 4,
          driveFromPrevious: { distance: '230 km', time: '2.5 hrs' },
          description: 'Two-night anchor base for Fundy. Do not hotel-hop here: Alma puts you beside the park, the beach, seafood, and Hopewell Rocks.',
        },
        {
          name: 'Hopewell Rocks',
          coords: [45.8236, -64.5751],
          night: 5,
          driveFromPrevious: { distance: '40 km', time: '35-45 min' },
          description: 'Iconic flowerpot rocks and ocean-floor walking at low tide. Check tide times before going.',
        },
        {
          name: 'St. Andrews by-the-Sea',
          coords: [45.0738, -67.0531],
          night: 6,
          driveFromPrevious: { distance: '300 km', time: '3.5 hrs' },
          description: 'One of Atlantic Canada\'s best small towns: waterfront, Kingsbrae Garden, whale watching, ice cream, and Ministers Island tide timing.',
        },
        {
          name: 'Quebec City or Riviere-du-Loup',
          coords: [46.8139, -71.208],
          night: null,
          driveFromPrevious: { distance: '520-710 km', time: '5.5-8 hrs' },
          description: 'Long return transition. Push to Quebec City for a 7-day trip, or stop in Riviere-du-Loup for the much calmer 8-day version.',
        },
        {
          name: 'Toronto',
          coords: [43.6532, -79.3832],
          night: null,
          driveFromPrevious: { distance: '800-980 km', time: '8-10.5 hrs' },
          description: 'Final drive home.',
        },
      ],
      mapPoints: [
        {
          category: 'poi',
          day: 1,
          name: 'Kingston Waterfront',
          location: 'Kingston, ON',
          coords: [44.2307, -76.4809],
          note: 'Easy family and dog stretch stop on the long drive east.',
        },
        {
          category: 'poi',
          day: 1,
          name: 'Petit-Champlain',
          location: 'Quebec City, QC',
          coords: [46.8112, -71.2036],
          note: 'Atmospheric Old Quebec walk for the first evening.',
        },
        {
          category: 'poi',
          day: 1,
          name: 'Terrasse Dufferin',
          location: 'Quebec City, QC',
          coords: [46.8127, -71.2048],
          note: 'Classic boardwalk viewpoint by Chateau Frontenac.',
        },
        {
          category: 'food',
          day: 1,
          name: 'Paillard Bakery',
          location: 'Quebec City, QC',
          coords: [46.8144, -71.2105],
          note: 'Bakery stop for breakfast, sandwiches, and road snacks.',
        },
        {
          category: 'food',
          day: 1,
          name: 'Chocolats Favoris',
          location: 'Quebec City, QC',
          coords: [46.8127, -71.2076],
          note: 'Kid-friendly dipped ice cream stop.',
        },
        {
          category: 'lodging',
          day: 1,
          name: 'Hotel Cofortel',
          location: 'Quebec City airport area',
          coords: [46.7908, -71.3548],
          note: 'Parking-friendly first-night option outside Old Quebec.',
        },
        {
          category: 'poi',
          day: 2,
          name: 'Montmorency Falls',
          location: 'Quebec City area',
          coords: [46.8908, -71.1475],
          note: 'High-impact waterfall stop before heading along the St. Lawrence.',
        },
        {
          category: 'poi',
          day: 2,
          name: 'Kamouraska Viewpoints',
          location: 'Kamouraska, QC',
          coords: [47.5654, -69.8668],
          note: 'Pretty St. Lawrence village and scenic dog-walk break.',
        },
        {
          category: 'poi',
          day: 2,
          name: 'Pointe-au-Pere Lighthouse',
          location: 'Rimouski, QC',
          coords: [48.5175, -68.4691],
          note: 'Lighthouse and maritime site for the Rimouski evening.',
        },
        {
          category: 'lodging',
          day: 2,
          name: 'Rimouski Waterfront Stay Area',
          location: 'Rimouski, QC',
          coords: [48.4522, -68.5236],
          note: 'Target pet-friendly motel or cottage options near the water.',
        },
        {
          category: 'poi',
          day: 3,
          name: 'Grand Falls Gorge',
          location: 'Grand Falls, NB',
          coords: [47.0514, -67.7383],
          note: 'Memorable gorge stop between Rimouski and Fredericton.',
        },
        {
          category: 'poi',
          day: 3,
          name: 'Fredericton Riverfront Trail',
          location: 'Fredericton, NB',
          coords: [45.9636, -66.6431],
          note: 'Decompression walk after the driving day.',
        },
        {
          category: 'food',
          day: 3,
          name: 'Fredericton Patio Pub Area',
          location: 'Downtown Fredericton',
          coords: [45.9609, -66.6416],
          note: 'Use this area for brewery or pub patios that welcome dogs.',
        },
        {
          category: 'lodging',
          day: 3,
          name: 'Hilton Garden Inn Fredericton',
          location: 'Fredericton, NB',
          coords: [45.9616, -66.6414],
          note: 'Central pet-friendly base to verify before booking.',
        },
        {
          category: 'stop',
          day: 4,
          name: 'Alma Beach',
          location: 'Alma, NB',
          coords: [45.6002, -64.9474],
          note: 'Low-tide beach walk beside the Fundy base.',
        },
        {
          category: 'poi',
          day: 4,
          name: 'Cape Enrage',
          location: 'Bay of Fundy, NB',
          coords: [45.5924, -64.7771],
          note: 'Lighthouse and cliffside stop near the Fundy coast.',
        },
        {
          category: 'food',
          day: 4,
          name: 'Tipsy Tails Restaurant',
          location: 'Alma, NB',
          coords: [45.6012, -64.9485],
          note: 'Easy seafood meal near Fundy National Park.',
        },
        {
          category: 'food',
          day: 4,
          name: 'Alma Lobster Shop',
          location: 'Alma, NB',
          coords: [45.6008, -64.9479],
          note: 'Seafood takeout or picnic-style dinner.',
        },
        {
          category: 'lodging',
          day: 4,
          name: 'Parkland Village Inn',
          location: 'Alma, NB',
          coords: [45.6011, -64.9489],
          note: 'Good 2-night Fundy base if pet-friendly rooms are available.',
        },
        {
          category: 'lodging',
          day: 4,
          name: 'Fundy Highlands',
          location: 'Alma, NB',
          coords: [45.5986, -64.9496],
          note: 'Motel/chalet style stay close to the park entrance.',
        },
        {
          category: 'poi',
          day: 5,
          name: 'Hopewell Rocks Provincial Park',
          location: 'Hopewell Cape, NB',
          coords: [45.8233, -64.5733],
          note: 'Ocean-floor walk and flowerpot rocks; tide timing matters.',
        },
        {
          category: 'trail',
          day: 5,
          name: 'Dickson Falls Trail',
          location: 'Fundy National Park',
          coords: [45.5956, -64.9741],
          note: 'Short shaded waterfall trail, excellent for kids and dog.',
        },
        {
          category: 'trail',
          day: 5,
          name: 'Laverty Falls Trail',
          location: 'Fundy National Park',
          coords: [45.6253, -65.0315],
          note: 'Moderate forest hike to a popular waterfall.',
        },
        {
          category: 'trail',
          day: 5,
          name: 'Matthews Head Trail',
          location: 'Fundy National Park',
          coords: [45.5817, -64.9662],
          note: 'Beginner/intermediate coastal forest loop.',
        },
        {
          category: 'trail',
          day: 5,
          name: 'Caribou Plains Trail',
          location: 'Fundy National Park',
          coords: [45.6118, -65.0094],
          note: 'Short boardwalk and forest option for a lighter outing.',
        },
        {
          category: 'stop',
          day: 6,
          name: 'Saint Andrews Waterfront',
          location: 'St. Andrews, NB',
          coords: [45.0738, -67.0531],
          note: 'Small-town waterfront, shops, patios, and ice cream.',
        },
        {
          category: 'poi',
          day: 6,
          name: 'Kingsbrae Garden',
          location: 'St. Andrews, NB',
          coords: [45.0774, -67.0558],
          note: 'Garden stop for the family; confirm pet rules before visiting.',
        },
        {
          category: 'poi',
          day: 6,
          name: 'Ministers Island',
          location: 'Near St. Andrews, NB',
          coords: [45.064, -67.027],
          note: 'Tidal road access; check crossing times carefully.',
        },
        {
          category: 'food',
          day: 6,
          name: 'Honeybeans Coffee',
          location: 'St. Andrews, NB',
          coords: [45.0742, -67.0525],
          note: 'Coffee and breakfast stop near the waterfront.',
        },
        {
          category: 'food',
          day: 6,
          name: 'The Clam Digger',
          location: 'St. Andrews, NB',
          coords: [45.0752, -67.0519],
          note: 'Classic seafood stop; confirm patio dog rules.',
        },
        {
          category: 'lodging',
          day: 6,
          name: 'The Algonquin Resort',
          location: 'St. Andrews, NB',
          coords: [45.0804, -67.0571],
          note: 'Signature splurge stay; reserve pet-friendly room specifically.',
        },
        {
          category: 'lodging',
          day: 6,
          name: 'Picket Fence Motel',
          location: 'St. Andrews, NB',
          coords: [45.079, -67.055],
          note: 'Practical motel-style option near town.',
        },
        {
          category: 'stop',
          day: 7,
          name: 'Riviere-du-Loup Return Break',
          location: 'Riviere-du-Loup, QC',
          coords: [47.8358, -69.5369],
          note: 'Much calmer 8-day return stop than pushing all the way home.',
        },
      ],
      itinerary: [
        {
          day: 1,
          title: 'Toronto to Quebec City',
          desc: 'Drive about 8 hours. Break at Kingston waterfront, Drummondville, and highway rest areas for dog walks. Stay on the Old Quebec outskirts or in Levis for better parking. Evening: Petit-Champlain, Terrasse Dufferin, Citadel exterior, poutine, crepes, bakeries, and ice cream for the kids.',
          driveSegments: [
            {
              from: 'Toronto',
              to: 'Kingston',
              distance: '260 km',
              time: '2.5 hrs',
              note: 'Primary morning segment; use the waterfront for a real dog-and-kid reset.',
            },
            {
              from: 'Kingston',
              to: 'Montreal bypass',
              distance: '290 km',
              time: '2.75-3 hrs',
              note: 'Main cross-border highway segment; keep this as a pass-through unless traffic forces a pause.',
            },
            {
              from: 'Montreal bypass',
              to: 'Drummondville',
              distance: '105 km',
              time: '1-1.25 hrs',
              note: 'Shorter segment after Montreal traffic; good washroom and snack stop.',
            },
            {
              from: 'Drummondville',
              to: 'Quebec City / Levis',
              distance: '150 km',
              time: '1.5 hrs',
              note: 'Final push into the overnight area with easier parking outside Old Quebec.',
            },
          ],
          driveSteps: [
            'Take Hwy 401 E from Toronto to Kingston (~2.5 hrs) — dog walk break at Kingston Waterfront',
            'Continue on Hwy 401 E crossing into Québec, becoming Autoroute 20 E',
            'Pass through Montréal on A-20 E — stay on the highway, no stop needed',
            'Break at Drummondville rest area (~5.5 hrs from Toronto)',
            'Continue on A-20 E to Quebec City — exit toward Old Quebec or Lévis (~8 hrs total)',
          ],
          legWaypoints: [
            [43.6532, -79.3832],
            [44.2307, -76.4950],
            [45.5017, -73.5673],
            [45.8844, -72.4911],
            [46.8139, -71.2080],
          ],
        },
        {
          day: 2,
          title: 'Quebec City to Rimouski',
          desc: 'Drive about 3.5 hours along an underrated, beautiful St. Lawrence stretch. Stop at Montmorency Falls, Kamouraska, and river viewpoints. Rimouski gives you a relaxed waterfront pace, seafood, coastal walks, Pointe-au-Pere Lighthouse, and sunset by the river.',
          driveSegments: [
            {
              from: 'Quebec City',
              to: 'Kamouraska',
              distance: '170 km',
              time: '2 hrs',
              note: 'Scenic St. Lawrence segment with Montmorency Falls early if you want a short stop.',
            },
            {
              from: 'Kamouraska',
              to: 'Rimouski',
              distance: '145 km',
              time: '1.5 hrs',
              note: 'Easy coastal finish; arrive with time for the lighthouse and waterfront.',
            },
          ],
          driveSteps: [
            'Take Autoroute 40 E from Quebec City to Montmorency Falls exit (~15 min)',
            'Rejoin Hwy 132 E along the south shore of the St. Lawrence — scenic river drive',
            'Stop at Kamouraska village for a stretch and St. Lawrence views (~2 hrs from QC)',
            'Continue on Hwy 132 E to Rimouski (~1.5 hrs more)',
          ],
          legWaypoints: [
            [46.8139, -71.2080],
            [46.8908, -71.1475],
            [47.5654, -69.8668],
            [48.4522, -68.5236],
          ],
        },
        {
          day: 3,
          title: 'Rimouski to Fredericton',
          desc: 'Drive about 5 hours. Break at Grand Falls Gorge, covered bridges, and riverfront parks. Evening is for Fredericton trails plus a brewery or pub patio. This is the kids\' decompression night after the bigger driving days.',
          driveSegments: [
            {
              from: 'Rimouski',
              to: 'Riviere-du-Loup',
              distance: '110 km',
              time: '1.25 hrs',
              note: 'Short first segment before turning inland toward New Brunswick.',
            },
            {
              from: 'Riviere-du-Loup',
              to: 'Grand Falls',
              distance: '230 km',
              time: '2.25-2.5 hrs',
              note: 'The main transit block; Grand Falls Gorge is the logical full break.',
            },
            {
              from: 'Grand Falls',
              to: 'Fredericton',
              distance: '165 km',
              time: '1.75-2 hrs',
              note: 'Final highway stretch to the riverfront overnight.',
            },
          ],
          driveSteps: [
            'Take Trans-Canada Hwy 185 S from Rimouski toward Rivière-du-Loup (~1 hr)',
            'Cross into New Brunswick on Trans-Canada Hwy 2 S at Edmundston',
            'Stop at Grand Falls Gorge for a break — exit at Grand Falls off Hwy 2 (~3 hrs)',
            'Continue on Hwy 2 S to Fredericton (~2 hrs more)',
          ],
          legWaypoints: [
            [48.4522, -68.5236],
            [47.8278, -69.5378],
            [47.3628, -68.3255],
            [47.0594, -67.7404],
            [45.9636, -66.6431],
          ],
        },
        {
          day: 4,
          title: 'Fredericton to Alma / Fundy National Park',
          desc: 'Drive about 2.5 hours and settle into Alma for 2 nights. This is where the trip becomes memorable. Use Alma as the base for Fundy National Park, Hopewell Rocks, Cape Enrage, Alma beach at low tide, and easy seafood dinners.',
          driveSegments: [
            {
              from: 'Fredericton',
              to: 'Sussex',
              distance: '120 km',
              time: '1.25-1.5 hrs',
              note: 'Simple highway run; Sussex is the practical grocery/fuel reset.',
            },
            {
              from: 'Sussex',
              to: 'Alma / Fundy National Park',
              distance: '75 km',
              time: '1 hr',
              note: 'Slower scenic finish on Hwy 114 into the park and village.',
            },
          ],
          driveSteps: [
            'Take Hwy 1 E from Fredericton toward Sussex (~1.5 hrs)',
            'At Sussex, take Hwy 114 S toward Fundy National Park',
            'Follow Hwy 114 through the park to Alma village (~45 min from Sussex)',
          ],
          legWaypoints: [
            [45.9636, -66.6431],
            [45.7181, -65.5144],
            [45.5992, -64.9534],
          ],
        },
        {
          day: 5,
          title: 'Full Fundy Day',
          desc: 'No major driving. Build the day around tide pools, beaches, waterfalls, giant tides, Hopewell Rocks, Dickson Falls, Matthews Head, Laverty Falls, Caribou Plains, or the Fundy Trail Parkway. Excellent Samoyed day: cooler weather, forest trails, water access, and long walks.',
          driveSteps: [
            'Hopewell Rocks: 15 min drive east of Alma on Hwy 114 (check tide times!)',
            'Cape Enrage: 20 min drive from Alma via Hwy 114 and Cape Enrage Rd',
            'Dickson Falls trailhead: 5 min drive inside Fundy NP from Alma gate',
            'All local — no highway driving today',
          ],
          legWaypoints: [
            [45.5992, -64.9534],
            [45.8283, -64.5867],
            [45.6003, -64.7717],
            [45.5992, -64.9534],
          ],
        },
        {
          day: 6,
          title: 'Alma to Saint Andrews-by-the-Sea',
          desc: 'Drive about 3.5 hours. Saint Andrews is a better pace than a giant-city stop for a short family trip. Do Kingsbrae Garden, the waterfront, ice cream shops, Ministers Island if tide timing works, and whale watching while one adult handles dog duty.',
          driveSegments: [
            {
              from: 'Alma',
              to: 'Sussex',
              distance: '75 km',
              time: '1 hr',
              note: 'Backtrack out of Fundy slowly; stop in Sussex if you need supplies.',
            },
            {
              from: 'Sussex',
              to: 'St. George',
              distance: '150 km',
              time: '1.5-1.75 hrs',
              note: 'Main Hwy 1 westbound segment before the coastal turnoff.',
            },
            {
              from: 'St. George',
              to: 'Saint Andrews-by-the-Sea',
              distance: '30 km',
              time: '30-40 min',
              note: 'Short coastal finish into town.',
            },
          ],
          driveSteps: [
            'Return to Sussex via Hwy 114 N (~45 min)',
            'Take Hwy 1 W from Sussex toward Sussex Corner and St. George',
            'At St. George, take Hwy 1 W / Hwy 127 S to Saint Andrews-by-the-Sea (~3.5 hrs total)',
          ],
          legWaypoints: [
            [45.5992, -64.9534],
            [45.7181, -65.5144],
            [45.3050, -66.0700],
            [45.0768, -67.0568],
          ],
        },
        {
          day: 7,
          title: 'Saint Andrews to Quebec City or Riviere-du-Loup',
          desc: 'Long transition day. If this must stay 7 days, push to Quebec City and continue home with a very early start. If you can make it 8 days, stop in Riviere-du-Loup instead, which is much better for the family and dog, then return to Toronto relaxed the next day.',
          driveSegments: [
            {
              from: 'Saint Andrews-by-the-Sea',
              to: 'Fredericton',
              distance: '135 km',
              time: '1.5-2 hrs',
              note: 'First reset point before the long northbound run.',
            },
            {
              from: 'Fredericton',
              to: 'Grand Falls',
              distance: '165 km',
              time: '1.75-2 hrs',
              note: 'Good lunch or gorge-walk break if the family needs movement.',
            },
            {
              from: 'Grand Falls',
              to: 'Riviere-du-Loup',
              distance: '230 km',
              time: '2.25-2.5 hrs',
              note: 'Recommended overnight stop for the calmer 8-day version.',
            },
            {
              from: 'Riviere-du-Loup',
              to: 'Quebec City',
              distance: '200 km',
              time: '2 hrs',
              note: 'Only add this if you are forcing the 7-day version and can handle the longer day.',
            },
          ],
          driveSteps: [
            'Take Hwy 1 E from Saint Andrews back to Fredericton via Trans-Canada (~2 hrs)',
            'Continue on Trans-Canada Hwy 2 N through Grand Falls to Edmundston',
            'Cross into Québec — take Hwy 185 N to Rivière-du-Loup (~2 hrs from Fredericton)',
            'Option A: stop overnight in Rivière-du-Loup (recommended with family)',
            'Option B: continue on A-20 W to Quebec City (~1 hr more) for early departure home',
          ],
          legWaypoints: [
            [45.0768, -67.0568],
            [45.9636, -66.6431],
            [47.0594, -67.7404],
            [47.8278, -69.5378],
            [46.8139, -71.2080],
          ],
        },
      ],
    },

    poi: [
      {
        name: 'Hopewell Rocks Provincial Park',
        location: 'Hopewell Cape',
        description:
          'New Brunswick classic. Walk on the ocean floor between giant flowerpot rock formations at low tide, then watch the Bay of Fundy refill the same space hours later.',
        dogFriendly: true,
        kidFriendly: true,
        tags: ['tides', 'beach', 'geology', 'iconic'],
        dogNote:
          'Dogs are allowed on leash in many outdoor areas, but stairs, wet mud, and crowds can be tricky. Rinse paws after beach time and check current park rules before visiting.',
      },
      {
        name: 'Fundy National Park',
        location: 'Alma',
        description:
          'The best family outdoor base in New Brunswick: waterfalls, Acadian forest, coastal lookouts, red chairs, beaches, and the village of Alma beside the park gate.',
        dogFriendly: true,
        kidFriendly: true,
        tags: ['national park', 'waterfalls', 'forest', 'coast'],
        dogNote:
          'Leashed dogs are allowed on many trails and in campgrounds. Keep the dog out of sensitive beach and wildlife areas where posted.',
      },
      {
        name: 'Montmorency Falls',
        location: 'Quebec City area',
        description:
          'A dramatic waterfall just outside Quebec City and a perfect Day 2 leg-stretcher before following the St. Lawrence east.',
        dogFriendly: true,
        kidFriendly: true,
        tags: ['waterfall', 'viewpoint', 'short stop', 'family'],
        dogNote:
          'Outdoor viewing areas work well with a leashed dog. Keep the dog away from crowded stair sections if it is hot or busy.',
      },
      {
        name: 'Pointe-au-Pere Lighthouse',
        location: 'Rimouski',
        description:
          'Historic lighthouse and maritime site on the St. Lawrence. A relaxed Rimouski activity with space for the kids to wander and the dog to stretch.',
        dogFriendly: true,
        kidFriendly: true,
        tags: ['lighthouse', 'history', 'waterfront', 'sunset'],
        dogNote:
          'Keep the visit mostly outdoors with a leashed dog and use the waterfront for a gentle evening walk.',
      },
      {
        name: 'Grand Falls Gorge',
        location: 'Grand Falls',
        description:
          'A memorable New Brunswick break stop between Rimouski and Fredericton, with gorge views and enough movement to reset everyone after highway time.',
        dogFriendly: true,
        kidFriendly: true,
        tags: ['gorge', 'waterfall', 'drive break', 'viewpoint'],
        dogNote:
          'Use the viewing areas and paths as a leashed dog walk. Keep kids and dog close at railings.',
      },
      {
        name: 'Cape Enrage',
        location: 'Bay of Fundy',
        description:
          'A rugged lighthouse and cliffside stop near Fundy National Park. It pairs well with Hopewell Rocks when tide timing allows.',
        dogFriendly: true,
        kidFriendly: true,
        tags: ['lighthouse', 'cliffs', 'views', 'Fundy'],
        dogNote:
          'Leashed outdoor areas are the best fit. Wind, stairs, and cliffs mean the dog should stay close.',
      },
      {
        name: 'St. Andrews by-the-Sea',
        location: 'St. Andrews',
        description:
          'Historic seaside town with Water Street shops, a long waterfront, whale-watching departures, Kingsbrae Garden, and easy patio meals.',
        dogFriendly: true,
        kidFriendly: true,
        tags: ['seaside town', 'whales', 'shops', 'waterfront'],
        dogNote:
          'The town is very walkable with a dog. Whale tours and gardens may have restrictions, so plan a split-adult activity if needed.',
      },
      {
        name: 'Ministers Island',
        location: 'Near St. Andrews',
        description:
          'A tidal island reached by driving across the exposed ocean floor at low tide. The historic estate and views make it a memorable family stop.',
        dogFriendly: true,
        kidFriendly: true,
        tags: ['tidal road', 'history', 'views', 'unique'],
        dogNote:
          'Dogs may be limited to outdoor areas. Tide timing is mandatory; do not start the crossing close to cutoff time.',
      },
      {
        name: 'Kingsbrae Garden',
        location: 'St. Andrews',
        description:
          'Beautiful garden stop in Saint Andrews with a calmer pace than big-city tourism. Excellent for kids who need open space after several travel days.',
        dogFriendly: false,
        kidFriendly: true,
        tags: ['garden', 'family', 'slow pace', 'St. Andrews'],
        dogNote:
          'Treat this as a split-adult stop or confirm current pet rules before visiting.',
      },
    ],

    trails: [
      {
        name: 'Dickson Falls Trail',
        location: 'Fundy National Park',
        lengthKm: 1.5,
        difficulty: 'easy',
        surface: 'Boardwalk and forest path',
        dogFriendly: true,
        kidFriendly: true,
        duration: '30-45 min',
        seniorDogNote: null,
        samoyedNote:
          'Shaded, short, and cool from the waterfall ravine. This is one of the best warm-weather dog choices in Fundy.',
        description:
          'A short loop through lush forest and mossy ravines to a pretty waterfall. Excellent first Fundy hike for kids.',
      },
      {
        name: 'Laverty Falls Trail',
        location: 'Fundy National Park',
        lengthKm: 5.0,
        difficulty: 'moderate',
        surface: 'Forest trail with roots and rocks',
        dogFriendly: true,
        kidFriendly: true,
        duration: '2-3 hrs',
        seniorDogNote: null,
        samoyedNote:
          'Do this early and only if the dog is comfortable with a moderate forest hike. The waterfall pool area is a great cooldown spot.',
        description:
          'A popular forest hike to one of Fundy National Park\'s most loved waterfalls. Rewarding but more demanding than Dickson Falls.',
      },
      {
        name: 'Matthews Head Trail',
        location: 'Fundy National Park',
        lengthKm: 4.5,
        difficulty: 'easy-moderate',
        surface: 'Forest and coastal path',
        dogFriendly: true,
        kidFriendly: true,
        duration: '1.5-2 hrs',
        seniorDogNote: 'Better for a steady dog than a tired one; shorten the day if needed.',
        samoyedNote:
          'Good mix of shade and coastal air. Start in the morning and carry extra water.',
        description:
          'Beginner/intermediate Fundy hike with forest, headland scenery, and Bay of Fundy views. A strong choice for the full Fundy recovery day.',
      },
      {
        name: 'Caribou Plains Trail',
        location: 'Fundy National Park',
        lengthKm: 2.1,
        difficulty: 'easy',
        surface: 'Boardwalk and forest trail',
        dogFriendly: true,
        kidFriendly: true,
        duration: '35-50 min',
        seniorDogNote: 'Gentle, short, and useful as a lower-energy option.',
        samoyedNote:
          'A good lighter trail when the dog needs shade and a shorter outing.',
        description:
          'Easy boardwalk-and-forest route through bog habitat. A nice contrast to waterfalls and beaches without overloading the day.',
      },
      {
        name: 'Ministers Island Perimeter Walk',
        location: 'St. Andrews',
        lengthKm: 3.0,
        difficulty: 'easy',
        surface: 'Gravel road and grass paths',
        dogFriendly: true,
        kidFriendly: true,
        duration: '45-75 min',
        seniorDogNote: 'Mostly gentle terrain, but tide timing controls the whole visit.',
        samoyedNote:
          'Open sections can be sunny. Time it for morning or evening low tide when possible.',
        description:
          'A relaxed walk around one of New Brunswick\'s most unusual tide-access sites, with estate grounds and Passamaquoddy Bay views.',
      },
    ],

    restaurants: [
      {
        name: 'Chez Ashton',
        location: 'Quebec City',
        cuisine: 'Poutine / Casual',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$',
        mustTry: 'Classic Quebec poutine',
        tip: 'Easy first-night comfort food. Use takeout if patio seating is not convenient with the dog.',
      },
      {
        name: 'Paillard Bakery',
        location: 'Quebec City',
        cuisine: 'Bakery / Cafe',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$',
        mustTry: 'Croissants, pastries, sandwiches',
        tip: 'Excellent breakfast or road-snack stop before heading toward Rimouski.',
      },
      {
        name: 'Chocolats Favoris',
        location: 'Quebec City',
        cuisine: 'Chocolate / Ice cream',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$',
        mustTry: 'Dipped ice cream cones',
        tip: 'Kid morale stop. Keep it as an outdoor treat with the dog.',
      },
      {
        name: 'Fredericton Patio Pub Stop',
        location: 'Fredericton',
        cuisine: 'Pub / Brewery',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$',
        mustTry: 'Burgers, fish and chips, local beer list',
        tip: 'Use Fredericton as the decompression night: riverfront walk, then a brewery or pub patio that allows dogs.',
      },
      {
        name: 'Tipsy Tails Restaurant',
        location: 'Alma',
        cuisine: 'Seafood / Casual',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$',
        mustTry: 'Lobster roll, chowder, fried clams',
        tip: 'A natural Fundy National Park meal stop. Ask for outdoor seating if travelling with the dog.',
      },
      {
        name: 'Alma Lobster Shop',
        location: 'Alma',
        cuisine: 'Seafood / Takeout',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$',
        mustTry: 'Lobster, seafood plates, picnic-style meals',
        tip: 'Ideal after a Fundy trail day. Take food to a waterfront picnic spot if patio space is tight.',
      },
      {
        name: 'Sapranos Pizza',
        location: 'Alma',
        cuisine: 'Pizza / Casual',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$',
        mustTry: 'Pizza after a long beach or waterfall day',
        tip: 'Low-friction kid dinner for the second Alma night.',
      },
      {
        name: 'Honeybeans Coffee',
        location: 'St. Andrews',
        cuisine: 'Coffee / Breakfast',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$',
        mustTry: 'Coffee, baked goods, breakfast bites',
        tip: 'Good morning stop before waterfront wandering or Ministers Island tide timing.',
      },
      {
        name: 'The Clam Digger',
        location: 'St. Andrews',
        cuisine: 'Seafood',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$',
        mustTry: 'Clams, chowder, fried seafood',
        tip: 'Classic seaside food stop. Confirm patio seating if the dog is joining.',
      },
      {
        name: "Braxton's",
        location: 'St. Andrews',
        cuisine: 'Canadian / Hotel dining',
        dogFriendly: true,
        kidFriendly: true,
        priceRange: '$$$',
        mustTry: 'Seafood, brunch, family-friendly mains',
        tip: 'Convenient if staying near the Algonquin. Patio rules can change, so call ahead for the dog.',
      },
    ],

    lodging: [
      {
        name: 'Hotel Cofortel',
        type: 'Hotel',
        location: 'Quebec City / airport area (Night 1)',
        petPolicy: 'Pet-friendly rooms may be available; confirm fee and room type',
        familySuitable: true,
        priceRange: '$$',
        rooms: 'Standard family rooms',
        bookingNote: 'Practical first-night choice with easier parking than deep Old Quebec.',
      },
      {
        name: 'Hotel Le Voyageur',
        type: 'Hotel',
        location: 'Quebec City outskirts (Night 1)',
        petPolicy: 'Pet-friendly rooms may be available; confirm directly',
        familySuitable: true,
        priceRange: '$$',
        rooms: 'Simple family rooms',
        bookingNote: 'Good fit when you want value, parking, and quick access back to the highway.',
      },
      {
        name: 'Hotel Champlain',
        type: 'Boutique Hotel',
        location: 'Old Quebec (Night 1)',
        petPolicy: 'Confirm current pet policy before booking',
        familySuitable: true,
        priceRange: '$$$',
        rooms: 'Central rooms near Old Quebec sights',
        bookingNote: 'Better for atmosphere than parking. Use only if Old Quebec access matters more than car convenience.',
      },
      {
        name: 'Rimouski Waterfront Motel or Cottage',
        type: 'Motel / Cottage',
        location: 'Rimouski (Night 2)',
        petPolicy: 'Filter specifically for pet-friendly waterfront units',
        familySuitable: true,
        priceRange: '$$',
        rooms: 'Motel rooms, cottages, or small suites',
        bookingNote: 'Aim for water access so the evening can be a simple sunset walk instead of another activity drive.',
      },
      {
        name: 'Hilton Garden Inn Fredericton',
        type: 'Hotel',
        location: 'Fredericton (Night 3)',
        petPolicy: 'Pet-friendly with fee; verify current policy',
        familySuitable: true,
        priceRange: '$$',
        rooms: 'Downtown rooms and larger configurations',
        bookingNote: 'Good central base for the riverfront trail and downtown restaurants.',
      },
      {
        name: 'Parkland Village Inn',
        type: 'Inn',
        location: 'Alma / Fundy (Nights 4-5)',
        petPolicy: 'Ask for pet-friendly rooms before booking',
        familySuitable: true,
        priceRange: '$$',
        rooms: 'Inn rooms close to Alma village',
        bookingNote: 'Strong base for the 2-night Fundy stay. The point is fewer hotel changes and easy access to the park.',
      },
      {
        name: 'Alpine Motor Inn',
        type: 'Motel',
        location: 'Alma / Fundy (Nights 4-5)',
        petPolicy: 'Pet-friendly rooms may be available; confirm directly',
        familySuitable: true,
        priceRange: '$$',
        rooms: 'Simple motel rooms near Fundy National Park',
        bookingNote: 'No-fuss Alma base when you want to spend time outside instead of in the room.',
      },
      {
        name: 'Vista Ridge Cottages',
        type: 'Cottage',
        location: 'Alma / Fundy (Nights 4-5)',
        petPolicy: 'Confirm pet-friendly cottage availability',
        familySuitable: true,
        priceRange: '$$$',
        rooms: 'Private cottages with more family space',
        bookingNote: 'Best style of stay for kids plus dog if availability and budget work.',
      },
      {
        name: 'Fundy Highlands',
        type: 'Motel / Chalet',
        location: 'Alma / Fundy (Nights 4-5)',
        petPolicy: 'Select pet-friendly units; confirm before booking',
        familySuitable: true,
        priceRange: '$$',
        rooms: 'Motel rooms and chalets',
        bookingNote: 'Useful location at the edge of Fundy National Park. Book early for summer.',
      },
      {
        name: 'The Algonquin Resort',
        type: 'Resort Hotel',
        location: 'St. Andrews (Night 6)',
        petPolicy: 'Pet-friendly rooms available; reserve specifically',
        familySuitable: true,
        priceRange: '$$$$',
        rooms: 'Historic resort rooms and suites',
        bookingNote: 'Signature St. Andrews stay. Great splurge night if pet-friendly inventory is available.',
      },
      {
        name: 'Kennedy House',
        type: 'Inn',
        location: 'St. Andrews (Night 6)',
        petPolicy: 'Confirm pet-friendly rooms before booking',
        familySuitable: true,
        priceRange: '$$$',
        rooms: 'Inn rooms close to town',
        bookingNote: 'Good town-based option for waterfront walks and easy food stops.',
      },
      {
        name: 'Picket Fence Motel',
        type: 'Motel',
        location: 'St. Andrews (Night 6)',
        petPolicy: 'Confirm current pet policy before booking',
        familySuitable: true,
        priceRange: '$$',
        rooms: 'Motel rooms near town',
        bookingNote: 'Practical, lower-key Saint Andrews base for a family plus dog.',
      },
    ],

    seasonTips: {
      june:
        'June brings cooler coastal hiking weather and fewer crowds. Pack rain layers and expect some muddy trail sections in Fundy. Whale watching is starting but not at peak.',
      'late-august':
        'Late August has the warmest water, full services, and strong whale-watching odds near St. Andrews. It is also the toughest heat window for the dog, so keep hikes early and book lodging well ahead.',
      'early-september':
        'Early September is the sweet spot: cooler hiking, fewer families after Labour Day, good coastal weather, and excellent conditions for the dog. This is the recommended season for the 7-day New Brunswick loop.',
    },
  },
];

const ACTIVE_TRIP_IDS = new Set(['eastern-circuit', 'new-brunswick-fundy']);

function getSegmentAttractions(tripId, day, segment) {
  return OPENTRIPMAP_SEGMENT_ATTRACTIONS[tripId]?.[`${day}|${segment.from}|${segment.to}`] || [];
}

function inferAttractionSuitability(attraction) {
  const text = `${attraction.category || ''} ${attraction.kinds || ''}`.toLowerCase();
  const dogFriendlyLikely = [
    'natural',
    'parks',
    'gardens',
    'beaches',
    'view_points',
    'historic',
    'architecture',
    'urban_environment',
    'tourist_facilities',
  ].some(kind => text.includes(kind));
  const kidFriendlyLikely = [
    'amusements',
    'museums',
    'natural',
    'parks',
    'gardens',
    'beaches',
    'historic',
    'architecture',
    'cultural',
    'tourist_facilities',
    'theatres',
    'cinemas',
  ].some(kind => text.includes(kind));

  return { dogFriendlyLikely, kidFriendlyLikely };
}

function buildSegmentPoi(trip, day, segment, attraction) {
  const suitability = inferAttractionSuitability(attraction);
  return {
    name: attraction.name,
    location: `${segment.from} to ${segment.to}`,
    address: attraction.address,
    description: `${attraction.description} Segment: ${segment.from} to ${segment.to}.`,
    dogFriendly: suitability.dogFriendlyLikely,
    kidFriendly: suitability.kidFriendlyLikely,
    dogFriendlyLikely: suitability.dogFriendlyLikely,
    kidFriendlyLikely: suitability.kidFriendlyLikely,
    day,
    tags: ['OpenTripMap', attraction.category, 'segment stop'].filter(Boolean),
    dogNote: suitability.dogFriendlyLikely
      ? 'Likely dog-friendly based on OpenTripMap category. Verify current access, leash rules, and seasonal hours before visiting.'
      : 'Dog access is unclear from OpenTripMap data. Verify directly before visiting with the dog.',
    googleMapsUrl: attraction.url,
    source: 'OpenTripMap',
    sourceId: attraction.xid,
  };
}

function buildSegmentMapPoint(day, segment, attraction) {
  const suitability = inferAttractionSuitability(attraction);
  return {
    category: 'poi',
    day,
    name: attraction.name,
    location: `${segment.from} to ${segment.to}`,
    coords: attraction.coords,
    note: `${attraction.category} from OpenTripMap, ${attraction.location}.`,
    dogFriendlyLikely: suitability.dogFriendlyLikely,
    kidFriendlyLikely: suitability.kidFriendlyLikely,
    sourceId: attraction.xid,
  };
}

function withOpenTripMapAttractions(trip) {
  const segmentPois = [];
  const segmentMapPoints = [];
  const route = {
    ...trip.route,
    itinerary: trip.route.itinerary.map(day => ({
      ...day,
      driveSegments: (day.driveSegments || []).map(segment => {
        const attractions = getSegmentAttractions(trip.id, day.day, segment);
        attractions.forEach(attraction => {
          segmentPois.push(buildSegmentPoi(trip, day.day, segment, attraction));
          segmentMapPoints.push(buildSegmentMapPoint(day.day, segment, attraction));
        });
        return attractions.length > 0
          ? { ...segment, attractions: attractions.map(attraction => ({ ...attraction, ...inferAttractionSuitability(attraction) })) }
          : segment;
      }),
    })),
  };

  return {
    ...trip,
    route: {
      ...route,
      mapPoints: [...(route.mapPoints || []), ...segmentMapPoints],
    },
    poi: [...(trip.poi || []), ...segmentPois],
  };
}

export const TRIPS = ALL_TRIPS
  .filter(trip => ACTIVE_TRIP_IDS.has(trip.id))
  .map(withOpenTripMapAttractions);
