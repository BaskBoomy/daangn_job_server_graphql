const types = ['isShortJob', 'place', 'workCategory', 'dates', 'time', 'text'];
export function getSearchSetting(searchType) {
    let setting = [];
    types.map(data => {
        if (data === 'time' && 'time' in searchType) {
            const query = getQuery(data.toString(), searchType[data.toString()]);
            setting.push(query[0], query[1]);
        }
        else {
            data.toString() in searchType && setting.push(getQuery(data.toString(), searchType[data.toString()]));
        }
    });
    return setting;
}
function getQuery(type, data) {
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
            };
    }
}
