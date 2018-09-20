import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { PostService } from "../../core/services/post.service";
import { LoadingState } from '../../core/components/loading/loading.component';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { MouseEvent } from '@agm/core';
import { } from '@types/googlemaps';
declare let google: any
declare let OverlappingMarkerSpiderfier: any
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConversationComponent } from '../../core/components/conversation/conversation.component';
// import { OverlappingMarkerSpiderfier } from 'overlapping-marker-spiderfier';

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
  options = {
    markersWontMove: true,
    markersWontHide: true,
    basicFormatEvents: true
  };
  oms: any;
  map: any;
  iw: any;
  locations = [
    { lat: -31.563910, lng: 147.154312 },
    { lat: -31.563910, lng: 147.154312 },
    { lat: -31.563910, lng: 147.154312 },
    { lat: -33.718234, lng: 150.363181 },
    { lat: -33.727111, lng: 150.371124 },
    { lat: -33.848588, lng: 151.209834 },
    { lat: -33.851702, lng: 151.216968 },
    { lat: -34.671264, lng: 150.863657 },
    { lat: -35.304724, lng: 148.662905 },
    { lat: -36.817685, lng: 175.699196 },
    { lat: -36.828611, lng: 175.790222 },
    { lat: -37.750000, lng: 145.116667 },
    { lat: -37.759859, lng: 145.128708 },
    { lat: -37.765015, lng: 145.133858 },
    { lat: -37.770104, lng: 145.143299 },
    { lat: -37.773700, lng: 145.145187 },
    { lat: -37.774785, lng: 145.137978 },
    { lat: -37.819616, lng: 144.968119 },
    { lat: -38.330766, lng: 144.695692 },
    { lat: -39.927193, lng: 175.053218 },
    { lat: -41.330162, lng: 174.865694 },
    { lat: -42.734358, lng: 147.439506 },
    { lat: -42.734358, lng: 147.501315 },
    { lat: -42.735258, lng: 147.438000 },
    { lat: -43.999792, lng: 170.463352 }
  ]
  @ViewChild('map') mapRef: ElementRef;
  constructor(
    private postService: PostService,
    private _sanitizer: DomSanitizer,
    public dialog: MatDialog
  ) {

  }

  ngOnInit() {
    var latlng = new google.maps.LatLng(5, 0);
    this.map = new google.maps.Map(this.mapRef.nativeElement, {
      zoom: 6,
      center: latlng
    });
    
    this.loading = LoadingState.Processing;
    this.name = localStorage.getItem('name')
    this.fbId = localStorage.getItem('fbId')
    this.getPostList();
    this.oms = new OverlappingMarkerSpiderfier(this.map, this.options)
    this.iw = new google.maps.InfoWindow();
    this.oms.addListener('click', function(marker, event) {
      this.iw.setContent(marker.desc);
      this.iw.open(this.map, marker);
    });
    this.oms.addListener('spiderfy', function(markers) {
      this.iw.close();
    });
    for (let i = 0; i < this.locations.length; i++) {
      const marker = new google.maps.Marker({
        position: this.locations[i],
        map: this.map
      });
      this.oms.addMarker(marker);  // <-- here
    }
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
