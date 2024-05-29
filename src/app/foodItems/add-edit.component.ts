﻿import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { itemLocationsByFreezer } from '../_helpers/data';

import { FoodItemService, AlertService } from   '../_services';
import { Observable, of } from 'rxjs';

export interface ItemLocations{
    name: string,
    itemLocations: string []
}

@Component({ templateUrl: 'add-edit.component.html' })

export class AddEditComponent implements OnInit {
    form!: FormGroup;
    itemLocations$: Observable<ItemLocations[] | null> | undefined;
    foodItemId?: string;
    name!: string;
    loading = false;
    submitting = false;
    submitted = false;
   
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private foodItemService: FoodItemService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.foodItemId = this.route.snapshot.params['id'];
        this.itemLocations$ = of(itemLocationsByFreezer);
        
        this.form = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            description: [''],
            dateFrozen: ['', Validators.pattern(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12]\d|3[01])$/)],
            quantity: ['', [Validators.required, Validators.minLength(1)]],
            freezerLocation: ['', [Validators.required, Validators.minLength(3)]],
            itemLocation: ['']
        });

        this.name = 'Add Food item';
        if (this.foodItemId) {
            // edit mode
            this.name = 'Edit Food item';
            this.loading = true;
            this.foodItemService.getById(this.foodItemId)
                .pipe(first())
                .subscribe(x => {
                    this.form.patchValue(x);
                    console.log("x: ", x);
                    console.log("form: ", this.form.value);
                    this.loading = false;
                }
            );
        }
    }

    get itemLocationsByFreezerLocation(){
        return itemLocationsByFreezer.filter(
            (c) => c.name === this.form.get('freezerLocation')?.value
        )[0]?.itemLocations;

    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

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
                    this.alertService.success(this.foodItemId ? 'Food item updated' : 'Food item saved', { keepAfterRouteChange: true, autoClose: true});
                    this.router.navigateByUrl('/foodItems');
                },
                error: (error: string) => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            })
    }

    private saveFoodItems() {
        // create or update FoodItems based on id param
        console.log(this.form.value);
        return this.foodItemId
            ? this.foodItemService.update(this.foodItemId, this.form.value)
            : this.foodItemService.create(this.form.value);
    }
}