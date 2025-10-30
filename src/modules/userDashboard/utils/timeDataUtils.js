import { DateTime } from "luxon";

const processes = [
    { name: "Pantusa Atlanta", timezone: "America/New_York", zone: "EST", lat: 33.7490, lng: -84.3880 },
    { name: "Pantusa Nashville", timezone: "America/Chicago", zone: "CST", lat: 36.1627, lng: -86.7816 },
    { name: "Duggers", timezone: "America/Denver", zone: "MST", lat: 39.7392, lng: -104.9903 },
    { name: "QT-SD", timezone: "America/Los_Angeles", zone: "PST", lat: 32.7157, lng: -117.1611 },
    { name: "Empire", timezone: "America/New_York", zone: "EST", lat: 40.7128, lng: -74.0060 },
    { name: "777", timezone: "America/Los_Angeles", zone: "PST", lat: 34.0522, lng: -118.2437 },
];

const duggersCities = [
    { name: "Phoenix", timezone: "America/Phoenix", zone: "MST", lat: 33.4484, lng: -112.0740 },
    { name: "Albuquerque", timezone: "America/Denver", zone: "MST", lat: 35.0844, lng: -106.6504 }
];

export const fetchTimeData = (selectedAccount, accountData) => {
    try {
        let locationsToFetch = [];

        const matchedAccount = accountData.find(acc => acc.name === selectedAccount);

        if (matchedAccount?.Locations?.length > 0) {
            locationsToFetch = matchedAccount.Locations.map(loc => ({
                name: loc.location,
                timezone: loc.timezone,
                yardAddress: loc.yardAddress,
                hours: loc.hours,
                _id: loc._id,
            }));
        } else {
            const predefinedAccount = processes.find(acc => acc.name === selectedAccount);
            if (predefinedAccount) {
                locationsToFetch = [predefinedAccount];
            } else if (selectedAccount === "Duggers") {
                locationsToFetch = duggersCities;
            } else {
                locationsToFetch = [{ name: selectedAccount, timezone: "America/Los_Angeles", zone: "PST" }];
            }
        }

        const times = locationsToFetch.map(location => {
            if (!location.timezone) {
                throw new Error(`Missing timezone for location: ${location.name}`);
            }

            const localTime = DateTime.now().setZone(location.timezone);
            const formattedTime = localTime.toLocaleString(DateTime.TIME_SIMPLE);
            const zone = localTime.offsetNameShort;

            return {
                ...location,
                formattedTime,
                zone,
                timeData: {
                    timeZoneId: location.timezone,
                    rawOffset: localTime.offset,
                }
            };
        });

        return times;
    } catch (err) {
        console.error("Luxon error:", err);
        return [];
    }
};