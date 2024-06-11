import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { Router, RouterLink } from '@angular/router';
import {
  FoodItemService,
  AlertService,
  DataMessagingService,
} from '../_services';

import { Subscription, throwError } from 'rxjs';
import { FoodItem } from '@app/_models';
import { ITag } from '@app/_models/ITag';
import { FilterByTagPipe } from '../_pipes/filter-by-tag.pipe';
import { FilterPipe } from '../_pipes/filter.pipe';
import { SortDirective } from '../_directives/sort.directive';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';

@Component({
    templateUrl: 'list.component.html',
    standalone: true,
    imports: [RouterLink, NgIf, ReactiveFormsModule, FormsModule, NgFor, SortDirective, FilterPipe, FilterByTagPipe]
})
export class ListComponent implements OnInit, OnDestroy {
  foodItems!: FoodItem[];
  searchtext: any;
  showTags = false;
  showTagInput = false;
  distinctTags: ITag[] = [];
  selectedTag: ITag = { tagId: 0, tagName: '' };
  selectedTags: Array<ITag> = [];
  filteredItems: FoodItem[] = [];
  newTagName = '';

  toggleTags() {
    this.showTags = !this.showTags;
  }

  toggleTagInput() {
    this.showTagInput = !this.showTagInput;
  }

  addNewTag(tagName: string) {
    // create a new ITag assign tagName to the new tag tagName property and save new tag to the database
    const newTag: ITag = { tagId: 0, tagName: tagName };
    this.subscription.add(
      this.foodItemService
        .addTag(newTag.tagName)
        .pipe(first())
        .subscribe((tag) => {
          this.distinctTags.push(newTag);
          this.newTagName = '';
          this.alertService.success('Tag added');
          this.toggleTagInput();
        })
    );
  }

  private subscription: Subscription = new Subscription();

  constructor(
    private foodItemService: FoodItemService,
    private alertService: AlertService,
    private messageService: DataMessagingService,

    private router: Router
  ) {}

  ngOnInit() {
    this.foodItemService
      .getAll()
      .pipe(first())
      .subscribe((foodItems) => {
        this.foodItems = foodItems;
        this.filteredItems = foodItems;
        this.createDistinctTags();
      });
  }

  public onSelectFilterTag(tag: ITag) {
    const index = this.selectedTags.findIndex((t) => t.tagId === tag.tagId);
    if (index === -1 && tag.tagName !== '') {
      // clear all selected tags
      this.selectedTags = [];
    }
    if (index !== -1) {
      this.selectedTags.splice(index, 1);
    } else {
      this.selectedTags.push(tag);
      this.selectedTag = tag;
    }
  }

  createDistinctTags() {
    this.foodItemService
      .tagList()
      .pipe(first())
      .subscribe((tags) => {
        this.distinctTags = tags;
      });
  }


  onEditClicked(foodItemId: number) {
    this.messageService.sendData(
      'ListComponent',
      'AddEditComponent',
      foodItemId.toString()
    );
    this.messageService.sendData(
      'ListComponent',
      'TagComponent',
      foodItemId.toString()
    );
  }

  onAddClicked() {
    this.messageService.sendData('ListComponent', 'AddEditComponent', '');
    this.messageService.sendData('ListComponent', 'TagComponent', '');
  }

  deleteFoodItem(foodItem: FoodItem) {
    this.subscription.add(
        this.foodItemService.delete(foodItem.foodItemId).pipe(
            first(),
            catchError((error) => this.handleError(error)),
            tap(() => this.handleSuccess(foodItem)),
            finalize(() => this.router.navigateByUrl('/foodItems'))
        ).subscribe()
    );
}

handleError(error: any) {
    this.alertService.error('Error deleting food item', {
        keepAfterRouteChange: true,
        autoClose: true,
    });
    return throwError(() => new Error(error));
}

handleSuccess(foodItem: FoodItem) {
    this.foodItems.splice(this.foodItems.indexOf(foodItem), 1)
    this.filteredItems = this.foodItems;
    this.searchtext = '';
    this.selectedTags = [];
    this.alertService.success('Food item deleted', {
        keepAfterRouteChange: true,
        autoClose: true,
    });
}

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
