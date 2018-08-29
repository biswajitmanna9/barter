import { Component, OnInit } from '@angular/core';
import { PostService } from "../../core/services/post.service";
import { LoadingState } from '../../core/components/loading/loading.component';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { MouseEvent } from '@agm/core';
// import { } from '@types/googlemaps';
var google: any;
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConversationComponent } from '../../core/components/conversation/conversation.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  all_post_list: any = [];
  fb_friends: boolean = false;
  loading: LoadingState = LoadingState.NotReady;
  search_key: string;
  items: any = [];
  isTracking = false;
  zoom: number = 8;
  lat: number = 30.0444;
  lng: number = 31.2357;
  markers: any[] = [];
  offsets = [];
  openedWindow: number = 0;
  closeResult: string;
  name: string;
  fbId: string;
  constructor(
    private postService: PostService,
    private _sanitizer: DomSanitizer,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loading = LoadingState.Processing;
    this.name = localStorage.getItem('name')
    this.fbId = localStorage.getItem('fbId')
    this.getPostList();
  }

  openConversation(data) {
    let dialogRef = this.dialog.open(ConversationComponent, {
      width: '400px',
      data: { info: data, posts: this.items, fbId: this.fbId }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result) {
        console.log(result)
      }
    })
  }


  openWindow(id) {
    this.openedWindow = id;
    window.scrollTo(0, 0);
  }

  isInfoWindowOpen(id) {
    return this.openedWindow == id;
  }

  getOffset(index: number) {
    let r = 0.05
    let degree = index * 2 * Math.PI / this.markers.length;
    let scaleFactor = this.markers.length / 5000;
    return {
      lat: Math.cos(degree) * scaleFactor,
      lon: Math.sin(degree) * scaleFactor
    }
  }

  trackMe() {
    if (navigator.geolocation) {
      this.isTracking = true;
      navigator.geolocation.watchPosition((position) => {
        this.showTrackingPosition(position);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  showTrackingPosition(position) {
    console.log(`tracking postion:  ${position.coords.latitude} - ${position.coords.longitude}`);
    this.lat = position.coords.latitude;
    this.lng = position.coords.longitude;
  }

  getImage(image) {
    return this._sanitizer.bypassSecurityTrustUrl(image);
  }

  toggleFbPostList() {
    this.fb_friends = !this.fb_friends;
    this.loading = LoadingState.Processing;
    this.getPostList();
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

  searchNearby() {
    this.trackMe();
  }

  getPostList() {
    var data = { "fb_friends": this.fb_friends }
    this.postService.getAllPost(data).subscribe(
      res => {
        this.items = res;
        this.markers = res;
        this.markers.forEach((marker, index) => {
          this.offsets.push(this.getOffset(index))
        })
        this.assignCopy()
        this.loading = LoadingState.Ready;
      },
      error => {
        this.loading = LoadingState.Ready;
        console.log(error);
      }
    )
  }

}
