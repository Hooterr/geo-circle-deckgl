const earth_radius_meters = 6371008;

export interface TwilightInfo {
    position: [number, number],
    radius: number
}

export function getTwilightInfo(date: Date, angle: number): TwilightInfo {
    return {
        position: getShadowPosition(date),
        radius: getShadowRadiusFromAngle(angle)
    }
}

function getShadowRadiusFromAngle(angle: number) {
    var shadow_radius = earth_radius_meters * Math.PI * 0.5;
    var twilight_dist = ((earth_radius_meters * 2 * Math.PI) / 360) * angle;
    return shadow_radius - twilight_dist;
}

function getShadowPosition(date: Date): [number, number] {
    const sun_position = calculatePositionOfSun(date);
    return [sun_position[1] + 180, -sun_position[0]]
}

function jday(date: Date) {
    return (date.getTime() / 86400000.0) + 2440587.5;
}

function calculatePositionOfSun(date: Date) {
    var rad = 0.017453292519943295;

    // based on NOAA solar calculations
    var ms_past_midnight = ((date.getUTCHours() * 60 + date.getUTCMinutes()) * 60 + date.getUTCSeconds()) * 1000 + date.getUTCMilliseconds();
    var jc = (jday(date) - 2451545) / 36525;
    var mean_long_sun = (280.46646 + jc * (36000.76983 + jc * 0.0003032)) % 360;
    var mean_anom_sun = 357.52911 + jc * (35999.05029 - 0.0001537 * jc);
    var sun_eq = Math.sin(rad * mean_anom_sun) * (1.914602 - jc * (0.004817 + 0.000014 * jc)) + Math.sin(rad * 2 * mean_anom_sun) * (0.019993 - 0.000101 * jc) + Math.sin(rad * 3 * mean_anom_sun) * 0.000289;
    var sun_true_long = mean_long_sun + sun_eq;
    var sun_app_long = sun_true_long - 0.00569 - 0.00478 * Math.sin(rad * 125.04 - 1934.136 * jc);
    var mean_obliq_ecliptic = 23 + (26 + ((21.448 - jc * (46.815 + jc * (0.00059 - jc * 0.001813)))) / 60) / 60;
    var obliq_corr = mean_obliq_ecliptic + 0.00256 * Math.cos(rad * 125.04 - 1934.136 * jc);

    var lat = Math.asin(Math.sin(rad * obliq_corr) * Math.sin(rad * sun_app_long)) / rad;

    var eccent = 0.016708634 - jc * (0.000042037 + 0.0000001267 * jc);
    var y = Math.tan(rad * (obliq_corr / 2)) * Math.tan(rad * (obliq_corr / 2));
    var rq_of_time = 4 * ((y * Math.sin(2 * rad * mean_long_sun) - 2 * eccent * Math.sin(rad * mean_anom_sun) + 4 * eccent * y * Math.sin(rad * mean_anom_sun) * Math.cos(2 * rad * mean_long_sun) - 0.5 * y * y * Math.sin(4 * rad * mean_long_sun) - 1.25 * eccent * eccent * Math.sin(2 * rad * mean_anom_sun)) / rad);
    var true_solar_time_in_deg = ((ms_past_midnight + rq_of_time * 60000) % 86400000) / 240000;

    var lng = -((true_solar_time_in_deg < 0) ? true_solar_time_in_deg + 180 : true_solar_time_in_deg - 180);

    return [lat, lng];
}

const twilights = {
    sunrise: 0.566666,
    civil: 6,
    nautical: 12,
    astronomical: 18,
};

