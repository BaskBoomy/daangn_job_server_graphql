import proj4 from 'proj4';
import { config } from "../config.js";
import LocationModel from "../models/location.js";
export async function getNearAddressByCoordinate(currentX, currentY) {
    const grs = convertWGSToGRS(currentX, currentY);
    return await getKoreaAddress()
        .then((address) => {
        return address.map((data) => {
            return {
                address: data.ADMNM,
                directDistance: getDirectDistance(grs[0], grs[1], parseFloat(data.X), parseFloat(data.Y)),
                X: data.X,
                Y: data.Y,
                currentX: parseFloat(currentX),
                currentY: parseFloat(currentY),
            };
            ;
        }).sort(sortByDistance).slice(0, 60);
    });
}
function convertWGSToGRS(x, y) {
    const coorX = parseFloat(x);
    const coorY = parseFloat(y);
    const wgs84 = config.coordinate.wgs84;
    const grs80 = config.coordinate.grs80;
    if (x && y) {
        const result = proj4(wgs84, grs80, [coorY, coorX]);
        return [result[0], result[1]];
    }
}
async function getKoreaAddress() {
    return await LocationModel.find();
}
function getDirectDistance(x1, y1, x2, y2) {
    const x = getAbsoluteValue(x2 - x1);
    const y = getAbsoluteValue(y2 - y1);
    return Math.sqrt((x * x) + (y * y));
}
function getAbsoluteValue(x) {
    return x < 0 ? x * -1 : x;
}
function sortByDistance(a, b) {
    if (a.directDistance == b.directDistance) {
        return 0;
    }
    return a.directDistance > b.directDistance ? 1 : -1;
}
function convertGRSToWGS(x, y) {
    const coorX = parseInt(x);
    const coorY = parseInt(y);
    const wgs84 = config.coordinate.wgs84;
    const grs80 = config.coordinate.grs80;
    if (x && y) {
        const result = proj4(grs80, wgs84, [coorX, coorY]);
        return [result[1], result[0]];
    }
}
export function mapOptionalLocation(data) {
    return data.map((value) => {
        const current = convertGRSToWGS(value.X.toString(), value.Y.toString());
        return {
            X: value.X,
            Y: value.Y,
            address: value.ADMNM,
            currentX: current[0],
            currentY: current[1],
        };
    });
}
