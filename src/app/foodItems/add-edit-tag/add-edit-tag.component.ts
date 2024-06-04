import { Component, OnDestroy, OnInit } from '@angular/core';
import { FoodItemService } from '../../_services/foodItem.service';
import { DataMessagingService } from '@app/_services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-edit-tag',
  standalone: true,
  imports: [],
  templateUrl: './add-edit-tag.component.html',
  styleUrl: './add-edit-tag.component.less',
})
export class AddEditTagComponent implements OnInit, OnDestroy{
  private subscription: Subscription = new Subscription();
  tagName = '';

  constructor(
    private foodItemService: FoodItemService,
    private messageService: DataMessagingService
  ) {}
  ngOnDestroy(): void {
    console.log('AddEditTagComponent destroyed');
  }
  ngOnInit() {

  }

  saveTag(tagName: string) {
    console.log('Save Tag: ', tagName);
    if (tagName === '') {
      console.log('Tag Name is required');
      return;
    }
    
    this.foodItemService.addTag(tagName);
    this.messageService.sendData("AddEditTagComponent", "TagComponent", tagName);
  }
}
