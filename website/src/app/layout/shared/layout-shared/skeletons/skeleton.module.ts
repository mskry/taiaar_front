import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LandingCatSkeletonComponent } from './landing-cat-skeleton/landing-cat-skeleton.component';



const directives = [

]

const pipes = [

]

const components = [
    LandingCatSkeletonComponent
]

@NgModule({
    declarations: [
        ...components,
        ...pipes,
        ...directives
    ],
    imports: [
        CommonModule
    ],
    exports: [
        CommonModule,
        ...components,
        ...pipes,
        ...directives
    ],
    entryComponents: [

    ],
    providers: [

    ]
})
export class SkeletonModule { }
