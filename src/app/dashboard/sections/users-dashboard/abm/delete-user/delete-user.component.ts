import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-delete-user',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `<p>delete-user works!</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteUserComponent { }
