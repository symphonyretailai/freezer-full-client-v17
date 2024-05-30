export class FoodItem {
    id?: number;
    name?: string;
    description?: string
    dateFrozen?: Date;
    quantity?: number;
    freezerLocation?: string;
    itemLocation?: string;
    tags?: IFoodItemTag[];
}

export interface IFoodItemTag {
    foodItemId: number;
    tagId: number;
}
