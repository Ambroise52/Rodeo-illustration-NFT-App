import { PromptOptions, RarityTier } from './types';

export const PROMPT_OPTIONS: PromptOptions = {
  CHARACTERS: [
    "Geometric minimalist humanoid", "Stylized flat-design person", "Abstract blocky figure", 
    "Rounded cartoon character", "Angular robot-like being", "Fluid blob-shaped creature", 
    "Cylindrical stick figure", "Pyramid-headed character", "Spherical floating entity", 
    "Cube-based person", "Origami-folded figure", "Wireframe outline character", 
    "Silhouette shadow being", "Gradient-filled shape", "Pattern-textured figure", 
    "Glowing neon outline", "Pixelated retro sprite", "Paper-cut layered person", 
    "Geometric cat-person hybrid", "Geometric dog-person hybrid", "Floating head with limbs", 
    "Segmented modular character", "Ribbon-wrapped being", "Crystal faceted person", 
    "Stacked shapes character", "Spiral-formed being", "Cloud-bodied character", 
    "Fire-shaped entity", "Water droplet person", "Constellation star-being"
  ],
  ACTIONS: [
    // Athletic
    "Parkour vaulting", "Backflipping continuously", "Skateboarding with tricks", 
    "Surfing on waves", "Snowboarding down slopes", "Climbing upward", 
    "Swinging from objects", "High jumping", "Sprint running", "Speed skating", 
    "BMX biking tricks", "Rock climbing", "Bungee jumping pose", "Skydiving position", 
    "Trampolining", "Gymnastics split", "Cartwheel mid-motion", "Handstand balanced", 
    "Breakdancing freeze", "Headspin position", "Moonwalk pose", "Capoeira kick", 
    "Martial arts kata", "Kickboxing combo", "Boxing stance",
    // Creative
    "Painting air canvas", "Sculpting invisible clay", "Playing air guitar", 
    "Drumming energetically", "DJ turntables", "Singing with microphone", 
    "Beatboxing", "Conducting orchestra", "Magic card tricks", 
    "Juggling geometric shapes", "Flying a kite", "Taking photographs", 
    "Typing frantically", "Drawing with light", "Graffiti spraying", 
    "Cooking dramatically", "Mixing cocktails", "Coffee art creating", 
    "Playing piano gesture", "Violin bow movement",
    // Playful
    "Jumping rope", "Hula hooping", "Yo-yo spinning", "Riding unicycle", 
    "Pogo sticking", "Rollerblading", "Scooter riding", "Hoverboard floating", 
    "Office chair spinning", "Balloon releasing", "Confetti throwing", "Frisbee tossing",
    // Zen
    "Yoga tree pose", "Meditation floating", "Tai chi flowing", "Lotus position", 
    "Stretching gracefully", "Mindful walking", "Tea ceremony", "Stargazing peaceful", 
    "Breathing deeply",
    // Surreal
    "Transforming shape-shifting", "Phasing through dimensions", "Teleporting with flash", 
    "Gravity defying", "Portal jumping", "Galaxy spinning within", "Lightning channeling", 
    "Rainbow sliding", "Crystal growing from hands", "Levitating mysteriously"
  ],
  BACKGROUNDS: [
    "Clear blue sky with clouds", "Sunset gradient orange-purple", "Sunrise pink-blue", 
    "Starry night sky", "Aurora borealis waves", "Cosmic galaxy swirl", 
    "Geometric hexagon grid", "Triangle tessellation", "Abstract shape patterns", 
    "Floating platforms", "Spiral patterns", "Radial burst lines", 
    "City skyline silhouette", "Neon cyberpunk street", "Mountain range backdrop", 
    "Ocean waves simplified", "Desert dunes minimal", "Forest tree silhouettes", 
    "Beach shoreline", "Rolling hills", "Solid gradient field", "Two-tone split", 
    "Bokeh blur circles", "Portal vortex swirl", "Wormhole tunnel", "Energy waves", 
    "Paint splatter", "Watercolor wash", "Comic book dots", "Circuit board pattern", 
    "Wireframe grid", "Musical staff lines", "Retro 80s grid", "Vaporwave aesthetic", 
    "Memphis design patterns", "Art deco geometry", "Minimalist horizon line", 
    "Cloud formations", "Lightning storm", "Crystal cave backdrop"
  ],
  COLORS: [
    "Orange, green, and black", "Pink, yellow, and blue", "Purple, cyan, and white", 
    "Red, blue, and black", "Lime, magenta, and yellow", "Turquoise, coral, and cream", 
    "Sunset orange, purple, and gold", "Ruby, emerald, and sapphire", 
    "80s neon pink, cyan, and purple", "Vaporwave pink, cyan, and teal", 
    "Cyberpunk cyan, magenta, and black", "Retro 70s burnt-orange, olive, and mustard", 
    "Pastel kawaii pink, lavender, and mint", "Ocean navy, teal, and aqua", 
    "Forest deep-green, brown, and moss", "Cosmic purple, pink, and star-white", 
    "Candy bubblegum pink, light-purple", "Midnight navy, black, and dim-gold", 
    "Golden hour warm-gold, orange, and pink", "Neon rainbow bright-fluorescents", 
    "Monochrome grayscale, neon-pink-accent", "Art deco gold, black, and emerald", 
    "Desert sand, terracotta, and sky-blue", "Aurora green, purple, and pink", 
    "Solar yellow, orange, and white", "Infrared red, pink, and purple", 
    "Holographic iridescent-shift", "Sepia brown, tan, and cream", 
    "Matrix neon-green, black", "Luxury rose-gold, navy, and burgundy"
  ],
  EFFECTS: [
    "Soft motion trails", "Geometric sparkles", "Floating decorative shapes", 
    "Subtle light gradient", "Clean energy lines", "Abstract geometric patterns", 
    "Soft color shift", "Subtle glow", "Clean speed lines", "Floating geometric particles",
    "Minimalist light rays", "Soft bokeh circles", "Vector stardust", 
    "Prismatic accent shapes", "Matte finish overlay"
  ]
};

