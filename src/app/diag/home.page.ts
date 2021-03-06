import { Component, OnInit,NgZone } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { Router, NavigationStart, Event } from '@angular/router';
import { Storage } from '@ionic/storage';
import { finalize } from 'rxjs/operators';
import { InteractionService } from '../_services/interaction.service';
import { HomeDataService } from './home-data.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

 
  darkMode: boolean;
  showPrivacyBanner = true;
  showReminder: boolean;

  row_data = []

  constructor(
    private title: Title,
    private interact: InteractionService,
    private modal: ModalController,
    private toast: ToastController,
    private store: Storage,
    private nav: NavController,
    private router: Router,
    private homeData: HomeDataService,
    private http: HttpClient,
    private zone:NgZone
  ) { }

  ngOnInit() {
    this.getdata()
    this.title.setTitle('Doctor Dashboard');
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
       //this.hideModal();
      }
    })
  }

  ionViewDidEnter() {
    this.store.get('DARK_UI').then((mode) => this.darkMode = mode ? true : false);
    this.store.get('BANN_PRIVACY').then((show) => this.showPrivacyBanner = show !== 'N' ? true : false);
  }


  getdata(){
    const formData = new FormData();
    formData.append('token', 'ZXYlmPt6OpAmaLFfjkdjldfjdlM')
    this.http.post("https://projectnothing.xyz/doctorapp/APIs/alldiag.php", formData)
    .pipe(
      finalize(() => {
      })
    )
    .subscribe(res => {
      this.row_data=[]
      this.zone.run(() => {
        var json=JSON.parse(JSON.stringify(res))
        for(var i=0; i<json.length;i++){
          //console.log(json[0])
          this.row_data.push({
            name: json[i].name,
            category:json[i].category,
            address:json[i].address,
            rating:json[i].rating,
            count:Number(json[i].maxlimit),
            status:json[i].status,
            id:json[i].id
          })
        }
      });
  
    });
  }

 

  changeUIMode(e) {
    if (e.detail.checked) {
      this.store.set('DARK_UI', true)
        .then(_ => {
          this.interact.setDarkMode(true);
        });
    } else {
      this.store.set('DARK_UI', false)
        .then(_ => {
          this.interact.setDarkMode(false);
        });
    }
  }

  hideBanner() {
    this.showPrivacyBanner = false;
    this.store.set('BANN_PRIVACY', 'N');
  }

  

  
  async presentToast(msg) {
    const toast = await this.toast.create({
      message: msg,
      position: 'bottom',
      duration: 2000,
    });
    toast.present();
  }


  doRefresh(e) {
  }

  goToProfile() {
    this.hideBanner();
    this.nav.navigateForward('/account/my-profile');
  }
  view_full(id){
    //alert(id)
    this.router.navigateByUrl('/allprofiles/'+id+'/diag');
    //"/doctorprofile/
  }

  // dismissReminder() {
  //   this.showReminder = false;
  // }

}
