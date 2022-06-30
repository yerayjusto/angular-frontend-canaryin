import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Role } from 'src/app/auth/models/user.model';
import {fromBuffer} from 'file-type';
import { FormControl, FormGroup } from '@angular/forms';
import { FileTypeResult } from 'file-type/core';
import { switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, of, Subscription } from 'rxjs';
import { BannerColorService } from '../../services/banner-color.service';
type ValidFileExtension = 'png' | 'jpg' | 'jpeg';
type ValidMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

@Component({
  selector: 'app-profile-summary',
  templateUrl: './profile-summary.component.html',
  styleUrls: ['./profile-summary.component.scss'],
})
export class ProfileSummaryComponent implements OnInit {
  fullName = '';
  form: FormGroup;
  validFileExtensions: ValidFileExtension[] = ['png', 'jpg', 'jpeg' ];
  validMimeTypes: ValidMimeType[] = ['image/png', 'image/jpg', 'image/jpeg' ];
  userFullImagePath: string;
  role: Role = null;
  userId: number;

  private userSubscription: Subscription;

  constructor(private authService: AuthService, public bannerColorService: BannerColorService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      file: new FormControl(null),
    });
    this.userId = this.authService.getUserId();
    this.role = this.authService.getRole();
    this.fullName = this.authService.getFullName();
    this.userFullImagePath = this.authService.getUserFullImagePath();
    this.bannerColorService.bannerColors = this.bannerColorService.getBannerColors(this.role);
  }

  async onFileSelect(event: Event): Promise<any> {
    const file: File = (event.target as HTMLInputElement).files[0];
    if(!file) { return; }
    const formData = new FormData();
    formData.append('file', file);
    from(file.arrayBuffer())
    .pipe(
      switchMap((buffer: Buffer) => from(fromBuffer(buffer)).pipe(
          switchMap((fileTypeResult: FileTypeResult) => {
            if(!fileTypeResult) {
              console.log({
                error: 'File format not supported'});
              return of();
            }
            const { ext, mime } = fileTypeResult;
            const isFileTypeLegit = this.validFileExtensions.includes(ext as any);
            const isMimeTypeLegit = this.validMimeTypes.includes(mime as any);
            const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
            if (!isFileLegit) {
              console.log({
                error: 'File format does not match file extension',
              });
              return of();
            }
            return this.authService.uploadUserImage(formData, this.userId);
          })
        ))
    ).subscribe(async () => {
      await this.authService.refreshtoken(this.userId).subscribe(async data => {
        await this.authService.setToken(data.token);
      this.form.reset();
      window.location.reload();
      });
    });
  }

  // ngOnDestroy() {
  //   this.userSubscription.unsubscribe();
  // }
}
