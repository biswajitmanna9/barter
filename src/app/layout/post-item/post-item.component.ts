import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from '../../core/services/post.service';
import { LoadingState } from '../../core/components/loading/loading.component';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
// var resizebase64 = require('resize-base64');
import { } from '@types/googlemaps';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent implements OnInit {
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
  name: string;
  fbId: string;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private postService: PostService,
    private sanitizer: DomSanitizer
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
    this.loading = LoadingState.Ready;
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

  addPost() {
    this.form.patchValue({
      location: [this.currentLat, this.currentLong]
    })
    console.log(this.form.value)
    if (this.base64textString == undefined) {
      this.file_error = true
    }
    if (this.form.valid) {
      this.loading = LoadingState.Processing;
      console.log(this.form.value)
      if (!this.file_error) {
        this.postService.postItem(this.form.value).subscribe(
          res => {
            this.loading = LoadingState.Ready;
            this.form.reset();
            console.log(res)
          },
          error => {
            this.loading = LoadingState.Ready;
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
