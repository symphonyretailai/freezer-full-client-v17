import { Component, OnDestroy, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import {
  FoodItemService,
  AlertService,
  DataMessagingService,
} from '../_services';
import * as XLSX from 'xlsx';
import { Subscription } from 'rxjs';
import { FoodItem } from '@app/_models';
import { ITag } from '@app/_models/ITag';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit, OnDestroy {
  foodItems!: FoodItem[];
  searchtext: any;
  showTags = false;
  distinctTags: ITag[] = [];
  selectedTag: ITag = { tagId: 0, tagName: '' };
  selectedTags: Array<ITag> = [];
  filteredItems: FoodItem[] = [];

  toggleTags() {
    this.showTags = !this.showTags;
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
    if(index === -1 &&  tag.tagName !== ''){
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

  exportexcel(): void {
    const fileName = 'freezer-items' + new Date().toLocaleString() + '.xlsx';

    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, fileName);
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

  deleteFoodItem(foodItemId: number) {
    this.foodItems.find((x) => x.foodItemId === foodItemId);

    this.subscription.add(
      this.foodItemService
        .delete(foodItemId)
        .pipe(first())
        .subscribe(
          () =>
            (this.foodItems = this.foodItems.filter(
              (x) => x.foodItemId !== foodItemId
            ))
        )
    );

    this.alertService.success('Food item deleted', {
      keepAfterRouteChange: true,
      autoClose: true,
    });
    this.router.navigateByUrl('/foodItems');
  }
  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
