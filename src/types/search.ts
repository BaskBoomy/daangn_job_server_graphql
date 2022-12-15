
export type Time = [
    {
        range:{
            path:string;
            gte:string;
        }
    },
    {
        range:{
            path:string;
            lte:string;
        }
    }
]