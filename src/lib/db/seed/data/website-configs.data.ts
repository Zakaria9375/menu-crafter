export const websiteConfigsData = [
	{
		// Bella Italia
		businessType: "RESTAURANT" as const,
		websiteConfig: {
			theme: "modern",
			primaryColor: "#E31837", // Italian Red
			content: {
				hero: {
					title: "Authentic Italian Flavors",
					subtitle: "Experience the taste of Rome in the heart of New York",
					ctaText: "Book a Table",
					ctaLink: "/reservation",
					backgroundImage:
						"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
				},
				about: {
					title: "Our Tradition",
					description:
						"Founded in 1985, Bella Italia brings family recipes passed down through generations. We believe in fresh ingredients, handmade pasta, and the warmth of Italian hospitality.",
					image:
						"https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
					imagePosition: "right",
				},
				whyUs: {
					title: "The Bella Difference",
					features: [
						{
							title: "Handmade Pasta",
							description: "Freshly made every morning by our chefs.",
						},
						{
							title: "Imported Wine",
							description: "A curated selection from Tuscany and Piedmont.",
						},
						{
							title: "Wood-Fired Oven",
							description: "Authentic Neapolitan pizza cooked to perfection.",
						},
					],
				},
				menu: {
					title: "Our Delicious Menu",
					description: "Freshly prepared Italian classics.",
					showImages: true,
				},
				footer: {
					text: "© 2024 Bella Italia Restaurant. Buon Appetito!",
					links: [
						{ label: "Privacy Policy", url: "/privacy" },
						{ label: "Terms of Service", url: "/terms" },
					],
					showSocialLinks: true,
					socialLinks: {
						facebook: "https://facebook.com/bellaitalia",
						instagram: "https://instagram.com/bellaitalia",
					},
				},
			},
		},
	},
	{
		// Sushi Palace
		businessType: "RESTAURANT" as const,
		websiteConfig: {
			theme: "minimal",
			primaryColor: "#0F172A", // Dark Slate
			content: {
				hero: {
					title: "Art of Sushi",
					subtitle: "Freshness and precision in every roll",
					ctaText: "View Menu",
					ctaLink: "/menu",
					backgroundImage:
						"https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
					overlayOpacity: 0.3,
				},
				about: {
					title: "Master Chefs",
					description:
						"Sushi Palace offers an exquisite dining experience with fish flown in daily from Tokyo's Toyosu Market. Our Omakase experience is rated #1 in the city.",
					image:
						"https://images.unsplash.com/photo-1611143669185-af224c5e3252?ixlib=rb-4.0.3&auto=format&fit=crop&w=1332&q=80",
					imagePosition: "left",
				},
				footer: {
					text: "© 2024 Sushi Palace.",
				},
			},
		},
	},
	{
		// Burger Heaven
		businessType: "RESTAURANT" as const,
		websiteConfig: {
			theme: "bold",
			primaryColor: "#F59E0B", // Amber
			content: {
				hero: {
					title: "BURGER HEAVEN",
					subtitle: "JUICY. CHEESY. HEAVENLY.",
					ctaText: "ORDER NOW",
					ctaLink: "/order",
					backgroundImage:
						"https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=930&q=80",
				},
				whyUs: {
					title: "Why We Rule",
					features: [
						{
							title: "100% Angus Beef",
							description: "No fillers, just premium meat.",
						},
						{
							title: "Secret Sauce",
							description: "You'll want to bathe in it.",
						},
						{
							title: "Crispy Fries",
							description: "Double fried for extra crunch.",
						},
					],
				},
				footer: {
					text: "Burger Heaven Inc.",
				},
			},
		},
	},
	{
		// Vegan Delights
		businessType: "RESTAURANT" as const,
		websiteConfig: {
			theme: "nature",
			primaryColor: "#10B981", // Emerald
			content: {
				hero: {
					title: "Plant-Based Perfection",
					subtitle: "Healthy, sustainable, and delicious",
					ctaText: "Our Story",
					ctaLink: "/about",
					backgroundImage:
						"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
				},
				footer: {
					text: "© 2024 Vegan Delights. Earth First.",
				},
			},
		},
	},
	{
		// Cafe Mocha
		businessType: "CAFE" as const,
		websiteConfig: {
			theme: "cozy",
			primaryColor: "#78350F", // Brown
			content: {
				hero: {
					title: "Wake Up & Smell the Coffee",
					subtitle: "Artisan roasts and house-made pastries",
					ctaText: "Visit Us",
					ctaLink: "/location",
					backgroundImage:
						"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
				},
				about: {
					title: "Your Neighborhood Spot",
					description:
						"Whether you're working remotely or catching up with friends, Cafe Mocha is your living room away from home.",
				},
				footer: {
					text: "Cafe Mocha Ltd.",
				},
			},
		},
	},
];
