import Location from '../../models/location.js';
import { getNearAddressByCoordinate, mapOptionalLocation } from '../../service/location.js';
const locationResolvers = {
    getNearAddress: async ({ coordinate }) => {
        return await getNearAddressByCoordinate(coordinate.x, coordinate.y);
    },
    searchLocation: async ({ searchText }) => {
        const pipeline = [
            {
                $search: {
                    "index": "location",
                    "autocomplete": {
                        "query": searchText,
                        "path": "ADMNM"
                    }
                }
            }
        ];
        return await Location
            .aggregate(pipeline)
            .then((data) => {
            return mapOptionalLocation(data);
        });
    }
};
export default locationResolvers;
