import { Component, OnDestroy, OnInit } from '@angular/core';
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
  foodItemId?: number;
  formTitle!: string;
  loading = false;
  submitting = false;
  submitted = false;
  foodItem!: FoodItem;
  private subscription: Subscription = new Subscription();
  tagIds: string = '';
  selectedTags: Array<ITag> = [];
  newForm = true;
  tagsSelected = this.tagIds.length > 0;;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private foodItemService: FoodItemService,
    private alertService: AlertService,
    private messageService: DataMessagingService
  ) {}

  ngOnInit() {
    // get this.foodItemId from the message service
    this.subscription.add(
      this.messageService.data$.subscribe({
        next: (message: { sender: string, recipient:string, data: string}) => {
          if (message.sender === "ListComponent" && message.recipient === 'AddEditComponent') {
          this.foodItemId = +message.data;
          this.tagIds = '';
          }
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
      itemLocation: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.formTitle = 'Add Food item';
    this.tagIds = '';
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
            this.loading = false;
            this.tagIds = this.foodItem?.tags?.map((t) => t.tagId.toString()).join(',') ?? '';
          })
      );
    }

    this.subscription.add(
      this.messageService.data$.subscribe({
        next: (message: { sender:string, recipient:string, data: string}) => {
          if (message.sender === "TagComponent" && message.recipient === 'AddEditComponent') { 
          this.tagIds = message.data;
          // if the tagIds are not empty set tagsSelected to true
          this.tagsSelected = this.tagIds.length > 0;
          }
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
          this.tagIds = '';
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

    // Add the selected tags to the form value by converting the tagIds string to an array of selected Tag objects
    // the Tag.FoodItemId is set to the foodItemId, ignoring the tagName
    if(this.newForm){
      this.foodItemId = undefined;
    }

    this.selectedTags = this.tagIds.split(',').map((tagId) => {

      return {
        tagId: parseInt(tagId),
        tagName: '',
        foodItemId: this.foodItemId,
      };
    });

    // Add the selected tags to the form value
    this.form.value.tags = this.selectedTags;

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

