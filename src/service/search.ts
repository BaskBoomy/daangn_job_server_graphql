import { Time } from "../types/search";

const types = ['isShortJob', 'place', 'workCategory', 'dates', 'time', 'text'];

export function getSearchSetting(searchType:any) {
    let setting:any = [];
    types.map(data => {
        if (data === 'time' && 'time' in searchType) {
            const query = getQuery(data.toString(), searchType[data.toString()]) as Time;
            setting.push(query[0], query[1]);
        } else {
            data.toString() in searchType && setting.push(getQuery(data.toString(), searchType[data.toString()]));
        }
    })
    return setting;
}

function getQuery(type:string, data:any):any {
    switch (type) {
        case 'isShortJob':
            return {
                "equals": {
                    "path": "isShortJob",
                    "value": data,
                }
            };
        case 'place':
            return {
                "text": {
                    "query": data,
                    "path": ["place.dong", "place.hname"]
                }
            };
        case 'workCategory':
            return {
                "text": {
                    "query": data,
                    "path": "workCategory"
                }
            };
        case 'dates':
            return {
                "text": {
                    "query": data,
                    "path": "dateSearch"
                }
            };
        case 'time':
            return [
                {
                    "range": {
                        "path": "startTime",
                        "gte": data.startTime
                    }
                },
                {
                    "range": {
                        "path": "endTime",
                        "lte": data.endTime
                    }
                }
            ];
        case 'text':
            return {
                "text": {
                    "query": data,
                    "path": {
                        "wildcard": "*"
                    }
                }
            }
    }
}