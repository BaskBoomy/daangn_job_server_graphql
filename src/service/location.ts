import proj4 from 'proj4';
import { config } from "../config.js";
import LocationModel, { ILocation } from "../models/location.js";
import { Location } from "../../gql-types.js";

export async function getNearAddressByCoordinate(currentX:string, currentY:string):Promise<Location[]> {
    const grs = convertWGSToGRS(currentX, currentY);
    return await getKoreaAddress()
                .then((address)=>{
                    return address.map((data):Location => {
                        return {
                            address: data.ADMNM,
                            directDistance: getDirectDistance(grs![0], grs![1], parseFloat(data.X), parseFloat(data.Y)),
                            X: data.X,
                            Y: data.Y,
                            currentX: parseFloat(currentX), //사용자가 처음 등록한 좌표 정보
                            currentY: parseFloat(currentY),
                        };;
                    }).sort(sortByDistance).slice(0, 60);
    });
}

function convertWGSToGRS(x:string, y:string): number[]|undefined {
    const coorX:number = parseFloat(x);
    const coorY:number = parseFloat(y);
    const wgs84 = config.coordinate.wgs84;
    const grs80 = config.coordinate.grs80;
    if (x && y) {
        const result = proj4(wgs84,grs80, [coorY, coorX]);
        return [result[0], result[1]];
    }
}

async function getKoreaAddress():Promise<ILocation[]> {
    return await LocationModel.find();
}

function getDirectDistance(x1:number, y1:number, x2:number, y2:number):number {
    const x = getAbsoluteValue(x2 - x1);
    const y = getAbsoluteValue(y2 - y1);
    return Math.sqrt((x * x) + (y * y));
}
function getAbsoluteValue(x:number):number {
    return x < 0 ? x * -1 : x;
}
function sortByDistance(a:Location, b:Location):number {
    if (a.directDistance == b.directDistance) {
        return 0;
    }
    return a.directDistance! > b.directDistance! ? 1 : -1;
}

function convertGRSToWGS(x:string, y:string):number[]|undefined {
    const coorX:number = parseInt(x);
    const coorY:number = parseInt(y);
    const wgs84 = config.coordinate.wgs84;
    const grs80 = config.coordinate.grs80;
    if (x && y) {
        const result = proj4(grs80, wgs84, [coorX, coorY]);
        return [result[1], result[0]];
    }
}
export function mapOptionalLocation(data: any[]):Location[] {
    return data.map((value: ILocation):Location => {
        const current = convertGRSToWGS (value.X!.toString(), value.Y!.toString());
        return {
            X: value.X,
            Y: value.Y,
            address: value.ADMNM,
            currentX: current![0],
            currentY: current![1],
        }
    })
}