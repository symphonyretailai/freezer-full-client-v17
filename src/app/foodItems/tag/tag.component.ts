import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ITag } from '@app/_models/ITag';
import { FoodItemService, DataExchangeService } from '../../_services';
import { Subscription } from 'rxjs';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [NgFor],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.less',
})
export class TagComponent implements OnInit, OnDestroy{
  private subscription: Subscription = new Subscription();
  private dataSubscription: Subscription = new Subscription();

  public tags: Array<ITag> = [];
  public selectedTags: Array<ITag> = [];
  data: string = '';

  public markSelected(tag: ITag) {
    // check if tag exists in selected tags then set the checkbox to checked
    return this.selectedTags.some((t) => t.tagId === tag.tagId);
  }

  public onCheckboxClick(tag: ITag) {
    if (this.selectedTags.some((t) => t.tagId === tag.tagId)) {
      this.selectedTags = this.selectedTags.filter((t) => t.tagId !== tag.tagId);
    } else {
      this.selectedTags.push(tag);
    }
    console.log(this.selectedTags.length);
  }

  constructor(private foodItemService: FoodItemService, 
    private cdr:ChangeDetectorRef,
    private dataExchangeService: DataExchangeService) {   
  }
  ngOnInit() {
    this.loadTags();
    this.dataSubscription.add(
      this.dataExchangeService.data$.subscribe({
        next: (data: string) => {
          this.data = data;
          this.dataSubscription.unsubscribe();
        },
        error: (error: any) => {
          console.log(error);
        },
        complete: () => {
          console.log('complete');
        }
      })
    );

    this.loadSelectedTags(this.data);
  }

  private loadSelectedTags(foodItemId: string) {
    this.subscription.add(
      this.foodItemService.tagsSelected(foodItemId).subscribe({
        next: (tags: ITag[]) => {
          this.selectedTags = tags;
        }
      })
    );
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
    if (this.subscription || this.dataSubscription) {
      this.subscription.unsubscribe();
      this.dataSubscription.unsubscribe();
    }
  }
}
