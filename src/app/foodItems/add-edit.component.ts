﻿import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { itemLocationsByFreezer } from '../_helpers/data';

import {
  FoodItemService,
  AlertService,
  DataMessagingService,
} from '../_services';
import { Observable, Subscription, of } from 'rxjs';
import { ItemLocations } from '../_models/itemLocations';
import { FoodItem } from '@app/_models';
import { ITag } from '@app/_models/ITag';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  itemLocations$: Observable<ItemLocations[] | null> | undefined;
  foodItemId?: string;
  formTitle!: string;
  loading = false;
  submitting = false;
  submitted = false;
  foodItem!: FoodItem;
  private subscription: Subscription = new Subscription();
  tagIds: string = '';
  selectedTags: Array<ITag> = [];
  newForm = true;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private foodItemService: FoodItemService,
    private alertService: AlertService,
    private messageService: DataMessagingService<string>
  ) {}

  ngOnInit() {
    // get this.foodItemId from the measage service
    this.subscription.add(
      this.messageService.data$.subscribe({
        next: (data: string) => {
          this.foodItemId = data;
        },
        error: (error: any) => {
          console.log(error);
        },
        complete: () => {
          console.log('complete');
        },
      })
    );

    this.itemLocations$ = of(itemLocationsByFreezer);

    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      dateFrozen: [
        '',
        Validators.pattern(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12]\d|3[01])$/),
      ],
      quantity: ['', [Validators.required, Validators.minLength(1)]],
      freezerLocation: ['', [Validators.required, Validators.minLength(3)]],
      itemLocation: [''],
    });

    this.formTitle = 'Add Food item';
    if (this.foodItemId) {
      // edit mode
        
      this.formTitle = 'Edit Food item';
      this.loading = true;
      this.newForm = false;

      this.subscription.add(
        this.foodItemService
          .getById(this.foodItemId)
          .pipe(first())
          .subscribe((x) => {
            this.foodItem = x;
            this.form.patchValue(x);
            console.log(this.foodItem);
            this.loading = false;
          })
      );
    }

    this.subscription.add(
      this.messageService.data$.subscribe({
        next: (data: string) => {
          this.tagIds = data;
        },
        error: (error: any) => {
          console.log(error);
        },
        complete: () => {
          console.log('complete');
        },
      })
    );
  }

  get itemLocationsByFreezerLocation() {
    return itemLocationsByFreezer.filter(
      (c) => c.name === this.form.get('freezerLocation')?.value
    )[0]?.itemLocations;
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.submitting = true;
    this.saveFoodItems()
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success(
            this.foodItemId ? 'Food item updated' : 'Food item saved',
            { keepAfterRouteChange: true, autoClose: true }
          );
          this.router.navigateByUrl('/foodItems');
        },
        error: (error: string) => {
          this.alertService.error(error);
          this.submitting = false;
        },
      });
  }

  private saveFoodItems() {
    // create or update FoodItems based on id param
    console.log(this.form.value);

    // Add the selected tags to the form value by converting the tagIds string to an array of selected Tag objects
    // the Tag.FoodItemId is set to the foodItemId, ignoring the tagName
    if(this.newForm){this.foodItemId = '';}

    this.selectedTags = this.tagIds.split(',').map((tagId) => {
      return {
        tagId: parseInt(tagId),
        tagName: '',
        foodItemId: this.foodItemId,
      };
    });

    // Add the selected tags to the form value
    this.form.value.tags = this.selectedTags;

    console.log('Selected Tags: ', this.selectedTags);
    console.log('foodItemId: ', this.foodItemId);

    return this.foodItemId
      ? this.foodItemService.update(this.foodItemId, this.form.value)
      : this.foodItemService.create(this.form.value);
  }

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
