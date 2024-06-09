import { Component, OnDestroy, OnInit } from '@angular/core';
import { ITag } from '@app/_models/ITag';
import { FoodItemService, DataMessagingService, AlertService } from '../../_services';
import { Subscription } from 'rxjs';
import { NgFor } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

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
  public selectedTagIds: Array<string> = [];
  public selectedFoodItemId: string = '';
  public selectedTagsString: string = '';
  data: string = '';

  public markSelected(tag: ITag) {
    // check if tag exists in selected tags then set the checkbox to checked
    return this.selectedTags.some((t) => t.tagId === tag.tagId);
  }

  updateSelectedTags(tags: string[]) {
    this.selectedTagsString = tags.join(', ');
  }

  public onCheckboxClick(tag: ITag) {
    if (this.selectedTags.some((t) => t.tagId === tag.tagId)) {
      this.selectedTags = this.selectedTags.filter((t) => t.tagId !== tag.tagId);
    } else {
      this.selectedTags.push(tag);
    }
    this.selectedTagIds = this.selectedTags.map((t) => t.tagId.toString());
    this.updateSelectedTags(this.selectedTagIds);
    this.messageService.sendData("TagComponent", "AddEditComponent", this.selectedTagsString);
  }

  deleteTag(tagId: number) {
    this.subscription.add(
      this.foodItemService.deleteTag(tagId).subscribe({
        next: () => {
          this.loadTags();
          this.alertService.success('Tag deleted', {
            keepAfterRouteChange: true,
            autoClose: true,
          });
        },
        error: (error) => {
          console.log(error);
        },
      })
    );
  }

  constructor(private foodItemService: FoodItemService, 
    private messageService: DataMessagingService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,) {   
  }
  ngOnInit() {

    this.selectedFoodItemId = this.route.snapshot.params['id'];

    this.loadTags();

    this.loadSelectedTags();
  }

  private loadSelectedTags() {
    if (!this.selectedFoodItemId) {
      return;
    }
    
    this.subscription.add(
      this.foodItemService.tagsSelected(this.selectedFoodItemId).subscribe({
        next: (tags: ITag[]) => {
          this.selectedTags = tags;
          this.updateSelectedTags(this.selectedTags.map((t) => t.tagId.toString()));
          this.messageService.sendData("TagComponent", "AddEditComponent", this.selectedTagsString);
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
