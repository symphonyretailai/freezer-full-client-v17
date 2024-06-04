import { Pipe, PipeTransform } from '@angular/core';
import { FoodItem } from '@app/_models';

@Pipe({
  name: 'filterByTag',
  standalone: true
})
export class FilterByTagPipe implements PipeTransform {
  transform(foodItems: FoodItem[], tagId: number): FoodItem[] {
    if (!foodItems ) return [];
    if (tagId == 0 || tagId == undefined) return foodItems;

    return foodItems.filter(foodItem => 
      foodItem.tags?.some(tag => tag && tag.tagId === tagId)
    );
  }
}