export const STYLE_OPTIONS = {
  SHAPE_STYLES: [
    "smooth flowing geometric shapes", "organic curves with angular elements",
    "overlapping layered shapes", "clean shape edges", "smooth organic forms",
    "modern vector shapes", "interlocking geometry"
  ],
  COLOR_APPS: [
    "smooth solid colors", "harmonious limited palette", "flat color fills",
    "color blocking with no gradients", "shapes defined by color contrast"
  ],
  LINE_WORKS: [
    "no outlines", "shapes defined by color contrast", "zero line weight",
    "borderless shapes", "pure shape composition"
  ],
  COMPOSITIONS: [
    "dynamic action pose", "asymmetric balance", "playful spatial relationship",
    "floating decorative elements", "clean negative space", "balanced geometric layout"
  ],
  CHAR_DETAILS: [
    "simplified geometric anatomy", "minimal facial features",
    "flowing body forms", "abstract stylized figure", "smooth silhouette"
  ],
  BG_SIMPLICITIES: [
    "simple solid color background", "soft gradient background",
    "minimal geometric accents", "clean matte background"
  ],
  QUALITY_BOOSTERS: [
    "behance featured", "dribbble aesthetic", "professional digital illustration",
    "award winning flat art", "modern graphic design"
  ]
};

export const NEGATIVE_PROMPT = "thick black outlines, heavy borders, comic book style, line art, sketch lines, ink outlines, cartoon outlines, stroke edges, harsh edges, realistic rendering, 3D effects, shadows, textures, gradients on characters, busy composition, detailed shading, photorealistic, airbrushed, noise, grain, grunge, realistic lighting, volumetric light, glossy finish";

export interface RarityConfigItem {
  chance: number;
  minEth: number;
  maxEth: number;
  color: string;
  bg: string;
  border: string;
  glow?: string;
  effectsCount: number[];
  badgeColor: string;
}

