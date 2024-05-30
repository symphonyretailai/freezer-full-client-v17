﻿import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FoodItemService, AlertService, DataExchangeService } from '../_services';
import * as XLSX from 'xlsx';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    foodItems!: any[];
    searchtext: any;
   
    constructor(private foodItemService: FoodItemService, 
        private alertService: AlertService,
        private dataExchangeService: DataExchangeService,
        private router: Router,) {}

    ngOnInit() {
        this.foodItemService.getAll()
            .pipe(first())
            .subscribe(foodItems => this.foodItems = foodItems);
    }

    exportexcel(): void
    {
        const fileName= 'freezer-items' + new Date().toLocaleString() + '.xlsx';

      /* pass here the table id */
      let element = document.getElementById('excel-table');
      const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
  
      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
      /* save to file */  
      XLSX.writeFile(wb, fileName);
  
    }

    onEditClicked(foodItemId: number) {
        console.log('SENDING foodItemId FROM LIST COMPONENT', foodItemId);      
        this.dataExchangeService.sendData(foodItemId.toString());
    }

    onAddClicked() {
        console.log('SENDING foodItemId FROM LIST COMPONENT', null);      
        this.dataExchangeService.sendData("");
    }

    deleteFoodItem(foodItemId: string) {
        const foodItem = this.foodItems.find(x => x.foodItemId === foodItemId);
        foodItem.isDeleting = true;
        this.foodItemService.delete(foodItemId)
            .pipe(first())
            .subscribe(() => this.foodItems = this.foodItems.filter(x => x.foodItemId !== foodItemId));
            this.alertService.success('Food item deleted', { keepAfterRouteChange: true, autoClose: true});
            this.router.navigateByUrl('/foodItems');
    }
}