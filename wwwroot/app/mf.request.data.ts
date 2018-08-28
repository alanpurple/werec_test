export class MfRequestData {
    dayFrom: string;
    dayTo: string;
    predictMoment: string;
    user: number;
    dimension: number = 10;
    weight: number = 0.5;
    coef: number = 2.0;
    nIter: number = 30;
}