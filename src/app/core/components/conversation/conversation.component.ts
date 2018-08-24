import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { MessageService } from '../../services/message.service';
@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {
  form: FormGroup;
  info_data: any;
  items: any = [];
  fbId: string;
  post: any;
  constructor(
    public dialogRef: MatDialogRef<ConversationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private _sanitizer: DomSanitizer,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    console.log(this.data)
    this.info_data = this.data.info;
    this.items = this.data.posts;
    this.fbId = this.data.fbId;
    this.items = this.items.filter(x => x.fbId == this.fbId)
    console.log(this.info_data)
    console.log(this.items)
    this.form = this.formBuilder.group({
      post: [null, Validators.required],
      message: ['', Validators.required]
    });
  }


  getImage(image) {
    return this._sanitizer.bypassSecurityTrustUrl(image);
  }

  close(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.form.valid) {
      var data = {
        requestingUser: {
          fbId: this.fbId,
          name: this.info_data.name,
          return_post_id: this.form.value.post
        },
        message: this.form.value.message,
        from: this.info_data.name,
        _id: this.info_data._id
      }
      console.log(data)
      this.messageService.sendNewConversation(data).subscribe(
        res => {
          console.log(res)
          this.dialogRef.close(true);
        },
        error => {
          this.dialogRef.close(true);
          console.log(error)
        }
      )

    } else {
      this.markFormGroupTouched(this.form)
    }

  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        control.controls.forEach(c => this.markFormGroupTouched(c));
      }
    });
  }

  isFieldValid(field: string) {
    return !this.form.get(field).valid && (this.form.get(field).dirty || this.form.get(field).touched);
  }

  displayFieldCss(field: string) {
    return {
      'is-invalid': this.form.get(field).invalid && (this.form.get(field).dirty || this.form.get(field).touched),
      'is-valid': this.form.get(field).valid && (this.form.get(field).dirty || this.form.get(field).touched)
    };
  }

}
