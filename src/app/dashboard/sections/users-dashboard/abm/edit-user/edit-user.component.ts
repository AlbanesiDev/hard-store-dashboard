import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `<p>edit-user works!</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditUserComponent { }
