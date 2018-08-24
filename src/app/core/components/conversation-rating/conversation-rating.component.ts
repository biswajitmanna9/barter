import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { MessageService } from '../../services/message.service';
import { PostService } from '../../services/post.service';
@Component({
  selector: 'app-conversation-rating',
  templateUrl: './conversation-rating.component.html',
  styleUrls: ['./conversation-rating.component.scss']
})
export class ConversationRatingComponent implements OnInit {
  ratingValue: number;
  conversation: any;
  post: any;
  fbId: string;
  user_name: string;
  userNameRatingPopup: string;
  constructor(
    public dialogRef: MatDialogRef<ConversationRatingComponent>,
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
    this.userNameRatingPopup = this.post.name;
    if (this.post.fbId == this.fbId) {
      this.userNameRatingPopup = this.conversation.requestingUser.name;
    }
    this.getRatingValue(this.post)
  }

  rate() {
    console.log(this.ratingValue)
  }

  close(): void {
    this.dialogRef.close();
  }

  getRatingValue(post) {
    if (post.fbId == this.fbId) {
      this.ratingValue = post.requester_barter_rating;
    }
    else {
      for (var k = 0; k < post.conversations.length; k++) {
        var conversation = post.conversations[k];
        if (conversation.requestingUser.fbId.toString() === this.fbId) {
          this.ratingValue = post.poster_barter_rating;
        }
      }
    }
  }

  onSubmit() {
    var data = {
      _id: this.conversation._id,
      from: this.user_name,
      rating_from_fbId: this.fbId,
      post_id: this.post._id,
      post_requesting_user_fbId: this.conversation.requestingUser.fbId,
      poster_fbId: this.post.fbId,
      ratingValue: this.ratingValue
    }
    this.messageService.ratingConversation(data).subscribe(
      res => {
        this.dialogRef.close(true);
        console.log(res)
      },
      error => {
        this.dialogRef.close(true);
        console.log(error)
      }
    )
  }

}
