import { Component } from '@angular/core';
import { ITag } from '@app/_models/ITag';
import { FoodItemService } from '../../_services';
import { Subscription } from 'rxjs';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [NgFor],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.less',
})
export class TagComponent {
  private subscription: Subscription = new Subscription();

  public tags: Array<ITag> = [];

  constructor(private foodItemService: FoodItemService) {}
  ngOnInit() {
    this.loadTags();
  }

  public loadTags() {
    this.subscription.add(
      this.foodItemService.tagList().subscribe({
        next: (tags: ITag[]) => {
          this.tags = tags;
        },
        error: (error) => {
          console.error(error);
        },
      })
    );
  }

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
