import { LocalizationPipe } from './../../../../../shared/pipes/localization.pipe';
import { StyleVariables } from './../../../../../core/theme/styleVariables.model';
import { AppSettings } from './../../../../../shared/models/appSettings.model';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { GlobalVariable } from 'src/app/core/global';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstructionsComponent implements OnInit {

  @Input() title: string = '';
  @Input() style: StyleVariables;
  @Input() settings: AppSettings;
  @Output() instructionText: EventEmitter<string> = new EventEmitter<string>(null);
  clientCode: string = GlobalVariable.UNIQUE_ID;

  instructions: string = '';
  placeholder: string = '';

  constructor(
    private localization: LocalizationPipe
  ) { 

    this.clientCode
    this.placeholder = this.clientCode == 'experience_0655' ? 'Note instructions and desired pick-up time here.' : `Enter ${this.title ? this.title : this.localization.transform('instruction')} Here`;
  }

  ngOnInit() {
  }

  onInstructionChange(instruction: string): void {
    this.instructionText.emit(instruction);
  }

}
