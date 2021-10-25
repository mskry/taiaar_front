import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';
import { SpecialInstructionComponent } from '../components/special-instruction/special-instruction.component';
import { SharedModule } from '../../../../shared/shared.module';


const components = [
    SpecialInstructionComponent
]

@NgModule({
    declarations: [
        ...components
    ],
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        RouterModule
    ],
    exports: [
        RouterModule,
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        ...components,

    ],
    entryComponents: [

    ],
    providers: [

    ]
})
export class DialogSharedModule { }
