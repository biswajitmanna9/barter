import { Component, OnInit } from '@angular/core';
import { PostService } from "../../core/services/post.service";
import { LoadingState } from '../../core/components/loading/loading.component';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ViewConversationComponent } from '../../core/components/view-conversation/view-conversation.component';
import { ConversationRatingComponent } from '../../core/components/conversation-rating/conversation-rating.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  all_post_list: any = [];
  search_key: string;
  items: any = [];
  name: string;
  fbId: string;
  loading: LoadingState = LoadingState.NotReady;
  post_list: any = [];
  post_type: string;
  constructor(
    private postService: PostService,
    private _sanitizer: DomSanitizer,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loading = LoadingState.Processing;
    this.name = localStorage.getItem('name')
    this.fbId = localStorage.getItem('fbId')
    this.getPostList();
  }

  getPostList() {
    this.postService.getDashboardPosts().subscribe(
      (res: any[]) => {
        console.log(res)
        this.post_list = res;
        this.yourPost();
        this.loading = LoadingState.Ready;
        console.log(this.post_list)
      },
      error => {
        this.loading = LoadingState.Ready;
        console.log(error);
      }
    )
  }

  assignCopy() {
    this.all_post_list = Object.assign([], this.items);
  }

  search(value) {
    if (!value) this.assignCopy();
    this.all_post_list = Object.assign([], this.items).filter(
      item => item.itemName.toLowerCase().indexOf(value.toLowerCase()) > -1 || item.description.toLowerCase().indexOf(value.toLowerCase()) > -1 || item.condition.toLowerCase().indexOf(value.toLowerCase()) > -1 || item.name.toLowerCase().indexOf(value.toLowerCase()) > -1
    )
  }

  getImage(image) {
    return this._sanitizer.bypassSecurityTrustUrl(image);
  }


  yourPost() {
    this.post_type = 'Your Posts';
    this.items = this.post_list.filter(x => x.fbId == this.fbId);
    this.assignCopy()
  }

  yourRequest() {
    this.post_type = 'Your Requests';
    this.loading = LoadingState.Processing;
    this.items = [];
    this.post_list.forEach(x => {
      var d = x.conversations.filter(y => y.requestingUser.fbId == this.fbId)
      if (d.length > 0) {
        this.items.push(x)
      }
    })
    this.loading = LoadingState.Ready;
    console.log(this.items)
    this.assignCopy()
  }

  yourOffer() {
    this.post_type = 'Your Offers';
    this.loading = LoadingState.Processing;
    this.items = [];
    this.post_list.forEach(x => {
      if (x.fbId == this.fbId) {
        var d = x.conversations.filter(y => y.requestingUser.fbId != this.fbId)
        if (d.length > 0) {
          this.items.push(x)
        }
      }
    })
    this.loading = LoadingState.Ready;
    console.log(this.items)
    this.assignCopy()
  }

  yourCompletedPost() {
    this.post_type = 'Completed Posts';
    this.items = this.post_list.filter(x => x.fbId == this.fbId && x.completed == true);
    this.assignCopy()
  }

  back() {
    this.router.navigate(['/home']);
  }

  toggleConversationModal(conversation, post) {
    let dialogRef = this.dialog.open(ViewConversationComponent, {
      width: '700px',
      data: { conversation: conversation, post: post, fbId: this.fbId, user_name: this.name }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result) {
        this.loading = LoadingState.Processing;
        console.log(result)
        this.getPostList();
      }
    })
  }

  deletePost(id) {
    this.loading = LoadingState.Processing;
    this.postService.deletePost(id).subscribe(
      res => {
        console.log(res)
        this.getPostList();
      },
      error => {
        console.log(error)
        this.getPostList();
      }
    )
  }

  getRatingValue(post) {
    if (post.fbId == this.fbId) {
      return post.requester_barter_rating;
    }
    else {
      for (var k = 0; k < post.conversations.length; k++) {
        var conversation = post.conversations[k];
        if (conversation.requestingUser.fbId.toString() === this.fbId) {
          return post.poster_barter_rating;
        }
      }
    }
  }

  toggleRatingModal(conversation, post) {
    let dialogRef = this.dialog.open(ConversationRatingComponent, {
      width: '700px',
      data: { conversation: conversation, post: post, fbId: this.fbId, user_name: this.name }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result) {
        this.loading = LoadingState.Processing;
        console.log(result)
        this.getPostList();
      }
    })
  }

}
