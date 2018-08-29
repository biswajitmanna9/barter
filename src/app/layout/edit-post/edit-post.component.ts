import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PostService } from '../../core/services/post.service';
import { LoadingState } from '../../core/components/loading/loading.component';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
// var resizebase64 = require('resize-base64');
import { } from '@types/googlemaps';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss']
})
export class EditPostComponent implements OnInit {

  form: FormGroup;
  loading: LoadingState = LoadingState.NotReady;
  image: any = {
    dataURL: '',
    resized: {
      dataURL: ''
    }
  }
  base64textString: string;
  file_error: boolean;
  isTracking = false;
  currentLat: any;
  currentLong: any;
  postDetails: any = {
    post_id: '',
    fbId: '',
    name: '',
    itemName: '',
    condition: '',
    description: '',
    location: [],
    image: ''
  };
  name: string;
  fbId: string;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private postService: PostService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loading = LoadingState.Processing;
    this.name = localStorage.getItem('name')
    this.fbId = localStorage.getItem('fbId')
    this.trackMe();
    this.form = this.formBuilder.group({
      name: [this.name, Validators.required],
      description: ['', Validators.required],
      condition: ['', Validators.required],
      image: [this.image, Validators.required],
      itemName: ['', Validators.required],
      location: ['', Validators.required],
      fbId: [this.fbId, Validators.required]
    });
    console.log(this.route.snapshot.params['id'])
    this.getPostDetails(this.route.snapshot.params['id'])
  }

  getPostDetails(id) {
    this.postService.getPostDetails(id).subscribe(
      res => {
        console.log(res);
        this.postDetails = {
          post_id: this.route.snapshot.params['id'],
          fbId: this.fbId,
          name: this.name,
          itemName: res['itemName'],
          condition: res['condition'],
          description: res['description'],
          location: [res['loc'].coordinates[1], res['loc'].coordinates[0]],
          image: this.image
        };
        this.image.dataURL = res['image_full'];
        this.image.resized.dataURL = res['image']
        this.base64textString = res['image'];
        this.file_error = false;
        this.loading = LoadingState.Ready;
      },
      error => {
        console.log(error);
      }
    )
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
    this.currentLat = position.coords.latitude;
    this.currentLong = position.coords.longitude;
  }

  onImageChange(evt) {
    var files = evt.target.files;
    var file = files[0];

    if (files && file) {
      var reader = new FileReader();

      reader.onload = this._handleReaderLoaded.bind(this);

      reader.readAsBinaryString(file);
    }
  }
  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    var base64 = 'data:image/png;base64,' + btoa(binaryString);
    this.image.dataURL = base64;
    this.base64textString = base64;
    // this.base64textString = resizebase64(base64, 250, 300);
    this.image.resized.dataURL = this.base64textString
    console.log(this.base64textString);
    this.file_error = false;
  }

  updatePost() {
    this.form.patchValue({
      location: [this.currentLat, this.currentLong]
    })
    this.postDetails.location = [this.currentLat, this.currentLong]
    console.log(this.postDetails)
    if (this.base64textString == undefined) {
      this.file_error = true
    }
    if (this.form.valid) {
      this.loading = LoadingState.Processing;
      console.log(this.form.value)
      if (!this.file_error) {
        this.postService.updatePost(this.postDetails).subscribe(
          res => {
            this.loading = LoadingState.Ready;
            this.router.navigate(['/home']);
            console.log(res)
          },
          error => {
            this.loading = LoadingState.Ready;
            this.router.navigate(['/home']);
            console.log(error)
          }
        )
      }

    } else {
      this.markFormGroupTouched(this.form)
    }

  }

  back() {
    this.router.navigate(['/home']);
  }


  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        control.controls.forEach(c => this.markFormGroupTouched(c));
      }
    });
  }

  reSet() {
    this.form.reset();
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
