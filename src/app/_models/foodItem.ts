export class FoodItem {
    foodItemId!: number;
    name?: string;
    description?: string
    dateFrozen?: Date;
    quantity?: number;
    freezerLocation?: string;
    itemLocation?: string;
    tags?: IFoodItemTag[];
    isDeleting?: boolean;
}

export interface IFoodItemTag {
    foodItemId: number;
    tagId: number;
    tagName: string;
}
