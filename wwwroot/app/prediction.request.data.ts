export interface PredictionRequestData {
    fromDate: Date;
    toDate: Date;
    user: number;
    methodName: string;
    predictMoment: Date;
    // for wals only
    dimension: number;
    weight: number;
    coef: number;
}