export const RARITY_CONFIG: Record<RarityTier, RarityConfigItem> = {
  COMMON: { 
    chance: 0.60, 
    minEth: 3.0, 
    maxEth: 4.0, 
    color: 'text-gray-400', 
    bg: 'bg-gray-800', 
    border: 'border-gray-600',
    effectsCount: [0, 1],
    badgeColor: 'bg-gray-600'
  },
  UNCOMMON: { 
    chance: 0.25, 
    minEth: 4.1, 
    maxEth: 6.0, 
    color: 'text-green-400', 
    bg: 'bg-green-900/30', 
    border: 'border-green-500',
    effectsCount: [2],
    badgeColor: 'bg-green-600'
  },
  RARE: { 
    chance: 0.10, 
    minEth: 6.1, 
    maxEth: 8.0, 
    color: 'text-blue-400', 
    bg: 'bg-blue-900/30', 
    border: 'border-blue-500', 
    glow: 'shadow-blue-500/50',
    effectsCount: [3],
    badgeColor: 'bg-blue-600'
  },
  EPIC: { 
    chance: 0.04, 
    minEth: 8.1, 
    maxEth: 9.0, 
    color: 'text-purple-400', 
    bg: 'bg-purple-900/30', 
    border: 'border-purple-500', 
    glow: 'shadow-purple-500/50',
    effectsCount: [4],
    badgeColor: 'bg-purple-600'
  },
  LEGENDARY: { 
    chance: 0.01, 
    minEth: 9.1, 
    maxEth: 10.0, 
    color: 'text-yellow-400', 
    bg: 'bg-yellow-900/30', 
    border: 'border-yellow-500', 
    glow: 'shadow-yellow-500/50',
    effectsCount: [5],
    badgeColor: 'bg-yellow-500'
  },
};

export const APP_CONFIG = {
  CURRENCY_SYMBOL: 'Ξ',
};

const createMapping = (desc: string, vibe: string) => ({ desc, vibe });

