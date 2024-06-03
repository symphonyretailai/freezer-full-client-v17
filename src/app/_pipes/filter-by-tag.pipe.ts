import { Pipe, PipeTransform } from '@angular/core';
import { FoodItem } from '@app/_models';

@Pipe({
  name: 'filterByTag',
  standalone: true
})
export class FilterByTagPipe implements PipeTransform {
  transform(foodItems: FoodItem[], tagNames: string[]): FoodItem[] {
    if (!foodItems || !tagNames || tagNames.length === 0) {
      return foodItems;
    }
    return foodItems.filter(foodItem => 
      foodItem.tags?.some(tag => tagNames.includes(tag.tagName)
    ));
  }
}
