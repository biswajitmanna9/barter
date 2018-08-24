import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { MessageService } from '../../services/message.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-view-conversation',
  templateUrl: './view-conversation.component.html',
  styleUrls: ['./view-conversation.component.scss']
})
export class ViewConversationComponent implements OnInit {
  form: FormGroup;
  conversation: any;
  post: any;
  fbId: string;
  returnPost_details: any;
  showReturnPost: boolean;
  returnItemText: string = "Requester's Post Item Details";
  userNamePopup: string;
  button_key: boolean;
  user_name: string;
  constructor(
    public dialogRef: MatDialogRef<ViewConversationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private _sanitizer: DomSanitizer,
    private messageService: MessageService,
    private postService: PostService
  ) { }

  ngOnInit() {
    this.conversation = this.data.conversation;
    this.post = this.data.post;
    this.fbId = this.data.fbId
    this.user_name = this.data.user_name;
    console.log(this.conversation)
    console.log(this.post)
    this.userNamePopup = this.post.name;
    if (this.post.fbId == this.fbId) {
      this.userNamePopup = this.conversation.requestingUser.name;
    }
    if (this.post.fbId != this.fbId) {
      this.returnItemText = 'Your  Return Item Details';
    }
    if (!this.post.completed) {
      if (this.post.fbId == this.fbId && this.conversation.accepted == null) {
        this.button_key = true;
      } else {
        this.button_key = false;
      }
    } else {
      this.button_key = false;
    }
    this.getReturnPostDetails(this.conversation.requestingUser.return_post_id)
    this.form = this.formBuilder.group({
      reply: ['', Validators.required]
    });
  }

  getReturnPostDetails(id) {
    this.postService.getPostDetails(id).subscribe(
      res => {
        this.returnPost_details = res;
        this.showReturnPost = true
        console.log(res)
      },
      error => {
        console.log(error)
      }
    )
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
        _id: this.conversation._id,
        message: this.form.value.reply,
        from: this.user_name
      }
      this.messageService.replyConversation(data).subscribe(
        res => {
          console.log(res);
          this.dialogRef.close(true);
        },
        error => {
          console.log(error);
          this.dialogRef.close(true);
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

  respondToBarter(conversation, post, type) {
    var return_post_id = '';
    if (conversation.requestingUser.return_post_id) {
      return_post_id = conversation.requestingUser.return_post_id;
    }
    var data = {
      return_post_id: return_post_id
    }
    this.messageService.acceptAndRejectConversation(conversation._id, data, type).subscribe(
      res => {
        console.log(res);
        this.dialogRef.close(true);
      },
      error => {
        console.log(error);
        this.dialogRef.close(true);
      }
    )
  }

  deleteConversation(conversation, post) {
    this.messageService.deleteConversation(conversation._id).subscribe(
      res => {
        console.log(res);
        this.dialogRef.close(true);
      },
      error => {
        this.dialogRef.close(true);
      }
    )
  }

}