export const ANIMATION_MAPPINGS = {
  ACTIONS: {
    // Athletic
    "Parkour vaulting": createMapping("smoothly vault over an invisible obstacle with fluid grace and a perfect landing", "athletic and agile"),
    "Backflipping continuously": createMapping("perform a continuous backflip loop, tucking and extending rhythmically", "energetic and acrobatic"),
    "Skateboarding with tricks": createMapping("perform a smooth kickflip trick, board rotating 360 degrees while maintaining balance", "fluid and dynamic"),
    "Surfing on waves": createMapping("carve through the air as if riding an invisible wave, shifting weight dynamically", "smooth and flowing"),
    "Snowboarding down slopes": createMapping("lean side to side carving invisible snow, knees bent and arms balancing", "fast and rhythmic"),
    "Climbing upward": createMapping("mimic a climbing motion, reaching up and pulling down in a rhythmic cycle", "strong and steady"),
    "Swinging from objects": createMapping("swing back and forth like a pendulum, legs kicking out at the peak of each arc", "momentum-based and sweeping"),
    "High jumping": createMapping("perform a Fosbury flop motion, arching back over an invisible bar and resetting", "explosive and floaty"),
    "Sprint running": createMapping("run in place with a dynamic stride cycle, arms pumping and legs moving in a blur", "high-speed and intense"),
    "Speed skating": createMapping("glide side to side in a low crouch, pushing off with power", "rhythmic and sweeping"),
    "BMX biking tricks": createMapping("pull up the handlebars and rotate the frame in a bar-spin motion", "mechanical and precise"),
    "Rock climbing": createMapping("reach specifically for invisible holds, shifting body weight with calculation", "deliberate and tense"),
    "Bungee jumping pose": createMapping("bounce vertically with limbs flailing slightly in freefall wind", "elastic and rebounding"),
    "Skydiving position": createMapping("arch back in a spread-eagle stability position, wind rippling the silhouette", "suspended and airy"),
    "Trampolining": createMapping("bounce rhythmically up and down, extending toes at the peak", "bouncy and vertical"),
    "Gymnastics split": createMapping("perform a leaping split in mid-air, holding the pose before landing softly", "flexible and graceful"),
    "Cartwheel mid-motion": createMapping("rotate in a continuous cartwheel loop, limbs acting like spokes of a wheel", "circular and dizzying"),
    "Handstand balanced": createMapping("maintain a perfect handstand, making micro-adjustments to stay balanced", "stable and inverted"),
    "Breakdancing freeze": createMapping("spin on one hand while legs flare out in a windmill motion", "cool and street-style"),
    "Headspin position": createMapping("rotate rapidly on the head axis, legs creating a blurred cone shape", "spinning and centrifugal"),
    "Moonwalk pose": createMapping("glide backwards continuously while simulating a walking motion", "smooth and illusionary"),
    "Capoeira kick": createMapping("perform a sweeping spinning kick in slow motion", "dance-like and martial"),
    "Martial arts kata": createMapping("execute a crisp punch and block sequence with snap", "sharp and disciplined"),
    "Kickboxing combo": createMapping("throw a jab-cross-kick combination in a seamless loop", "aggressive and fast"),
    "Boxing stance": createMapping("bob and weave rhythmically, shadow boxing with light footwork", "reactive and bouncy"),
    
    // Creative
    "Painting air canvas": createMapping("sweep arm across the air leaving a trailing stroke of color", "artistic and sweeping"),
    "Sculpting invisible clay": createMapping("mold the air with hands, shaping an invisible sphere", "tactile and creative"),
    "Playing air guitar": createMapping("strum wildly with head banging to the silent beat", "rocking and passionate"),
    "Drumming energetically": createMapping("strike invisible drums with rapid stick movements", "percussive and fast"),
    "DJ turntables": createMapping("scratch and mix on invisible decks, nodding head to the beat", "musical and cool"),
    "Singing with microphone": createMapping("belt out a note with emotion, chest expanding and hand gesturing", "expressive and vocal"),
    "Beatboxing": createMapping("move hands near mouth to accentuate rhythm, bouncing slightly", "urban and rhythmic"),
    "Conducting orchestra": createMapping("wave a baton with grand sweeping gestures controlling the tempo", "commanding and classical"),
    "Magic card tricks": createMapping("fan out cards and make them vanish and reappear in a loop", "mysterious and sleight-of-hand"),
    "Juggling geometric shapes": createMapping("juggle three glowing shapes in a perfect cascade pattern", "coordinated and hypnotic"),
    "Flying a kite": createMapping("pull on an invisible string, looking up as wind resistance pulls back", "leisurely and windy"),
    "Taking photographs": createMapping("raise a camera, focus, and snap a shot, repeatedly capturing the scene", "observational and still"),
    "Typing frantically": createMapping("type rapidly on a holographic keyboard, fingers moving in a blur", "tech-focused and busy"),
    "Drawing with light": createMapping("draw glowing shapes in the air that fade slowly", "luminous and flowing"),
    "Graffiti spraying": createMapping("spray a can in sweeping arcs, shaking it occasionally", "street-art style and rebellious"),
    "Cooking dramatically": createMapping("toss ingredients in a pan with a flourish", "culinary and skilled"),
    "Mixing cocktails": createMapping("shake a shaker vigorously over the shoulder", "sophisticated and rhythmic"),
    "Coffee art creating": createMapping("pour a steady stream with precision, creating a pattern", "delicate and fluid"),
    "Playing piano gesture": createMapping("run fingers along invisible keys, body swaying with the melody", "melodic and emotional"),
    "Violin bow movement": createMapping("draw a long bow stroke with vibrato in the left hand", "classical and smooth"),
    
    // Playful
    "Jumping rope": createMapping("jump rhythmically as a rope swings under feet and over head", "repetitive and cardiovascular"),
    "Hula hooping": createMapping("gyrate hips to keep a spinning hoop in orbit", "circular and fun"),
    "Yo-yo spinning": createMapping("flick wrist to send a yo-yo down and back up", "mechanical and playful"),
    "Riding unicycle": createMapping("pedal to maintain balance on a single wheel, arms waving slightly", "balancing and circus-like"),
    "Pogo sticking": createMapping("bounce vertically with high energy", "up-and-down and jerky"),
    "Rollerblading": createMapping("stride forward with skating motion", "gliding and linear"),
    "Scooter riding": createMapping("push off the ground and glide", "urban and casual"),
    "Hoverboard floating": createMapping("lean forward slightly to accelerate, floating above ground", "futuristic and smooth"),
    "Office chair spinning": createMapping("spin around in a seated position with glee", "dizzy and relatable"),
    "Balloon releasing": createMapping("watch a balloon drift upward, reaching for it", "wistful and slow"),
    "Confetti throwing": createMapping("toss handfuls of confetti that flutter down endlessly", "celebratory and chaotic"),
    "Frisbee tossing": createMapping("coil and uncoil to throw a disc flat and straight", "athletic and casual"),

    // Zen
    "Yoga tree pose": createMapping("stand perfectly still on one leg, branches swaying slightly", "balanced and peaceful"),
    "Meditation floating": createMapping("hover cross-legged, bobbing gently in mid-air", "spiritual and weightless"),
    "Tai chi flowing": createMapping("move hands through invisible water with slow resistance", "slow and mindful"),
    "Lotus position": createMapping("sit calmly with chest rising and falling in deep breath", "serene and grounded"),
    "Stretching gracefully": createMapping("reach arms overhead in a long, satisfying stretch", "relaxing and elongating"),
    "Mindful walking": createMapping("take slow, deliberate steps, placing heel then toe", "meditative and slow"),
    "Tea ceremony": createMapping("pour tea with ritualistic precision", "calm and traditional"),
    "Stargazing peaceful": createMapping("look upward with wonder, pointing occasionally", "quiet and awe-inspired"),
    "Breathing deeply": createMapping("inhale and exhale visibly, glowing with energy on breath in", "respiratory and glowing"),

    // Surreal
    "Transforming shape-shifting": createMapping("morph smoothly between two geometric forms", "fluid and impossible"),
    "Phasing through dimensions": createMapping("flicker in and out of existence, becoming transparent", "glitchy and dimensional"),
    "Teleporting with flash": createMapping("vanish in a flash of light and reappear slightly offset", "instant and energetic"),
    "Gravity defying": createMapping("rotate slowly on an arbitrary axis, ignoring gravity", "disorienting and space-like"),
    "Portal jumping": createMapping("jump into a hole in space and fall out from above", "looping and sci-fi"),
    "Galaxy spinning within": createMapping("stand still while a galaxy texture rotates inside the body silhouette", "cosmic and internal"),
    "Lightning channeling": createMapping("conduct electricity between hands, arcs crackling", "powerful and elemental"),
    "Rainbow sliding": createMapping("slide down a manifesting spectrum of color", "colorful and magical"),
    "Crystal growing from hands": createMapping("watch crystals form and dissolve rapidly on palms", "organic and crystalline"),
    "Levitating mysteriously": createMapping("rise from the ground without moving a muscle", "supernatural and eerie"),
  },
  BACKGROUNDS: {
    "Clear blue sky with clouds": "white fluffy clouds drifting slowly from left to right",
    "Sunset gradient orange-purple": "the sun dipping slowly below the horizon, changing light intensity",
    "Sunrise pink-blue": "morning light intensifying as the sun rises",
    "Starry night sky": "stars twinkling rhythmically and a shooting star passing occasionally",
    "Aurora borealis waves": "green and purple lights curtaining across the sky",
    "Cosmic galaxy swirl": "the spiral galaxy rotating majestically in the background",
    "Geometric hexagon grid": "hexagons pulsing and interlocking in a tech pattern",
    "Triangle tessellation": "triangles shifting colors in a mesmerizing pattern",
    "Abstract shape patterns": "shapes floating and rotating gently in 3D space",
    "Floating platforms": "platforms bobbing gently in zero gravity",
    "Spiral patterns": "the spiral rotating continuously into the center",
    "Radial burst lines": "lines radiating outward like a sunburst animation",
    "City skyline silhouette": "lights in the building windows flickering on and off",
    "Neon cyberpunk street": "neon signs buzzing and holographic ads playing",
    "Mountain range backdrop": "mist rolling over the mountain peaks",
    "Ocean waves simplified": "stylized waves rolling and cresting endlessly",
    "Desert dunes minimal": "heat haze shimmering above the sand",
    "Forest tree silhouettes": "leaves rustling in a gentle breeze",
    "Beach shoreline": "tide creeping in and washing out rhythmically",
    "Rolling hills": "grass waving in wind across the hills",
    "Solid gradient field": "colors shifting slightly in hue and intensity",
    "Two-tone split": "the division line oscillating gently",
    "Bokeh blur circles": "lights fading in and out of focus",
    "Portal vortex swirl": "the vortex spinning and pulling inward",
    "Wormhole tunnel": "moving forward through the tunnel at high speed",
    "Energy waves": "waves of energy pulsating horizontally",
    "Paint splatter": "drops of paint appearing and dripping down",
    "Watercolor wash": "colors bleeding into each other like wet paint",
    "Comic book dots": "halftone dots changing size to simulate shading",
    "Circuit board pattern": "electrons flowing along the circuit paths",
    "Wireframe grid": "the grid scrolling underneath like a synthwave landscape",
    "Musical staff lines": "notes floating along the staff lines",
    "Retro 80s grid": "a neon sun setting over a scrolling grid floor",
    "Vaporwave aesthetic": "statues and palm trees drifting in a void",
    "Memphis design patterns": "squiggles and dots popping in and out",
    "Art deco geometry": "gold lines shimmering with metallic sheen",
    "Minimalist horizon line": "the sun crossing the sky in an arc",
    "Cloud formations": "clouds forming and dissipating",
    "Lightning storm": "lightning bolts flashing in the distance",
    "Crystal cave backdrop": "crystals glowing and pulsing with inner light"
  }
};