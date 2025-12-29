export const DAYS_OF_WEEK = [
	{ id: "monday", name: "Monday", short: "Mon" },
	{ id: "tuesday", name: "Tuesday", short: "Tue" },
	{ id: "wednesday", name: "Wednesday", short: "Wed" },
	{ id: "thursday", name: "Thursday", short: "Thu" },
	{ id: "friday", name: "Friday", short: "Fri" },
	{ id: "saturday", name: "Saturday", short: "Sat" },
	{ id: "sunday", name: "Sunday", short: "Sun" },
] as const;

export interface DayHours {
	enabled: boolean;
	startTime: string;
	endTime: string;
}

export const DEFAULT_HOURS: Record<string, DayHours> = {
	monday: { enabled: true, startTime: "09:00", endTime: "22:00" },
	tuesday: { enabled: true, startTime: "09:00", endTime: "22:00" },
	wednesday: { enabled: true, startTime: "09:00", endTime: "22:00" },
	thursday: { enabled: true, startTime: "09:00", endTime: "22:00" },
	friday: { enabled: true, startTime: "09:00", endTime: "23:00" },
	saturday: { enabled: true, startTime: "10:00", endTime: "23:00" },
	sunday: { enabled: false, startTime: "12:00", endTime: "21:00" },
};

export const HOURS_PRESETS = {
	standard: DAYS_OF_WEEK.reduce(
		(acc, day) => ({
			...acc,
			[day.id]: {
				enabled: true,
				startTime: "09:00",
				endTime: "22:00",
			},
		}),
		{} as Record<string, DayHours>
	),
	extended: DAYS_OF_WEEK.reduce(
		(acc, day) => ({
			...acc,
			[day.id]: {
				enabled: true,
				startTime: "07:00",
				endTime: "23:00",
			},
		}),
		{} as Record<string, DayHours>
	),
	weekendExtended: DAYS_OF_WEEK.reduce(
		(acc, day) => ({
			...acc,
			[day.id]: {
				enabled: true,
				startTime: ["saturday", "sunday"].includes(day.id) ? "10:00" : "09:00",
				endTime: ["saturday", "sunday"].includes(day.id) ? "23:00" : "22:00",
			},
		}),
		{} as Record<string, DayHours>
	),
};

export type DayId = (typeof DAYS_OF_WEEK)[number]["id"];
